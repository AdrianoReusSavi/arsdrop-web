import CustomUpload from '../ui/CustomUpload';

export default function DeviceInfoPanel({ connected, dataChannel, textColor, borderColor, disabledButtonStyle }: any) {
    return (
        <CustomUpload
            connected={connected}
            dataChannel={dataChannel}
            textColor={textColor}
            borderColor={borderColor}
            disabledButtonStyle={disabledButtonStyle}
        />
    );
}