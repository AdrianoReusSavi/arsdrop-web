import React from 'react';
import { Layout } from 'antd';
import SupportButton from '../ui/SupportButton';

const { Content } = Layout;

interface PageLayoutProps {
    children: React.ReactNode;
    darkMode: boolean;
    isMobile: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, darkMode, isMobile }) => {
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
            <Content style={{ height: '100vh' }}>
                {children}
            </Content>
            <SupportButton isMobile={isMobile} />
        </Layout>
    );
};

export default PageLayout;