import { Typography } from 'antd';
import CustomUpload from '../ui/CustomUpload';

const { Title, Paragraph } = Typography;

export default function DeviceInfoPanel({ connected, dataChannel, textColor, borderColor, disabledButtonStyle }: any) {
    return (
        <>
            <Title style={{ color: textColor }}>Envio de arquivos</Title>
            <Paragraph style={{ color: textColor }}>
                Escaneie o código QR para conectar seu dispositivo
            </Paragraph>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CustomUpload
                    connected={connected}
                    dataChannel={dataChannel}
                    textColor={textColor}
                    borderColor={borderColor}
                    disabledButtonStyle={disabledButtonStyle}
                />
            </div>
        </>
    );
}