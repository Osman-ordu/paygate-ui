import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks';
import { deleteLpWhitelist } from '../../../store/lpWhitelist';
import { getLpWhitelist } from '../../../store/lpWhitelist';
import Button from '../../../components/Button';
import styles from '../../../styles/form.module.scss';

export default function DeleteForm({ selectedRowData, onClose }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const submitHandler = async () => {
    const { id } = selectedRowData;
    await dispatch(deleteLpWhitelist(id));
    await dispatch(getLpWhitelist());
    onClose();
  };

  return (
    <div>
      <Form name='delete-profile' onFinish={submitHandler}>
        <p className={styles['c-antform__delete-text']}>{t('delete_lp_whitelisted_message')}</p>
        <Form.Item className={styles['c-antform__button-item']}>
          <Button text='delete' position='right' type='danger' htmlType='submit' handleClick={() => submitHandler}></Button>
        </Form.Item>
      </Form>
    </div>
  );
}
