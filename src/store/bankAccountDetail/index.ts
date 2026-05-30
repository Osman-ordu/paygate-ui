import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getBankAccountDetail = createAsyncThunk('bankAccountDetail', async () => {
  return await CallApi({
    url: `/api/BankAccount/details`,
    method: 'GET',
  });
});

export const getBankAccountList = createAsyncThunk('bankAccountList', async () => {
  return await CallApi({
    url: `/api/BankAccount/accountList`,
    method: 'GET',
  });
});

export const bankAccountDetailReducer = createSliceModule('bankAccountDetailSlice', getBankAccountDetail).reducer;
export const bankAccountListReducer = createSliceModule('bankAccountListSlice', getBankAccountList).reducer;
