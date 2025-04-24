import { Typography, Spin } from 'antd';
import CustomQrCode from '../ui/CustomQrCode';

const { Paragraph } = Typography;

export default function QrCodePanel({ loading, error, qrCodeUrl, isMobile }: any) {
    if (loading) {
        return <Spin size="large" tip="Carregando QR Code..." />;
    }

    if (error) {
        return <Paragraph type="danger" style={{ color: '#ff4d4f' }}>{error}</Paragraph>;
    }

    if (qrCodeUrl) {
        return (
            <CustomQrCode
                size={isMobile ? 250 : 400}
                value={qrCodeUrl}
                icon="@"
                bordered
            />
        );
    }

    return null;
}