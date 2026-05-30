import styles from './styles.module.scss';

export default function PageTitle({ title, type, svg }: any) {
  return (
    <div className={`${styles['c-pagetitle']} ${styles[type ?? 'normal']}`}>
      {svg}
      <span>{title}</span>
    </div>
  );
}
