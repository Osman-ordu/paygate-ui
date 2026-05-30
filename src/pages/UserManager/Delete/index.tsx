import { useTranslation } from 'react-i18next';
import { Button, Form } from 'antd';

interface DeleteUserFormProps {
  onClose: () => void;
  rowData: any;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({ rowData, onClose }: any) => {
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (rowData) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter((user: any) => user.id !== rowData.id);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    onClose();
  };

  return (
    <div>
      <Form name='profile-delete' onFinish={handleDelete}>
        <p style={{ fontSize: '20px' }}>{t('delete_user_message')}</p>
        <Form.Item style={{ margin: '0px' }}>
          <Button danger type='primary' style={{ float: 'right' }} htmlType='submit'>
            {t('delete')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DeleteUserForm;
