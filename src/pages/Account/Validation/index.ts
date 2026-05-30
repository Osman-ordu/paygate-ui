import * as Yup from 'yup';
import { AddAccountsProps, EditAccountsProps } from '../../../dbProps';

export const AddInitialValue = (): AddAccountsProps => {
  return <AddAccountsProps>{
    selectBank: null,
    branchOffice: '',
    iban: null,
    accountName: '',
    accountNo: '',
    precedence: undefined,
    accountEnable: true,
    accountHolderName: '',
    vkn: '',
    accountType: null,
  };
};

export const AddAValidationSchema = Yup.object().shape({
  selectBank: Yup.string().required('account_no'),
  accountNo: Yup.string().required('account_no'),
  iban: Yup.string().required('IBAN'),
  accountName: Yup.string().required('account_name'),
  precedence: Yup.string().required('precedence'),
  accountEnable: Yup.boolean().required('account_enable'),
  accountHolderName: Yup.string().required('accountHolderName'),
  vkn: Yup.string().required('vkn'),
  accountType: Yup.string().nullable().optional(),
});

export const EditInitialValue = (data: any): EditAccountsProps => {
  const enable = data.status === 'Active' ? true : false;
  return <EditAccountsProps>{
    id: data?.id,
    select_bank: data?.companyBankName,
    iban: data?.iban,
    account_name: data?.accountName,
    account_no: data?.accountNo,
    precedence: data?.priority,
    account_enable: enable,
    accountHolderName: data?.accountHolderName,
    vkn: data?.vkn,
    accountType: data?.accountType,
  };
};

export const EditValidationSchema = Yup.object().shape({
  account_name: Yup.string().required('account_name'),
  precedence: Yup.string().required('precedence'),
  account_enable: Yup.string().required('account_enable'),
  accountHolderName: Yup.string().required('accountHolderName'),
  vkn: Yup.string().required('vkn'),
  accountType: Yup.string().nullable().optional(),
});
