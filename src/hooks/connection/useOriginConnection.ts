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
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
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
          await peer.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateJson)));
        });

        connection.on('ReceiveAnswer', async (answerJson: string) => {
          await peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(answerJson)));
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

      try {
        if (connection?.state !== signalR.HubConnectionState.Connected) {
          await connection.start();
          await connection.invoke('JoinPairingSessionAsync', token, 0);
        }

        peer = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            }
          ]
        });

        connection.on('ReceiverReady', async () => {
          const channel = peer.createDataChannel('data');
          setDataChannel(channel);

          channel.onopen = () => setConnected(true);
          channel.onclose = () => setConnected(false);
          channel.onerror = () => setConnected(false);

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
          }
        };

        connection.on('ReceiveIceCandidate', async (candidateJson: string) => {
          await peer.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateJson)));
        });

        connection.on('ReceiveAnswer', async (answerJson: string) => {
          await peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(answerJson)));
        });

      } catch (err) {
        console.error('Falha ao tentar reconectar:', err);
      }
    };

    setupConnection();

    return () => {
      if (connection) connection.stop();
      if (peer) peer.close();
    };
  }, [token]);

  return { connected, loading, dataChannel };
}