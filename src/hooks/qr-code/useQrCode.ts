import { useEffect, useState } from 'react';
import { useConnection } from '../../contexts/ConnectionContext';

interface QrCodeResponse {
    token: string;
}

export default function useQrCode() {
    const { setToken, isOrigin, ready } = useConnection();
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

    useEffect(() => {
        if (!ready) return;

        if (!isOrigin) {
            setLoading(false);
            return;
        }

        const fetchQrCodeUrl = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/Connect/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar o QR Code');
                }

                const data: QrCodeResponse = await response.json();
                const encodedToken = btoa(data.token);
                setQrCodeUrl(`${frontendUrl}/?token=${encodedToken}`);
                setToken(data.token);
            } catch (err: any) {
                setError(err.message || 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };

        fetchQrCodeUrl();
    }, [ready, isOrigin]);

    return { qrCodeUrl, loading, error };
}