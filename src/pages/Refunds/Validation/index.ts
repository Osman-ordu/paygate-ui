import dayjs from 'dayjs';
import { RefundsProps } from '../../../dbProps';
import * as Yup from 'yup';

export const RefundsInitialValue = (): RefundsProps => {
  const startDate = dayjs().startOf('day').toISOString();
  const endDate = dayjs().toISOString();
  return <RefundsProps>{
    endDate: endDate,
    startDate: startDate,
  };
};

export const RefundsValidationSchema = Yup.object().shape({
  endDate: Yup.string().required('End Date'),
  startDate: Yup.string().required('Start Date'),
});
