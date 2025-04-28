import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useOriginConnection from '../hooks/connection/useOriginConnection';
import useDestinationConnection from '../hooks/connection/useDestinationConnection';

interface ConnectionContextProps {
  isOrigin: boolean;
  connected: boolean;
  dataChannel: RTCDataChannel | null;
  token: string | null;
  setToken: (token: string) => void;
  ready: boolean;
}

const ConnectionContext = createContext<ConnectionContextProps | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [isOrigin, setIsOrigin] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedToken = urlParams.get('token');

    if (encodedToken) {
      const decodedToken = atob(encodedToken);
      setToken(decodedToken);
      setIsOrigin(false);
    } else {
      setIsOrigin(true);
    }
    setReady(true);
  }, [location.search]);

  const origin = useOriginConnection(isOrigin ? token : null);
  const destination = useDestinationConnection(!isOrigin ? token : null);

  const dataChannel = isOrigin ? origin.dataChannel : destination.dataChannel;
  const connected = isOrigin ? origin.connected : destination.connected;

  console.log("dataChannel:" + dataChannel);

  return (
    <ConnectionContext.Provider value={{ isOrigin, connected, dataChannel, token, setToken, ready }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection deve ser usado dentro de ConnectionProvider');
  }
  return context;
}