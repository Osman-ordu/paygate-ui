import styles from './styles.module.scss';

export default function CCard({ children, nonborder, body, paddingOn }: any) {
  return (
    <div className={`${styles['c-card']} ${styles[nonborder ? 'nonborder' : '']}`}>
      <div className={`${styles['c-card__body']} ${styles[body ?? '']} ${styles[paddingOn ? 'paddingOn' : '']}`}>{children}</div>
    </div>
  );
}
