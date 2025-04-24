import useSendQrCode from '../hooks/qr-code/useSendQrCode';
import useOriginConnection from '../hooks/connection/useOriginConnection';
import useIsMobile from '../hooks/configs/useIsMobile';
import PanelContainer from '../components/layout/PanelContainer';
import DeviceInfoPanel from '../components/panels/DeviceInfoPanel';
import QrCodePanel from '../components/panels/QrCodePanel';
import PageLayout from '../components/layout/PageLayout';
import useThemeColors from '../hooks/configs/useThemeColors';

export default function SendDeviceOrigin() {
    const { textColor, borderColor, disabledButtonStyle } = useThemeColors();
    const isMobile = useIsMobile();
    const { qrCodeUrl, token, loading, error } = useSendQrCode();
    const { connected, dataChannel } = useOriginConnection(token);

    return (
        <PageLayout>
            <PanelContainer isMobile={isMobile} borderColor={borderColor}>
                <DeviceInfoPanel
                    connected={connected}
                    token={token}
                    dataChannel={dataChannel}
                    textColor={textColor}
                    borderColor={borderColor}
                    disabledButtonStyle={disabledButtonStyle}
                />
                <QrCodePanel
                    loading={loading}
                    error={error}
                    qrCodeUrl={qrCodeUrl}
                    isMobile={isMobile}
                />
            </PanelContainer>
        </PageLayout>
    );
}