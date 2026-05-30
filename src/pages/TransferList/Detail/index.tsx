import { useCallback } from 'react';
import { transferListDetailFields } from '../../../db';
import CFormItem from '../../../components/CFormItem';
import CCard from '../../../components/CCard';
import Button from '../../../components/Button';
import CSpace from '../../../components/CSpace';

export default function DetailForm({ onClose, selectedRowData }: any) {
  const handleClose = useCallback(() => onClose(), [onClose]);

  return (
    <section>
      <CCard body='detail'>{transferListDetailFields?.map((item) => <CFormItem key={item} label={item} text={selectedRowData[item]} />)}</CCard>
      <CSpace type='detail'>
        <Button text='cancel' type='danger' handleClick={handleClose} />
      </CSpace>
    </section>
  );
}
