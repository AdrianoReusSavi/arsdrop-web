import React from 'react';
import { Layout } from 'antd';
import CustomHeader from './CustomHeader';
import { useTheme } from '../../contexts/ThemeContext';

const { Content } = Layout;

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    const { darkMode } = useTheme();

    const textColor = darkMode ? '#f0f0f0' : '#000000';

    return (
        <Layout
            style={{
                width: '100vw',
                minHeight: '100vh',
                background: darkMode ? '#1f1f1f' : '#ffffff',
                color: textColor,
            }}
        >
            <CustomHeader />
            <Content style={{ height: 'calc(100vh - 64px)' }}>
                {children}
            </Content>
        </Layout>
    );
};

export default PageLayout;