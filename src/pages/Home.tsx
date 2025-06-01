import { Skeleton } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { useConnection } from '../contexts/ConnectionContext';
import useIsMobile from '../hooks/configs/useIsMobile';
import PageLayout from '../components/layout/PageLayout';
import PanelContainer from '../components/layout/PanelContainer';
import useThemeColors from '../hooks/configs/useThemeColors';
import HomePanel from '../components/panels/HomePanel';
import ConnectionPanel from '../components/panels/ConnectionPanel';

export default function Home() {
    const { darkMode } = useTheme();
    const isMobile = useIsMobile();
    const { borderColor } = useThemeColors();
    const { ready, connected } = useConnection();

    if (!ready) {
        <PageLayout darkMode={darkMode} isMobile={isMobile}>
            <PanelContainer isMobile={isMobile} borderColor={borderColor}>
                <Skeleton active />
                <Skeleton.Image active />
            </PanelContainer>
        </PageLayout>
    }

    return (
        <PageLayout darkMode={darkMode} isMobile={isMobile}>
            <PanelContainer isMobile={isMobile} borderColor={borderColor}>
                <HomePanel
                    darkMode={darkMode}
                />
                <ConnectionPanel
                    isMobile={isMobile}
                    scanned={connected}
                />
            </PanelContainer>
        </PageLayout>
    );
}