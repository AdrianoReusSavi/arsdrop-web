import useDestinationConnection from '../hooks/connection/useDestinationConnection';
import useFileDestination from '../hooks/files/useFileDestination';
import { ConnectionRole } from '../enums/connectionRole';
import useIsMobile from '../hooks/configs/useIsMobile';
import PageLayout from '../components/layout/PageLayout';
import PanelContainer from '../components/layout/PanelContainer';
import FileTransferPanel from '../components/panels/FileTransferPanel';
import useUrlToken from '../hooks/configs/useUrlToken';
import useThemeColors from '../hooks/configs/useThemeColors';

export default function SendDeviceDestination() {
    const { textColor, borderColor } = useThemeColors();
    const isMobile = useIsMobile();
    const token = useUrlToken();

    const { dataChannel } = useDestinationConnection(token, ConnectionRole.Sender);
    const { files } = useFileDestination(dataChannel);

    return (
        <PageLayout>
            <PanelContainer isMobile={isMobile} borderColor={borderColor}>
                <FileTransferPanel files={files} textColor={textColor} borderColor={borderColor} />
            </PanelContainer>
        </PageLayout>
    );
}