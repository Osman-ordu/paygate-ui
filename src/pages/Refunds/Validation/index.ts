import dayjs from 'dayjs';
import { RefundsProps } from '../../../dbProps';
import { YupV } from '../../../utils/general';

export const RefundsInitialValue = (): RefundsProps => {
  const startDate = dayjs().startOf('day').toISOString();
  const endDate = dayjs().toISOString();
  return <RefundsProps>{
    endDate: endDate,
    startDate: startDate,
  };
};

export const RefundsValidationSchema = YupV.object().shape({
  endDate: YupV.string().required('End Date'),
  startDate: YupV.string().required('Start Date'),
});
