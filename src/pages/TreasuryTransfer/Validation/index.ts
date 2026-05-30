import * as Yup from 'yup';
import { AddTransferProps } from '../../../dbProps';

export const AddInitialValue = (): any => {
  return <any>{
    sender: null,
    eachTransferAmount: '',
    recipent: null,
    description: '',
    transferType: null,
    comment: '',
    numberOfTransfers: '',
  };
};

export const AddAValidationSchema = Yup.object().shape({
  sender: Yup.number().required('sender'),
  eachTransferAmount: Yup.number().required('eachTransferAmount').min(1, 'mBGT1'),
  recipent: Yup.number().required('recipent'),
  description: Yup.string(),
  transferType: Yup.number().required('transferType'),
  comment: Yup.string(),
  numberOfTransfers: Yup.number().required('numberOfTransfers').min(1, 'mBGT1'),
});

export const AddTransferInitialValue = (): AddTransferProps => {
  return <AddTransferProps>(<any>{
    sender: null,
    recipient: null,
    transferType: null,
    numberOfTransfers: 1,
    eachTransferAmount: null,
    description: '',
    comment: '',
  });
};

export const AddTransferValidationSchema = Yup.object().shape({
  sender: Yup.number().nullable().required('sender'),
  recipient: Yup.number().nullable().required('recipent'),
  transferType: Yup.number().nullable().required('transferType'),
  numberOfTransfers: Yup.number()
    .required('numberOfTransfers')
    .min(1, 'mBGT1')
    .test('isPositive', 'mBGT1', (value) => value > 0),
  eachTransferAmount: Yup.number()
    .required('eachTransferAmount')
    .min(1, 'mBGT1')
    .test('isPositive', 'mBGT1', (value) => value > 0),
  description: Yup.string(),
  comment: Yup.string(),
});
