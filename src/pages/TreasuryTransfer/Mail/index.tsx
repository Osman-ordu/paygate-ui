import { Input } from 'antd';
import { useAppDispatch } from '../../../store/hooks';
import { addTreasuryTransfer } from '../../../store/treasuryTransfer';
import CCard from '../../../components/CCard';
import CSpace from '../../../components/CSpace';

export default function MailForm({ text, onClose, selectedRowData, onCloseMail }: any) {
  const dispatch = useAppDispatch();

  const submitHandler = async (e: any) => {
    const response: any = await dispatch(
      addTreasuryTransfer({
        ...selectedRowData,
        code: e,
      })
    );

    if (response?.error) return true;

    onClose();
    onCloseMail();
  };

  return (
    <section>
      <CCard body='otp'>
        <Input.OTP key={Math.random()} size='large' onChange={(e) => submitHandler(e)} length={6} />
        <CSpace type='otp'>
          <p>{text}</p>
        </CSpace>
      </CCard>
    </section>
  );
}
