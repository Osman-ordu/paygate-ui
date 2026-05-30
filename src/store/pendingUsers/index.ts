import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';

export const getPendingUsers = createAsyncThunk('getPendingUsers', async () => {
  return await CallApi({ url: '/api/User/pending', method: 'GET' });
});

export const getPendingCount = createAsyncThunk('getPendingCount', async () => {
  return await CallApi({ url: '/api/User/pending-count', method: 'GET' });
});

export const approveUser = createAsyncThunk('approveUser', async ({ id }: { id: string }) => {
  return await CallApi({ url: `/api/User/approve?id=${id}`, method: 'PUT' });
});
