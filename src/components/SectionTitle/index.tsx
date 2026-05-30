import styles from './styles.module.scss';

export default function SectionTitle({ title }: any) {
  return (
    <div className={`${styles['c-sectiontitle']}`}>
      <span>～</span> {title}
    </div>
  );
}
