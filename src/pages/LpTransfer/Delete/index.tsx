import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks';
import { deleteLPQuickTransaction } from '../../../store/LPQuickTransaction';
import { getLPQuickTransaction } from '../../../store/LPQuickTransaction';
import ButtonArea from '../../../components/ButtonArea';
import styles from '../../../styles/form.module.scss';

export default function DeleteForm({ selectedRowData, onClose }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const submitHandler = async () => {
    if (selectedRowData) {
      await dispatch(deleteLPQuickTransaction(selectedRowData?.quickTransactionId));
      await dispatch(getLPQuickTransaction());
    }
    onClose();
  };

  return (
    <div>
      <Form name='delete-quick-transfer' onFinish={submitHandler}>
        <p className={styles['c-antform__delete-text']}>{t('delete_quick_transfer_message')}</p>
        <Form.Item className={styles['c-antform__button-item']}>
          <ButtonArea cancelClick={() => onClose()} submitTitle='confirm' />
        </Form.Item>
      </Form>
    </div>
  );
}
