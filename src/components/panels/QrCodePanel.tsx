import { Typography } from 'antd';
import CustomQrCode from '../ui/CustomQrCode';

const { Paragraph } = Typography;

export default function QrCodePanel({ loading, error, qrCodeUrl, isMobile }: any) {
    let status: 'loading' | 'expired' | 'active' | 'scanned' = 'active';

    if (loading) {
        status = 'loading';
    } else if (error) {
        status = 'expired';
    }

    if (qrCodeUrl) {
        return (
            <CustomQrCode
                size={isMobile ? 250 : 400}
                value={qrCodeUrl}
                status={status}
            />
        );
    }

    return null;
}