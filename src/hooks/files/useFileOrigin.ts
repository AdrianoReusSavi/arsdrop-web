import { useState } from 'react';

export default function useFileOrigin() {
  const [sending, setSending] = useState(false);

  const sendFiles = async (files: File[], dataChannel: RTCDataChannel) => {
    if (!dataChannel || dataChannel.readyState !== 'open') return;
    setSending(true);

    try {
      for (const file of files) {
        const chunkSize = 128 * 1024;
        const metadata = JSON.stringify({ name: file.name, type: file.type, size: file.size });
        dataChannel.send(`META:${metadata}`);

        const buffer = await file.arrayBuffer();
        let offset = 0;

        while (offset < buffer.byteLength) {
          const chunk = buffer.slice(offset, offset + chunkSize);
          dataChannel.send(chunk);
          offset += chunkSize;
          await new Promise(res => setTimeout(res, 5));
        }
      }
    } catch {}
    setSending(false);
  };

  return { sendFiles, sending };
}