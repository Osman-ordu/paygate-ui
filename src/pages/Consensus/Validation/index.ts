import dayjs from 'dayjs';
import { ConsensusProps } from '../../../dbProps';
import * as Yup from 'yup';

export const ConsensusInitialValue = (): ConsensusProps => {
  const startDate = dayjs().startOf('day').toISOString();
  const endDate = dayjs().toISOString();
  return <ConsensusProps>{
    currency: 'TRY',
    endDate: endDate,
    startDate: startDate,
  };
};

export const ConsensusValidationSchema = Yup.object().shape({
  currency: Yup.string().required('Currency'),
  endDate: Yup.string().required('End Date'),
  startDate: Yup.string().required('Start Date'),
});
