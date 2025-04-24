import { useEffect, useRef, useState } from 'react';

interface ReceivedFile {
    name: string;
    type: string;
    size: number;
    received: number;
    blob?: Blob;
    url?: string;
    done: boolean;
}

export default function useFileDestination(dataChannel: RTCDataChannel | null) {
    const [files, setFiles] = useState<ReceivedFile[]>([]);
    const currentFileRef = useRef<ReceivedFile | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    useEffect(() => {
        if (!dataChannel) return;

        const handleMessage = (event: MessageEvent) => {
            if (typeof event.data === 'string' && event.data.startsWith('META:')) {
                const meta = JSON.parse(event.data.slice(5));
                const newFile: ReceivedFile = {
                    ...meta,
                    received: 0,
                    done: false,
                };

                currentFileRef.current = newFile;
                chunksRef.current = [];

                setFiles(prev => [...prev, newFile]);
                return;
            }

            if (event.data instanceof ArrayBuffer || event.data instanceof Blob) {
                let size = 0;
                if (event.data instanceof ArrayBuffer) {
                    size = event.data.byteLength;
                } else if (event.data instanceof Blob) {
                    size = event.data.size;
                }

                chunksRef.current.push(event.data);

                setFiles(prev =>
                    prev.map(file => {
                        if (file.name !== currentFileRef.current?.name) return file;

                        const updated = {
                            ...file,
                            received: file.received + size,
                        };

                        currentFileRef.current = updated;
                        return updated;
                    })
                );
            }
        };

        const handleClose = () => {
            const file = currentFileRef.current;
            if (!file || chunksRef.current.length === 0) return;

            const blob = new Blob(chunksRef.current, { type: file.type });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);

            setFiles(prev =>
                prev.map(f =>
                    f === file
                        ? { ...f, blob, url, done: true }
                        : f
                )
            );

            currentFileRef.current = null;
            chunksRef.current = [];
        };

        dataChannel.addEventListener('message', handleMessage);
        dataChannel.addEventListener('close', handleClose);

        return () => {
            dataChannel.removeEventListener('message', handleMessage);
            dataChannel.removeEventListener('close', handleClose);
        };
    }, [dataChannel]);

    return { files };
}