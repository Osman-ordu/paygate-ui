import * as Yup from 'yup';

export const StatusUpdateValidationSchema = Yup.object().shape({
  transactionStatus: Yup.number().required('transactionStatus'),
  refundStatus: Yup.number().required('refundStatus'),
  comment: Yup.string().required('comment'),
});

export const StatusUpdateInitialValues = {
  transactionStatus: 0,
  refundStatus: 0,
  comment: '',
};
