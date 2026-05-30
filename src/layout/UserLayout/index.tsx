import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import { Layout, MenuProps } from 'antd';
import { customHistory } from '../../routes/History';
import { clearLocalStorage, generateItemKey } from '../../utils/general';
import MenuItem from './MenuItem/MenuItem';
import ButtonIcon from '../../components/ButtonIcon';
import Dropdown from '../../components/DropDown';
import SocketStatus from '../../components/SocketStatus';
import LogoutOutlined from '../../assets/svg/LogoutOutlined.svg?react';
import ChangePassword from '../../assets/svg/ChangePassword.svg?react';
import VersionIcon from '../../assets/svg/Version.svg?react';
import MenuUnfoldOutlined from '../../assets/svg/MenuUnfoldOutlined.svg?react';
import MenuFoldOutlined from '../../assets/svg/MenuFoldOutlined.svg?react';
import UserOutlined from '../../assets/svg/UserOutlined.svg?react';
import Logo from '../../assets/svg/Logo.svg?react';
import LanguageSelector from '../../components/LanguageSelector';
import styles from './styles.module.scss';

export default function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Sider, Content } = Layout;
  const { t } = useTranslation();

  const handleLogOut = () => {
    clearLocalStorage();
    customHistory.push('/auth/login');
  };

  const items: MenuProps['items'] = [
    {
      label: t('logout'),
      key: generateItemKey(),
      icon: <LogoutOutlined />,
      onClick: handleLogOut,
    },
    {
      label: <Link to={'/changepassword'}>{t('changePassword')}</Link>,
      key: generateItemKey(),
      icon: <ChangePassword />,
      onClick: () => {},
    },
  ];

  return (
    <Layout className={styles['c-layout']}>
      <Sider className={styles['c-layout__sider']} trigger={null} collapsible collapsed={collapsed}>
        <div>
          {!collapsed ? (
            <div className={styles['c-layout__logoWrapper']}>
              <Logo />
              <span>Payment</span>
            </div>
          ) : (
            <div className={styles['c-layout__logoWrapper']}>
              <Logo />
            </div>
          )}
        </div>

        <MenuItem />
        <div className={styles['c-layout__sider__version']}>
          <VersionIcon />
          Version: {APP_VERSION}
        </div>
      </Sider>
      <Layout className={styles['c-layout__mainlayout']}>
        <Header className={styles['c-layout__header']}>
          <ButtonIcon type='ghost' icon={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} handleClick={() => setCollapsed(!collapsed)} />
          <div className={styles['c-layout__headerMenu']}>
            <LanguageSelector />
            <SocketStatus />
            <Dropdown
              menu={items}
              icon={
                <div className={styles['c-layout__profileLogo']}>
                  <UserOutlined />
                </div>
              }></Dropdown>
          </div>
        </Header>
        <Content className={styles['c-layout__content']}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
