import styles from './skeleton.module.scss';

interface Props {
  height?: string | number;
}

export default function DataGridSkeleton({ height = '80vh' }: Props) {
  const colWidths = [28, 14, 13, 12, 11, 10, 12];

  return (
    <div className={styles.skeleton} style={{ height }}>
      <div className={styles.header}>
        {colWidths.map((w, i) => (
          <div key={i} className={styles.headerCell} style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className={styles.toolbar} />
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`${styles.row} ${i % 2 === 0 ? styles.rowEven : styles.rowOdd}`} />
      ))}
    </div>
  );
}
