import dayjs from 'dayjs';
import * as Yup from 'yup';

export const LpTransferListInitialValue = (): any => {
  const startDate = dayjs().startOf('day').toISOString();
  const endDate = dayjs().toISOString();
  return <any>{
    endDate: endDate,
    startDate: startDate,
  };
};

export const LpTransferListValidationSchema = Yup.object().shape({
  endDate: Yup.string().required('End Date'),
  startDate: Yup.string().required('Start Date'),
});
