import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks';
import { editWhiteListAccounts, getWhiteListAccounts } from '../../../store/whitelistAccounts';
import Button from '../../../components/Button';
import styles from '../../../styles/form.module.scss';

export default function DeleteForm({ selectedRowData, onClose }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const submitHandler = async () => {
    await dispatch(
      editWhiteListAccounts({
        id: selectedRowData.id,
        status: 0,
        readableName: selectedRowData.readableName,
        iban: selectedRowData.iban,
        tcknVkn: selectedRowData.tcknVkn,
        fullName: selectedRowData.fullName,
        comment: selectedRowData.comment,
        bankName: selectedRowData.bankName,
      })
    );
    await dispatch(getWhiteListAccounts());
    onClose();
  };

  return (
    <div>
      <Form name='delete-profile' onFinish={submitHandler}>
        <p className={styles['c-antform__delete-text']}>{t('delete_profile_message')}</p>
        <Form.Item className={styles['c-antform__button-item']}>
          <Button text='delete' position='right' type='danger' htmlType='submit' handleClick={() => submitHandler}></Button>
        </Form.Item>
      </Form>
    </div>
  );
}
