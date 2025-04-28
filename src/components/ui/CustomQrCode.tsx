import { QRCode, QRCodeProps } from 'antd';

type QRStatus = 'active' | 'expired' | 'loading' | 'scanned';

interface CustomQrCodeProps {
  value: string;
  size: number;
  status?: QRStatus;
  statusRender: QRCodeProps['statusRender']
}

const CustomQrCode: React.FC<CustomQrCodeProps> = ({ value, size, status = 'active', statusRender }) => {
  return (
    <QRCode
      size={size}
      value={value}
      bordered
      type="svg"
      errorLevel="L"
      status={status}
      bgColor={'rgb(255, 255, 255)'}
      statusRender={statusRender}
    />
  );
};

export default CustomQrCode;