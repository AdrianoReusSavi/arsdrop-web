import { useState } from 'react';

export default function useFileOrigin() {
  const [sending, setSending] = useState(false);

  const sendFiles = async (files: File[], dataChannel: RTCDataChannel) => {
    if (!dataChannel || dataChannel.readyState !== 'open') return;
    setSending(true);

    try {
      for (const file of files) {
        const metadata = JSON.stringify({ name: file.name, type: file.type, size: file.size });
        dataChannel.send(`META:${metadata}`);

        const waitForAcknowledgement = (index: number, file: File) => {
          return new Promise<void>((resolve) => {
            const handleMessage = (event: MessageEvent) => {
              if (typeof event.data === 'string' && event.data === `ACK:${file.name}:${index}`) {
                dataChannel.removeEventListener('message', handleMessage);
                resolve();
              }
            };
        
            dataChannel.addEventListener('message', handleMessage);
          });
        };

        const buffer = await file.arrayBuffer();
        let offset = 0;
        let chunkIndex = 0;

        let baseDelay = 5;
        let chunkSize = 128 * 1024;

        while (offset < buffer.byteLength) {
          const chunk = buffer.slice(offset, Math.min(offset + chunkSize, buffer.byteLength));
          dataChannel.send(chunk);

          try {
            await waitForAcknowledgement(chunkIndex, file);
          } catch (error) {
            dataChannel.send(chunk);
            await waitForAcknowledgement(chunkIndex, file);
          }

          offset += chunk.byteLength;
          chunkIndex++;

          await new Promise(res => setTimeout(res, baseDelay));
        }
      }
    } catch {
    } finally {
      setSending(false);
    }
  };

  return { sendFiles, sending };
}