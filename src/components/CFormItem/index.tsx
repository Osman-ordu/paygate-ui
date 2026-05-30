import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

export default function CFormItem({ label, text }: any) {
  const { t } = useTranslation();

  return (
    <div className={`${styles['c-formitem']}`}>
      <p>{t(label)}</p>
      <div className={styles[`c-formitem__input`]}>
        <p>{text}</p>
      </div>
    </div>
  );
}
