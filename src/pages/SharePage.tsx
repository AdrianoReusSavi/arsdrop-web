import { useEffect, useRef, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import useThemeColors from '../hooks/configs/useThemeColors';
import { useConnection } from '../contexts/ConnectionContext';
import { Button, Space } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

export default function SharePage() {
    const { textColor, borderColor } = useThemeColors();
    const { dataChannel } = useConnection();
    const [value, setValue] = useState('');
    const timeoutRef = useRef<number | null>(null);

    const sendTextUpdate = (text: string) => {
        if (dataChannel && dataChannel.readyState === 'open') {
            dataChannel.send(JSON.stringify({
                type: 'text-update',
                content: text,
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            sendTextUpdate(newValue);
        }, 300);
    };

    useEffect(() => {
        if (!dataChannel) return;

        const handleMessage = (event: MessageEvent) => {
            if (typeof event.data !== 'string') return;

            try {
                const message = JSON.parse(event.data);
                if (message.type === 'text-update') {
                    setValue(message.content);
                }
            } catch (error) {
                console.error('Mensagem inválida recebida:', error);
            }
        };

        dataChannel.addEventListener('message', handleMessage);

        return () => {
            dataChannel.removeEventListener('message', handleMessage);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [dataChannel]);

    const handleCopy = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(value);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = value;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
        } catch { }
    };
    
    const handleClear = () => {
        setValue('');
        sendTextUpdate('');
    };

    return (
        <div>
            <TextArea
                value={value}
                onChange={handleChange}
                autoSize={{ minRows: 5, maxRows: 10 }}
                style={{
                    color: textColor,
                    borderColor: borderColor,
                    backgroundColor: 'transparent',
                    marginBottom: 16,
                }}
            />
            <Space>
                <Button icon={<CopyOutlined />} onClick={handleCopy}>
                    Copiar
                </Button>
                <Button icon={<DeleteOutlined />} danger onClick={handleClear}>
                    Limpar
                </Button>
            </Space>
        </div>
    );
}