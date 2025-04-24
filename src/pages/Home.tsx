import { Layout, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import CustomHeader from '../components/layout/CustomHeader';
import WaterDrop from '../components/ui/WaterDrop';
import { useTheme } from '../contexts/ThemeContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const { darkMode } = useTheme();

    return (
        <Layout
            style={{
                width: '100vw',
                height: '100vh',
                background: darkMode ? '#1f1f1f' : '#ffffff',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CustomHeader />

            {isHome && (
                <Content style={styles.content}>
                    {/* WaterDrop no fundo */}
                    <div style={styles.waterDropContainer}>
                        <WaterDrop />
                    </div>

                    {/* Conteúdo centralizado */}
                    <div style={styles.textContainer}>
                        <Title style={styles.title(darkMode)}>arsdrop</Title>
                        <Paragraph style={styles.paragraph(darkMode)}>
                            Uma forma rápida, segura e offline de transferir arquivos usando QR Codes.
                            <br />
                            Não precisa instalar nada, nem criar conta. Simples e direto ao ponto.
                        </Paragraph>
                    </div>
                </Content>
            )}
        </Layout>
    );
}

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
