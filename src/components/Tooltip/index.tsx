import InfoCircleOutlined from '../../assets/svg/InfoCircleOutlined.svg?react';
import styles from './styles.module.scss';

export default function Tooltip({ title }: any) {
  return (
    <span className={styles['c-tooltip']}>
      <InfoCircleOutlined />
      <div className={styles['c-tooltip__top']}>
        {title}
        <i></i>
      </div>
    </span>
  );
}
