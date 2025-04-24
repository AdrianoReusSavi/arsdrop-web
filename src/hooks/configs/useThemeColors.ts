import { useTheme } from '../../contexts/ThemeContext';

const useThemeColors = () => {
    const { darkMode } = useTheme();

    const textColor = darkMode ? '#f0f0f0' : '#000000';
    const borderColor = darkMode ? '#444' : '#ddd';
    const disabledButtonStyle = darkMode ? {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
    } : {
        backgroundColor: 'rgba(239, 239, 239, 0.3)',
        color: 'rgba(16, 16, 16, 0.3)',
        borderColor: 'rgba(118, 118, 118, 0.3)',
    };

    return { textColor, borderColor, disabledButtonStyle };
};

export default useThemeColors;