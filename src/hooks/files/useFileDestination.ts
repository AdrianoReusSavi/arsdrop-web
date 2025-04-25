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
  const fileRefs = useRef<Map<string, ReceivedFile>>(new Map());
  const chunksMap = useRef<Map<string, BlobPart[]>>(new Map());

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

        fileRefs.current.set(meta.name, newFile);
        chunksMap.current.set(meta.name, []);
        setFiles(prev => [...prev, newFile]);
        return;
      }

      if (event.data instanceof ArrayBuffer || event.data instanceof Blob) {
        const fileEntry = Array.from(fileRefs.current.entries()).find(([_, f]) => !f.done && f.received < f.size);
        if (!fileEntry) return;

        const [name, file] = fileEntry;
        const chunks = chunksMap.current.get(name);
        if (!chunks) return;

        const size = event.data instanceof ArrayBuffer ? event.data.byteLength : event.data.size;
        chunks.push(event.data);

        file.received += size;

        fileRefs.current.set(name, file);

        setFiles(prev =>
          prev.map(f =>
            f.name === name ? { ...f, received: file.received } : f
          )
        );

        if (file.received >= file.size && !file.done) {
          const blob = new Blob(chunks, { type: file.type });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          a.click();
          URL.revokeObjectURL(url);

          file.done = true;
          file.blob = blob;
          file.url = url;
          fileRefs.current.set(name, file);

          setFiles(prev =>
            prev.map(f => (f.name === name ? { ...file } : f))
          );
        }
      }
    };

    dataChannel.addEventListener('message', handleMessage);

    return () => {
      dataChannel.removeEventListener('message', handleMessage);
      fileRefs.current.clear();
      chunksMap.current.clear();
    };
  }, [dataChannel]);

  return { files };
}