import { useMemo, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Badge } from 'antd';
import { getEncryptModuleData } from '../../../utils/general';
import { menuData } from '../../../db/General';
import { CallApi } from '../../../utils/services';
import styles from './styles.module.scss';

export default function MenuItem({ collapsed }: any) {
  const { t } = useTranslation();
  const location = useLocation();
  const { pathname } = location;
  const perData = useMemo(() => getEncryptModuleData(), []);
  const permissionMap: any = new Map(perData?.map((item: any) => [item.moduleName, item.permissionScore]));
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if ((permissionMap.get('UserApprovals') ?? 0) < 1) return;
    const fetch = () =>
      CallApi({ url: '/api/User/pending-count', method: 'GET' })
        .then((res) => setPendingCount(res?.data ?? 0))
        .catch(() => {});
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredMenuData = menuData.filter((item: any) => {
    if (item.submenu) {
      item.submenu = item.submenu.filter((subItem: any) => permissionMap.get(subItem.titleV) >= 1);
      return item.submenu.length > 0;
    }
    return permissionMap.get(item.titleV) >= 1;
  });

  return (
    <Menu theme='dark' mode='inline' defaultSelectedKeys={['3']} selectedKeys={[]} className={styles['c-sidemenu']} defaultOpenKeys={['sub3']}>
      {filteredMenuData?.map((item: any) => {
        if (item.submenu) {
          return (
            <Menu.SubMenu key={item.key} icon={item.icon} title={t(item.title)}>
              {item.submenu?.map((subItem: any) => (
                <Menu.Item
                  className={`
                    ${subItem.link === pathname ? 'ant-menu-item-selected' : ''} 
                    ${!collapsed ? styles.sider_menu_item_collapse_open : styles.sider_menu_item_collapse_close}
                  `}
                  icon={subItem.icon}
                  key={subItem.key}>
                  <Link to={subItem.link}>{t(subItem.title)}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className={`
                ${!collapsed ? styles.sider_menu_item_collapse_open : styles.sider_menu_item_collapse_close}
              `}>
              <span>{t(item.title)}</span>
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );
}
