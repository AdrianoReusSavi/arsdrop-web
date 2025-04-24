import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { ConnectionRole } from '../../enums/connectionRole';

export default function useDestinationConnection(token: string | null, role: ConnectionRole) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  const signalrUrl = import.meta.env.VITE_SIGNALR_URL;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!token) return;

    const setupConnection = async () => {
      setLoading(true);

      try {
        let url: string | null = null;

        switch (role) {
          case ConnectionRole.Sender:
            url = `${apiBaseUrl}/Send/validate`;
            break;
          case ConnectionRole.Receiver:
            url = `${apiBaseUrl}/Receive/validate`;
            break;
          default:
            return;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Token': token },
        });

        if (!response.ok) return;

        const connection = new signalR.HubConnectionBuilder()
          .withUrl(signalrUrl)
          .withAutomaticReconnect()
          .build();

        const peer = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        peer.ondatachannel = (event) => {
          const channel = event.channel;
          setDataChannel(channel);
          channel.onopen = () => setConnected(true);
        };

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            connection.invoke('ExchangeIceCandidateAsync', token, JSON.stringify(event.candidate));
          }
        };

        connection.on('ReceiveOffer', async (offerJson: string) => {
          const offer = JSON.parse(offerJson);
          await peer.setRemoteDescription(new RTCSessionDescription(offer));

          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);

          await connection.invoke('ExchangeAnswerAsync', token, JSON.stringify(answer));
        });

        connection.on('ReceiveIceCandidate', async (candidateJson: string) => {
          const candidate = new RTCIceCandidate(JSON.parse(candidateJson));
          await peer.addIceCandidate(candidate);
        });

        await connection.start();
        await connection.invoke('JoinPairingSessionAsync', token, 1);
      } catch (err) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    setupConnection();
  }, [token, role]);

  return { connected, loading, dataChannel };
}