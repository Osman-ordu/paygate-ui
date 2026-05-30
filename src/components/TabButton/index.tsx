import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabButtonProps } from '../../dbProps';
import styles from './styles.module.scss';

const TabButton: React.FC<TabButtonProps> = ({ title, status, handleClick }) => {
  const { t } = useTranslation();

  return (
    <button title={t(title)} onClick={handleClick} className={`${styles['c-tabbutton']} ${styles[status ?? 'default']}`}>
      {t(title)}
    </button>
  );
};

export default TabButton;
