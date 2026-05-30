import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';
import { ConsensusProps } from '../../dbProps';

export const getBankAccountConsensus = createAsyncThunk('bankAccountConsensus', async ({ currency, startDate, endDate }: ConsensusProps) => {
  return await CallApi({
    url: `/api/BankAccount/consensus`,
    method: 'POST',
    data: {
      currency,
      startDate: startDate,
      endDate: endDate,
    },
  });
});

export const bankAccountConsensusReducer = createSliceModule('bankAccountConsensusSlice', getBankAccountConsensus).reducer;
