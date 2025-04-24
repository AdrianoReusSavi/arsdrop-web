import { QRCode } from 'antd';

type QRStatus = 'active' | 'expired' | 'loading' | 'scanned';

interface CustomQrCodeProps {
  value: string;
  size: number;
  status?: QRStatus;
}

const CustomQrCode: React.FC<CustomQrCodeProps> = ({ value, size, status = 'active' }) => {
  return (
    <QRCode
      size={size}
      value={value}
      bordered
      errorLevel="L"
      status={status}
      bgColor={'rgb(255, 255, 255)'}
    />
  );
};

export default CustomQrCode;