import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { QRCodeModalProps } from '../../dbProps';
import styles from './styles.module.scss';

const QRCodeModal = ({ isVisible, onClose, qrCodeData }: QRCodeModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal title={t('reset_google_auth')} open={isVisible} onCancel={onClose} footer={null} width={400} centered>
      <div className={styles['qr-code-container']}>
        <p className={styles['qr-code-instructions']}>{t('scan_qr_instructions')}</p>
        <img src={`data:image/png;base64,${qrCodeData}`} alt='Google Authenticator QR Code' className={styles['qr-code-image']} />
      </div>
    </Modal>
  );
};

export default QRCodeModal;
