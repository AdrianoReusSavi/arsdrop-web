import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface PageLayoutProps {
    children: React.ReactNode;
    darkMode: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, darkMode }) => {
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
        </Layout>
    );
};

export default PageLayout;