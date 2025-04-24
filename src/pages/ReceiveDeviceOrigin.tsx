import PanelContainer from '../components/layout/PanelContainer';
import FileTransferPanel from '../components/panels/FileTransferPanel';
import QrCodePanel from '../components/panels/QrCodePanel';
import useReceiveQrCode from '../hooks/qr-code/useReceiveQrCode';
import useOriginConnection from '../hooks/connection/useOriginConnection';
import useFileDestination from '../hooks/files/useFileDestination';
import useIsMobile from '../hooks/configs/useIsMobile';
import PageLayout from '../components/layout/PageLayout';
import useThemeColors from '../hooks/configs/useThemeColors';

export default function ReceiveDeviceOrigin() {
    const { textColor, borderColor } = useThemeColors();
    const isMobile = useIsMobile();
    const { qrCodeUrl, token, loading, error } = useReceiveQrCode();

    const { dataChannel } = useOriginConnection(token);
    const { files } = useFileDestination(dataChannel);

    return (
        <PageLayout>
            <PanelContainer isMobile={isMobile} borderColor={borderColor}>
                <FileTransferPanel files={files} textColor={textColor} borderColor={borderColor} />
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