import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const putRefund = createAsyncThunk('refund', async ({ id }: any) => {
  return await CallApi({
    url: `/api/Deposit/refund/?id=${id}`,
    method: 'PUT',
  });
});

export const refundReducer = createSliceModule('refund', putRefund).reducer;
