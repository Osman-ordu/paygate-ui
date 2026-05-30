import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const changeMasakStatement = createAsyncThunk('masak', async ({ id }: any) => {
  return await CallApi({
    url: `/api/Deposit/changemasakresult/?id=${id}`,
    method: 'PUT',
  });
});

export const masakReducer = createSliceModule('masak', changeMasakStatement).reducer;
