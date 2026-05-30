import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

export default function CErrorMessage({ errorMessage, className }: { errorMessage?: string | any; className?: string }) {
  const { t } = useTranslation();
  if (!errorMessage) return;
  return (
    <p className={`${styles['c-error']} ${className ?? ''}`}>
      {t(errorMessage)} {errorMessage !== 'mBGT1' && errorMessage !== 'mBGT0' && errorMessage !== 'mBGT2' && t('isRequired')}
    </p>
  );
}
