import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Button';
import styles from '../../../styles/form.module.scss';

interface DeleteProfileFormProps {
  onClose: () => void;
  rowData: any;
}

const DeleteProfileForm: React.FC<DeleteProfileFormProps> = ({ rowData, onClose }: any) => {
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (rowData) {
      const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
      const updatedProfiles = profiles.filter((profile: any) => profile.id !== rowData.id);
      localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    }
    onClose();
  };

  return (
    <div>
      <Form name='delete-profile' onFinish={handleDelete}>
        <p className={styles['c-antform__delete-text']}>{t('delete_profile_message')}</p>
        <Form.Item className={styles['c-antform__button-item']}>
          <Button text='delete' position='right' type='danger' htmlType='submit' handleClick={() => handleDelete}></Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DeleteProfileForm;
