import { useEffect, useState } from 'react';

export default function useUrlToken(): string | null {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedToken = urlParams.get('token');

        if (encodedToken) {
            try {
                const decodedToken = atob(encodedToken);
                setToken(decodedToken);
            }
            catch {
                setToken(null);
            }
        }
    }, []);

    return token;
}