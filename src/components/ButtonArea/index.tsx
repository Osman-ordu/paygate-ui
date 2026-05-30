import Button from '../../components/Button';
import styles from './styles.module.scss';

export default function ButtonArea({ cancelClick, submitClick, submitTitle }: any) {
  return (
    <div className={styles['c-buttonarea']}>
      <Button text='cancel' type='danger' handleClick={cancelClick} />
      <Button text={submitTitle ?? 'create'} htmlType='submit' handleClick={submitClick} />
    </div>
  );
}
