import * as Yup from 'yup';
import { AddTransferProps } from '../../../dbProps';

export const AddTransferInitialValue = (): AddTransferProps => {
  return <AddTransferProps>(<any>{
    senderLP: undefined,
    senderId: '',
    recipient: undefined,
    recipientId: '',
    transferAmount: null,
    walletAddress: '',
    memoTag: '',
    vaspName: '',
    senderLPCurrency: undefined,
    recipientCurrency: '',
    network: undefined,
    channel: undefined,
    entityType: undefined,
    coporateName: '',
    comment: '',
  });
};

export const AddTransferValidationSchema = Yup.object().shape({
  senderLP: Yup.string().required('sender'),
  recipient: Yup.string().required('recipient'),
  transferAmount: Yup.number()
    .required('transferAmount')
    .test('isPositive', 'mBGT1', (value) => {
      if (value === null || value === undefined) return false;
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      return numValue > 0;
    }),
  walletAddress: Yup.string(),
  memoTag: Yup.string().nullable(),
  senderLPCurrency: Yup.string().required('senderLpCurrency'),
  recipientCurrency: Yup.string(),
  network: Yup.string(),
  channel: Yup.string().required('channel'),
  entityType: Yup.string().required('entityType'),
  comment: Yup.string().nullable(),
});
