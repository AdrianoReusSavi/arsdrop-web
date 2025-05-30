import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export default function useDestinationConnection(token: string | null) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  const signalrUrl = import.meta.env.VITE_SIGNALR_URL;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const turn_udp = import.meta.env.VITE_TURN_UDP;
  const turn_tcp = import.meta.env.VITE_TURN_TCP;
  const username = import.meta.env.VITE_TURN_USERNAME;
  const credential = import.meta.env.VITE_TURN_CREDENTIAL;

  useEffect(() => {
    if (!token) return;

    let connection: signalR.HubConnection;
    let peer: RTCPeerConnection;
    const iceQueue: RTCIceCandidateInit[] = [];
    let remoteDescSet = false;

    const setupConnection = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${apiBaseUrl}/Connect/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Token': token },
        });

        if (!response.ok) return;

        connection = new signalR.HubConnectionBuilder()
          .withUrl(signalrUrl)
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: () => 3000,
          })
          .configureLogging(signalR.LogLevel.Information)
          .build();

        connection.serverTimeoutInMilliseconds = 60000;
        connection.keepAliveIntervalInMilliseconds = 20000;

        peer = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: [turn_udp, turn_tcp],
              username: username,
              credential: credential
            }
          ]
        });

        peer.ondatachannel = (event) => {
          const channel = event.channel;
          setDataChannel(channel);

          channel.onopen = () => setConnected(true);
          channel.onclose = () => {
            setConnected(false);
            attemptReconnect();
          };
          channel.onerror = () => {
            setConnected(false);
            attemptReconnect();
          };
        };

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            connection.invoke('ExchangeIceCandidateAsync', token, JSON.stringify(event.candidate));
          }
        };

        peer.onconnectionstatechange = () => {
          const state = peer.connectionState;
          if (state === 'disconnected' || state === 'failed' || state === 'closed') {
            setConnected(false);
            attemptReconnect();
          }
        };

        connection.on('ReceiveOffer', async (offerJson: string) => {
          const offer = JSON.parse(offerJson);
          await peer.setRemoteDescription(new RTCSessionDescription(offer));
          remoteDescSet = true;

          for (const c of iceQueue) {
            await peer.addIceCandidate(new RTCIceCandidate(c));
          }
          iceQueue.length = 0;

          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          await connection.invoke('ExchangeAnswerAsync', token, JSON.stringify(answer));
        });

        connection.on('ReceiveIceCandidate', async (candidateJson: string) => {
          const candidate = JSON.parse(candidateJson);
          if (remoteDescSet) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            iceQueue.push(candidate);
          }
        });

        await connection.start();
        await connection.invoke('JoinPairingSessionAsync', token, 1);
      } catch (err) {
        console.error('Erro na conexão inicial', err);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    const attemptReconnect = async () => {
      console.warn('Tentando reconectar...');
    };

    setupConnection();

    return () => {
      if (connection) connection.stop();
      if (peer) peer.close();
    };
  }, [token]);

  return { connected, loading, dataChannel };
}
