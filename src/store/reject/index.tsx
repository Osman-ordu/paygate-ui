import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const postReject = createAsyncThunk('reject', async ({ id }: any) => {
  return await CallApi({
    url: `/api/Deposit/reject/?id=${id}`,
    method: 'POST',
  });
});

export const rejectReducer = createSliceModule('reject', postReject).reducer;
