import { useEffect, useState } from 'react';
import { Button, Space, QRCodeProps, Spin, Drawer } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import CustomQrCode from "../ui/CustomQrCode";
import useQrCode from "../../hooks/qr-code/useQrCode";
import SendPage from '../../pages/SendPage';
import ReceivePage from '../../pages/ReceivePage';
import { useConnection } from '../../contexts/ConnectionContext';
import SharePage from '../../pages/SharePage';

interface ConnectionPanelProps {
    isMobile: boolean;
    scanned: boolean;
}

type Status = 'loading' | 'expired' | 'active' | 'scanned';

const getStatus = (loading: boolean, scanned: boolean, error: string): Status => {
    if (scanned) {
        return 'scanned';
    } else if (loading) {
        return 'loading';
    } else if (error) {
        return 'expired';
    }
    return 'active';
};

const getStatusRender = (): QRCodeProps['statusRender'] => {
    return (info) => {
        if (info.status === 'scanned') {
            return (
                <div>
                    <CheckCircleFilled style={{ color: 'green' }} /> {'Lido'}
                </div>
            );
        } else if (info.status === 'loading') {
            return (
                <Space direction="vertical" align="center">
                    <Spin />
                    <p>Carregando...</p>
                </Space>
            );
        } else if (info.status === 'expired') {
            return (
                <div>
                    <CloseCircleFilled style={{ color: 'red' }} /> {'Expirado'}
                </div>
            );
        } else {
            return <Space direction="vertical" />;
        }
    };
};

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({ isMobile, scanned }) => {
    const { qrCodeUrl, loading, error } = useQrCode();
    const status = getStatus(loading, scanned, error!);
    const statusRender = getStatusRender();
    const { dataChannel, isOrigin } = useConnection();

    const [drawerType, setDrawerType] = useState<null | 'send' | 'receive' | 'share'>(null);
    const [title, setTitle] = useState('');

    const handleOpenSend = () => {
        if (isOrigin && dataChannel && dataChannel.readyState === 'open') {
            dataChannel.send('open:send');
        }
        setDrawerType('send');
        setTitle('Enviar arquivos');
    };

    const handleOpenReceive = () => {
        if (isOrigin && dataChannel && dataChannel.readyState === 'open') {
            dataChannel.send('open:receive');
        }
        setDrawerType('receive');
        setTitle('Receber arquivos');
    };
    
    const handleOpenShare = () => {
        if (isOrigin && dataChannel && dataChannel.readyState === 'open') {
            dataChannel.send('open:share');
        }
        setDrawerType('share');
        setTitle('Texto compartilhado');
    };

    const handleCloseDrawer = () => {
        if (isOrigin && dataChannel && dataChannel.readyState === 'open') {
            dataChannel.send('close');
        }
        setDrawerType(null);
        setTitle('');
    };

    useEffect(() => {
        if (!dataChannel) return;

        const handleMessage = (event: MessageEvent) => {
            if (typeof event.data !== 'string') return;

            if (event.data === 'open:send') {
                setDrawerType('send');
                setTitle('Receber arquivos');
            } else if (event.data === 'open:receive') {
                setDrawerType('receive');
                setTitle('Enviar arquivos');
            } else if (event.data === 'open:share') {
                setDrawerType('share');
                setTitle('Texto compartilhado');
            } else if (event.data === 'close') {
                setDrawerType(null);
                setTitle('');
            }
        };

        dataChannel.addEventListener('message', handleMessage);

        return () => {
            dataChannel.removeEventListener('message', handleMessage);
        };
    }, [dataChannel]);

    return (
        <div>
            {isOrigin && (
                <div>
                    <CustomQrCode
                        size={isMobile ? 250 : 350}
                        value={status === 'loading' || qrCodeUrl === null ? 'loading' : qrCodeUrl}
                        status={status}
                        statusRender={statusRender}
                    />
                    <Space direction="vertical" style={{ marginTop: 24 }}>
                        <Button
                            disabled={!scanned}
                            style={{ width: isMobile ? 250 : 350 }}
                            onClick={handleOpenSend}
                        >
                            Enviar arquivos
                        </Button>
                        <Button
                            disabled={!scanned}
                            style={{ width: isMobile ? 250 : 350 }}
                            onClick={handleOpenReceive}
                        >
                            Receber arquivos
                        </Button>
                        <Button
                            disabled={!scanned}
                            style={{ width: isMobile ? 250 : 350 }}
                            onClick={handleOpenShare}
                        >
                            Compartilhar texto
                        </Button>
                    </Space>
                </div>
            )}
            <Drawer
                title={title}
                placement={isMobile ? "bottom" : "left"}
                onClose={handleCloseDrawer}
                open={drawerType !== null}
                width={isMobile ? "100%" : "50%"}
                height={isMobile ? "66%" : "100%"}
            >
                {drawerType === 'send' && <SendPage />}
                {drawerType === 'receive' && <ReceivePage />}
                {drawerType === 'share' && <SharePage />}
            </Drawer>
        </div>
    );
};

export default ConnectionPanel;