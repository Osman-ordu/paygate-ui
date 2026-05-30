import styles from './styles.module.scss';

interface CTextInfoProps {
  text: string;
  icon?: React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'error';
}

export default function CTextInfo({ text, icon, type = 'info' }: CTextInfoProps) {
  return (
    <div className={`${styles['c-text-info']} ${styles[type]}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

