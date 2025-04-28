import { Layout, Typography } from 'antd';
import WaterDrop from '../ui/WaterDrop';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface HomePanelProps {
    darkMode: boolean;
}

const HomePanel: React.FC<HomePanelProps> = ({ darkMode }) => {
    return (
        <Content style={styles.content}>
            <div style={styles.waterDropContainer}>
                <WaterDrop />
            </div>
            <div style={styles.textContainer}>
                <Title style={styles.title(darkMode)}>arsdrop</Title>
                <Paragraph style={styles.paragraph(darkMode)}>
                    O jeito mais fácil de transferir arquivos via navegador.
                </Paragraph>
            </div>
        </Content>
    );
};

export default HomePanel;

const styles = {
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        padding: '2rem',
        position: 'relative' as const,
    },
    waterDropContainer: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        pointerEvents: 'none' as const,
    },
    textContainer: {
        textAlign: 'center' as const,
        zIndex: 1,
        maxWidth: '600px',
        padding: '2rem',
    },
    title: (darkMode: boolean) => ({
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 700,
        color: darkMode ? '#fff' : '#222',
        marginBottom: '1rem',
    }),
    paragraph: (darkMode: boolean) => ({
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        color: darkMode ? '#ccc' : '#555',
        lineHeight: 1.6,
    }),
};