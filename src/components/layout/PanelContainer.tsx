import React from 'react';

interface PanelContainerProps {
    isMobile: boolean;
    borderColor?: string;
    children: React.ReactNode | [React.ReactNode, React.ReactNode];
}

const PanelContainer: React.FC<PanelContainerProps> = ({
    isMobile,
    borderColor = '#ddd',
    children,
}) => {
    let left: React.ReactNode = null;
    let right: React.ReactNode = null;

    if (Array.isArray(children)) {
        [left, right] = children;
    } else {
        left = children;
    }

    const containerClass = isMobile ? 'panel-container column' : 'panel-container row';
    const leftClass = `panel-left ${isMobile ? 'mobile' : 'desktop'} ${right ? 'has-right' : ''}`;
    const rightClass = `panel-right ${isMobile ? 'mobile' : 'desktop'}`;

    return (
        <div className={containerClass}>
            <div className={leftClass} style={{ borderColor }}>
                {left}
            </div>
            {right && (
                <div className={rightClass}>
                    {right}
                </div>
            )}
        </div>
    );
};

export default PanelContainer;