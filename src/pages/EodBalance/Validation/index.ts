import dayjs from 'dayjs';
import * as Yup from 'yup';

export const EodBalanceInitialValue = (): any => {
  const yesterdayEndOfDay = dayjs().subtract(1, 'day').endOf('day');
  return {
    eodDate: yesterdayEndOfDay,
  };
};

export const editInitialValues = (selectedRowData: any): any => {
  return {
    client: selectedRowData.client,
    custody: selectedRowData.custody,
    lp: selectedRowData.lp,
    bank: selectedRowData.bank,
  };
};

export const EodBalanceValidationSchema = Yup.object().shape({
  eodDate: Yup.date().required('Date is required'),
});

export const EditEodBalanceValidationSchema = Yup.object().shape({
  client: Yup.number().required('Client is required'),
  custody: Yup.number().required('Custody is required'),
  lp: Yup.number().required('LP is required'),
  bank: Yup.number().required('Bank is required'),
});
