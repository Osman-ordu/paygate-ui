import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';

export const confirmMoneyTransfer = createAsyncThunk('transferMoney', async ({ id }: any) => {
  return await CallApi({
    url: `/api/Deposit/confirm/?id=${id}`,
    method: 'PUT',
  });
});
