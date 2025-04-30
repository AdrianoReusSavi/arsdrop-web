import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export default function useOriginConnection(token: string | null) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  const signalrUrl = import.meta.env.VITE_SIGNALR_URL;

  useEffect(() => {
    if (!token) return;

    let connection: signalR.HubConnection;
    let peer: RTCPeerConnection;
    const iceQueue: RTCIceCandidateInit[] = [];
    let remoteDescSet = false;

    const setupConnection = async () => {
      setLoading(true);

      try {
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
            {
              urls: 'turn:openrelay.metered.ca:443?transport=tcp',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            }
          ]
        });

        connection.on('ReceiverReady', async () => {
          const channel = peer.createDataChannel('data');
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

          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          await connection.invoke('ExchangeOfferAsync', token, JSON.stringify(offer));
        });

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

        connection.on('ReceiveIceCandidate', async (candidateJson: string) => {
          const candidate = JSON.parse(candidateJson);
          if (remoteDescSet) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            iceQueue.push(candidate);
          }
        });

        connection.on('ReceiveAnswer', async (answerJson: string) => {
          const answer = JSON.parse(answerJson);
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
          remoteDescSet = true;

          for (const c of iceQueue) {
            await peer.addIceCandidate(new RTCIceCandidate(c));
          }
          iceQueue.length = 0;
        });

        await connection.start();
        await connection.invoke('JoinPairingSessionAsync', token, 0);
      } catch (error) {
        console.error('Erro na conexão inicial', error);
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