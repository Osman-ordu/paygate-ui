import styles from './styles.module.scss';

export default function MainLayout({ children }: any) {
  return <div className={styles['container']}>{children}</div>;
}
