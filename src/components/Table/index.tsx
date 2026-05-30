import styles from './styles.module.scss';

export default function Table({ data, title }: any) {
  return (
    <div className={styles['c-table']}>
      {title && (
        <h4 className={styles['c-table__title']}>
          {title}
          <div className={styles['c-table__lengthBox']}>{data?.length}</div>
        </h4>
      )}
      {data?.map((column: any, index: any) => (
        <li key={index}>
          <p>{column.key}</p>
          <p>{typeof column.value === 'boolean' ? (column.value ? 'True' : 'False') : column.value}</p>
        </li>
      ))}
    </div>
  );
}
