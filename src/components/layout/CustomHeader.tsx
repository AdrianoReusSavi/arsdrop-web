import { Layout, Menu, Switch } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const { Header } = Layout;

export default function CustomHeader() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Header style={styles.header(darkMode)}>
      <div style={styles.innerContainer}>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="horizontal"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          style={styles.menu}
        >
          <Menu.Item key="/">Home</Menu.Item>
          <Menu.Item key="/sendOrigin">Enviar</Menu.Item>
          <Menu.Item key="/receiveOrigin">Receber</Menu.Item>
        </Menu>

        <Switch
          className="custom-switch"
          checked={!darkMode}
          onChange={toggleDarkMode}
          checkedChildren="☀️"
          unCheckedChildren="🌙"
        />

      </div>
    </Header>
  );
}

const styles = {
  header: (darkMode: boolean) => ({
    backgroundColor: darkMode ? '#141414' : '#f0f2f5',
    boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.1)',
    padding: 0,
    width: '100%',
  }),
  innerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem',
    height: '100%',
    flexWrap: 'wrap' as const,
  },
  menu: {
    flex: 1,
    minWidth: 0,
    background: 'transparent',
    borderBottom: 'none',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  themeButton: (darkMode: boolean) => ({
    background: darkMode ? '#333' : '#e6e6e6',
    color: darkMode ? '#fff' : '#000',
    border: 'none',
    borderRadius: '4px',
    padding: '0.4rem 0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  }),
};