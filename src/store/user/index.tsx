import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getUserData = createAsyncThunk('user', async () => {
  return await CallApi({
    url: `/api/User/getlist`,
    method: 'GET',
  });
});

export const userReducer = createSliceModule('userSlice', getUserData).reducer;
