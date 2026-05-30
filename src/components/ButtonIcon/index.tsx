import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

export default function ButtonIcon({ title, icon, type, htmlType, handleClick }: any) {
  const { t } = useTranslation();

  return (
    <button title={t(title)} onClick={handleClick} className={`${styles['c-buttonicon']} ${styles[type ?? 'primary']}`} type={htmlType ?? 'button'}>
      {icon}
    </button>
  );
}
