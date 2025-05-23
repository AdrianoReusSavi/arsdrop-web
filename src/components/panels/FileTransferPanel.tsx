import { List, Progress, Empty } from 'antd';

interface FileTransferPanelProps {
  files: Array<{
    name: string;
    size: number;
    received: number;
    done: boolean;
  }>;
  textColor: string;
  borderColor: string;
}

export default function FileTransferPanel({
  files,
  textColor,
  borderColor,
}: FileTransferPanelProps) {
  return (
    <div style={{ width: '100%' }}>
      <div
        className="custom-scrollbar"
        style={{
          maxHeight: 300,
          overflowY: 'auto',
          border: `2px dashed ${borderColor}`,
          borderRadius: 4,
          padding: 8,
        }}
      >
        <List
          dataSource={files}
          split={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ color: textColor }}>Nenhum arquivo</span>}
              />
            ),
          }}
          renderItem={(file) => (
            <List.Item
              style={{
                padding: '8px 0',
                borderBottom: `1px solid ${borderColor}`,
                color: textColor,
              }}
            >
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{file.name}</div>
                <Progress
                  percent={Math.round((file.received / file.size) * 100)}
                  status={file.done ? 'success' : 'active'}
                  size="small"
                  style={{ marginTop: 4 }}
                  strokeColor={file.done ? '#52c41a' : '#1890ff'}
                  format={(percent) => (
                    <span style={{ color: textColor }}>{percent}%</span>
                  )}
                />
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}