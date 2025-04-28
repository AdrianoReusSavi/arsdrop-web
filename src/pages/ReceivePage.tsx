import DeviceInfoPanel from '../components/panels/DeviceInfoPanel';
import useThemeColors from '../hooks/configs/useThemeColors';
import { useConnection } from '../contexts/ConnectionContext';
import FileTransferPanel from '../components/panels/FileTransferPanel';
import useFileDestination from '../hooks/files/useFileDestination';

export default function ReceivePage() {
    const { textColor, borderColor, disabledButtonStyle } = useThemeColors();
    const { isOrigin, connected, dataChannel, token } = useConnection();
    const { files } = useFileDestination(dataChannel);

    return (
        <>
            {!isOrigin && (
                <DeviceInfoPanel
                    connected={connected}
                    token={token}
                    dataChannel={dataChannel}
                    textColor={textColor}
                    borderColor={borderColor}
                    disabledButtonStyle={disabledButtonStyle}
                />
            )}
            {isOrigin && (
                <FileTransferPanel files={files} textColor={textColor} borderColor={borderColor} />
            )}
        </>
    );
}