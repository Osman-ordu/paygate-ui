import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallApi } from '../../utils/services';
import { createSliceModule } from '../createSliceModule';

export const getLPAccounts = createAsyncThunk('getLPAccounts', async () => {
  return await CallApi({
    url: `/api/LPAccount`,
    method: 'GET',
  });
});

export const getLpAccountsWallets = createAsyncThunk('getLpAccountsWallets', async (params: { lpNameId: number; accountCurrency: string }) => {
  return await CallApi({
    url: `/api/LPAccount/wallets?lpNameId=${params.lpNameId}&accountCurrency=${params.accountCurrency}`,
    method: 'GET',
  });
});

export const getLPAccountsReducer = createSliceModule('getLPAccountsSlice', getLPAccounts).reducer;
export const getLpAccountsWalletsReducer = createSliceModule('getLpAccountsWalletsSlice', getLpAccountsWallets).reducer;
