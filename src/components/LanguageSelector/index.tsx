import { useEffect, useState } from 'react';
import i18n from '../../i18n';
import { Menu, Dropdown } from 'antd';
import DownOutlined from '../../assets/svg/DownOutlined.svg?react';

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  const handleSelectLanguage = (e: any) => {
    const selectedLanguage = e.key;
    setSelectedLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  useEffect(() => {
    const language = localStorage.getItem('language');
    if (language) {
      setSelectedLanguage(language);
    }
  }, []);

  const menu = (
    <Menu onClick={handleSelectLanguage} selectedKeys={[selectedLanguage]}>
      <Menu.Item key='en'>EN</Menu.Item>
      <Menu.Item key='tr'>TR</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        {selectedLanguage.toUpperCase()} <DownOutlined />
      </a>
    </Dropdown>
  );
}
