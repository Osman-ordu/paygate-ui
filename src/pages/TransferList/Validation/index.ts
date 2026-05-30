import dayjs from 'dayjs';
import * as Yup from 'yup';
import { AddTransferListProps } from '../../../dbProps';

export const ConsensusInitialValue = (): any => {
  const startDate = dayjs().startOf('day').toISOString();
  const endDate = dayjs().toISOString();
  return <any>{
    endDate: endDate,
    startDate: startDate,
  };
};

export const ConsensusValidationSchema = Yup.object().shape({
  endDate: Yup.string().required('End Date'),
  startDate: Yup.string().required('Start Date'),
});

export const AddTransferListInitialValue = (): AddTransferListProps => {
  return <AddTransferListProps>(<any>{
    senderAccountName: null,
    senderBankName: '',
    senderIban: '',
    transactionNo: '',
    comment: '',
    transferType: null,
    dateAndTime: dayjs().toISOString(),
    whitelistAccountName: null,
    recipientBankName: '',
    recipientFullName: '',
    recipientIban: '',
    amount: null,
  });
};

export const AddTransferListValidationSchema = Yup.object().shape({
  senderAccountName: Yup.number().nullable().required('sender_account_name'),
  senderBankName: Yup.string(),
  senderIban: Yup.string(),
  transactionNo: Yup.string().required('transaction_no'),
  comment: Yup.string().required('comment'),
  transferType: Yup.number().nullable().required('transfer_type'),
  dateAndTime: Yup.string().required('dateAndTime'),
  whitelistAccountName: Yup.number().nullable().required('whitelist_account_name'),
  recipientBankName: Yup.string(),
  recipientFullName: Yup.string(),
  recipientIban: Yup.string(),
  amount: Yup.number().nullable().required('amount').min(1, 'mBGT1'),
});
