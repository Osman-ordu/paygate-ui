import styles from './styles.module.scss';

export default function Loader({ type }: any) {
  return (
    <div className={`${styles['c-loader']}  ${styles[type ?? 'default']}`}>
      <div className={styles['c-loader__spin']}></div>
    </div>
  );
}
