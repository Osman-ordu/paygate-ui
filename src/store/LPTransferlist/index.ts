import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getLPTransferList = createAsyncThunk('getLPTransferListReducer', async ({ startTime, endTime }: { startTime: string; endTime: string }) => {
  return await CallApi({
    url: `/api/LPTransaction?startTime=${startTime}&endTime=${endTime}`,
    method: 'GET',
  });
});

export const getLPTransferListReducer = createSliceModule('getLPTransferListReducer', getLPTransferList).reducer;
