import * as Yup from 'yup';

export const addInitialValue = (): any => {
  return <any>{
    readableName: '',
    tcknVkn: '',
    bankName: '',
    iban: '',
    fullName: '',
    comment: '',
  };
};

export const editInitialValues = (data: any) => {
  let iban = data.iban;
  if (iban.startsWith('TR')) iban = iban.slice(2);

  return <any>{
    readableName: data.readableName,
    tcknVkn: data.tcknVkn,
    bankName: data.bankName,
    iban,
    fullName: data.fullName,
    comment: data.comment,
  };
};

export const validationSchema = Yup.object({
  readableName: Yup.string().required('name'),
  iban: Yup.string().required('recipientIBAN'),
  fullName: Yup.string().required('recipientFullName'),
  comment: Yup.string().required('comment'),
});
