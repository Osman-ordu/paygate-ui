import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getEftRefundList = createAsyncThunk('getEftRefundListReducer', async ({ startTime, endTime }: { startTime: string; endTime: string }) => {
  return await CallApi({
    url: `/api/Withdrawal/refund?startDate=${startTime}&endDate=${endTime}`,
    method: 'GET',
  });
});

export const getEftRefundListReducer = createSliceModule('getEftRefundListReducer', getEftRefundList).reducer;
