import { Modal } from 'antd';

export default function CustomModal({ isVisible, onClose, children, title, width = '50%', centered = false, maxHeight = '70vh' }: any) {
  return (
    <Modal
      title={title}
      width={width}
      open={isVisible}
      onCancel={onClose}
      footer={false}
      maskClosable={false}
      centered={centered}
      styles={{
        body: {
          maxHeight: maxHeight,
          overflowY: 'auto',
          padding: '24px',
        },
      }}>
      {children}
    </Modal>
  );
}
