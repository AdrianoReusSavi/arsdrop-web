import { useState } from 'react';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, message, Upload, List, Typography } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import useFileOrigin from '../../hooks/files/useFileOrigin';

const { Dragger } = Upload;
const { Text } = Typography;

interface CustomUploadProps {
  connected: boolean;
  dataChannel: RTCDataChannel | null;
  textColor: string;
  borderColor: string;
  disabledButtonStyle: React.CSSProperties
}

const CustomUpload: React.FC<CustomUploadProps> = ({ connected, dataChannel, textColor, borderColor, disabledButtonStyle }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { sendFiles, sending } = useFileOrigin();

  const handleUpload = async () => {
    if (!dataChannel || !connected) {
      message.warning('Canal não conectado');
      return;
    }

    const files = fileList.map(f => f.originFileObj).filter(Boolean) as File[];
    if (files.length === 0) return;

    try {
      await sendFiles(files, dataChannel);
      message.success('Arquivos enviados com sucesso');
      setFileList([]);
    } catch {
      message.error('Erro ao enviar arquivos');
    }
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const props: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      const newFileList = fileList.filter(item => item.uid !== file.uid);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const customFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        originFileObj: file,
      };
      setFileList(prevList => [...prevList, customFile]);
      return false;
    },
    showUploadList: false,
    fileList,
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpload();
  };

  return (
    <div style={{ width: '100%' }}>
      <Dragger
        {...props}
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: 'transparent',
          border: `2px dashed ${borderColor}`,
          color: textColor,
        }}
      >
        <p className="ant-upload-drag-icon" style={{ color: textColor }}>
          <InboxOutlined />
        </p>
        <p className="ant-upload-text" style={{ color: textColor }}>
          Clique ou arraste arquivos para esta área
        </p>

        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            onClick={handleButtonClick}
            disabled={fileList.length === 0 || !connected || sending}
            loading={sending}
            style={disabledButtonStyle}
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </Dragger>

      {fileList.length > 0 && (
        <div
          className="custom-scrollbar"
          style={{
            marginTop: 16,
            maxHeight: 150,
            overflowY: 'auto',
            padding: '8px',
            border: `1px solid ${borderColor}`,
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}
        >
          <List
            size="small"
            dataSource={fileList}
            renderItem={(item) => (
              <List.Item
                style={{
                  color: textColor,
                  fontSize: '12px',
                  padding: '4px 8px',
                }}
                actions={[
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleRemove(item)}
                    style={{
                      color: textColor,
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  />
                ]}
              >
                <Text style={{ color: textColor, fontSize: '12px' }}>{item.name}</Text>
              </List.Item>
            )}
          />
        </div>
      )}

    </div>
  );
};

export default CustomUpload;