import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { deleteAutoTransfer, getAutoTransferBalance, getTransactionLogs } from '../../../store/autoTransferBalance';
import { useAppDispatch } from '../../../store/hooks';
import Button from '../../../components/Button';
import styles from '../../../styles/form.module.scss';

export default function DeleteForm({ selectedRowData, onClose }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const submitHandler = async () => {
    await dispatch(deleteAutoTransfer(selectedRowData?.id));
    await dispatch(getAutoTransferBalance());
    await dispatch(getTransactionLogs());
    onClose();
  };

  return (
    <div>
      <Form name='delete-transfer-balance' onFinish={submitHandler}>
        <p className={styles['c-antform__delete-text']}>{t('delete_transfer_balance_message')}</p>
        <Form.Item className={styles['c-antform__button-item']}>
          <Button text='delete' position='right' type='danger' htmlType='submit' handleClick={() => submitHandler}></Button>
        </Form.Item>
      </Form>
    </div>
  );
}
