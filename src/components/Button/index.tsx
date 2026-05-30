import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

export default function Button({ text, type, position, htmlType, handleClick, height, disabled, loading }: any) {
  const { t } = useTranslation();

  return (
    <button
      disabled={disabled || loading}
      onClick={handleClick}
      className={`${styles['c-button']} ${styles[type ?? 'primary']} ${styles[height ?? 'default']} ${styles[position ?? 'default']} ${loading ? styles.loading : ''}`}
      type={htmlType ?? 'button'}>
      {loading ? (
        <span className={styles.spinner}>
          <svg viewBox='0 0 50 50' className={styles.spinnerSvg}>
            <circle cx='25' cy='25' r='20' fill='none' className={styles.spinnerCircle} />
          </svg>
        </span>
      ) : (
        t(text)
      )}
    </button>
  );
}
