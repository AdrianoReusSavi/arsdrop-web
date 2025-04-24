import { QRCode } from 'antd';

interface CustomQrCodeProps {
  value: string;
  size: number;
  icon: string;
  bordered: boolean;
}

const CustomQrCode: React.FC<CustomQrCodeProps> = ({ value, size, icon, bordered }) => {
  return (
    <QRCode
      size={size}
      value={value}
      icon={icon}
      bordered={bordered}
    />
  );
};

export default CustomQrCode;