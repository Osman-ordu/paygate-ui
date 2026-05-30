import styles from './styles.module.scss';

export default function NotificationButton({ color, text }: any) {
  <div className={`${styles[`c-notificationbutton`]} ${styles[`${color}`]}`}>{text}</div>;
}
