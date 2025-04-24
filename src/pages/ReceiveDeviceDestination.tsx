import useDestinationConnection from '../hooks/connection/useDestinationConnection';
import { ConnectionRole } from '../enums/connectionRole';
import PageLayout from '../components/layout/PageLayout';
import PanelContainer from '../components/layout/PanelContainer';
import useIsMobile from '../hooks/configs/useIsMobile';
import DeviceInfoPanel from '../components/panels/DeviceInfoPanel';
import useUrlToken from '../hooks/configs/useUrlToken';
import useThemeColors from '../hooks/configs/useThemeColors';

export default function ReceiveDeviceDestination() {
    const { textColor, borderColor, disabledButtonStyle } = useThemeColors();
    const isMobile = useIsMobile();
    const token = useUrlToken();

    const { connected, dataChannel } = useDestinationConnection(token, ConnectionRole.Receiver);

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
            </PanelContainer>
        </PageLayout>
    );
}