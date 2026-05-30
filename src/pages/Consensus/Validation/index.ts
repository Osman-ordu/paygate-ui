import dayjs from 'dayjs';
import { ConsensusProps } from '../../../dbProps';
import { YupV } from '../../../utils/general';

export const ConsensusInitialValue = (): ConsensusProps => {
  const startDate = dayjs().startOf('day').toISOString();
  const endDate = dayjs().toISOString();
  return <ConsensusProps>{
    currency: 'TRY',
    endDate: endDate,
    startDate: startDate,
  };
};

export const ConsensusValidationSchema = YupV.object().shape({
  currency: YupV.string().required('Currency'),
  endDate: YupV.string().required('End Date'),
  startDate: YupV.string().required('Start Date'),
});
