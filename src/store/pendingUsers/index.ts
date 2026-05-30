import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';

export const getPendingUsers = createAsyncThunk('getPendingUsers', async () => {
  return await CallApi({ url: '/api/User/pending', method: 'GET' });
});

export const getAllUsers = createAsyncThunk('getAllUsers', async () => {
  return await CallApi({ url: '/api/User/all', method: 'GET' });
});

export const getPendingCount = createAsyncThunk('getPendingCount', async () => {
  return await CallApi({ url: '/api/User/pending-count', method: 'GET' });
});

export const approveUser = createAsyncThunk('approveUser', async ({ id }: { id: string }) => {
  return await CallApi({ url: `/api/User/approve?id=${id}`, method: 'PUT' });
});

export const rejectUser = createAsyncThunk('rejectUser', async ({ id }: { id: string }) => {
  return await CallApi({ url: `/api/User/reject?id=${id}`, method: 'PUT' });
});

export const resendApproval = createAsyncThunk('resendApproval', async ({ id }: { id: string }) => {
  return await CallApi({ url: `/api/User/resend-approval?id=${id}`, method: 'PUT' });
});

export const setUserStatus = createAsyncThunk(
  'setUserStatus',
  async ({ id, enabled }: { id: string; enabled: boolean }) => {
    return await CallApi({ url: `/api/User/set-status?id=${id}&enabled=${enabled}`, method: 'PUT' });
  },
);
