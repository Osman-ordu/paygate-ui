import { useTranslation } from 'react-i18next';
import Error from '../../assets/svg/Error.svg?react';
import Info from '../../assets/svg/Info.svg?react';
import styles from './styles.module.scss';

export default function InfoArea({ text, type }: any) {
  const { t } = useTranslation();
  let svg;
  if (type === 'error') {
    svg = <Error />;
  } else {
    svg = <Info />;
  }

  return (
    <div className={`${styles['c-infoarea']} ${styles[type]}`}>
      <div className={styles[`c-infoarea__container`]}>
        {svg}
        <p>{t(text)}</p>
      </div>
    </div>
  );
}
