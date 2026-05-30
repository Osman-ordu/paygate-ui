import styles from './styles.module.scss';

export default function CSpace({ children, type }: any) {
  return <div className={`${styles['c-space']} ${styles[type]}`}>{children}</div>;
}
