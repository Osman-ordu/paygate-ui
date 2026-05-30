import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks';
import { putPaymentServiceManagement, getPaymentServiceManagement } from '../../../store/paymentServiceManagement';

import Button from '../../../components/Button';
import styles from '../styles.module.scss';

export default function StatusUpdateForm({ selectedRowData, onClose }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const status = selectedRowData?.status;

    await dispatch(
      putPaymentServiceManagement({
        serviceName: selectedRowData?.serviceName,
        workFrequency: selectedRowData?.workFrequency,
        integrationType: selectedRowData?.integrationType,
        status: !status,
      })
    );
    await dispatch(getPaymentServiceManagement());
    onClose();
  };
  return (
    <div className={styles['c-payment-services-management__status-update']}>
      <Button type='danger' text={t('cancel')} handleClick={onClose}></Button>
      <Button type='success' text={t('confirm')} handleClick={handleSubmit}></Button>
    </div>
  );
}
