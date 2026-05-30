import { configureStore } from '@reduxjs/toolkit';
import { depositReducer } from './deposit/index.tsx';
import { withdrawalReducer } from './withdrawal/index.tsx';
import { bankReducer } from './bank/index.ts';
import { transactionReducer } from './transaction/index.tsx';
import { userReducer } from './user/index.tsx';
import { integrationReducer } from './integration/index.tsx';
import { bankAccountReducer } from './bankAccount/index.ts';
import { bankAccountDetailReducer, bankAccountListReducer } from './bankAccountDetail/index.ts';
import { bankAccountConsensusReducer } from './bankAccountConsensus/index.ts';
import { prioritiesReducer } from './priority/index.ts';
import { getTreasuryTransferReducer } from './treasuryTransfer/index.ts';
import { getWhiteListAccountsReducer } from './whitelistAccounts/index.ts';
import { getTransferListReducer, getTransferListAccountReducer } from './transferList/index.ts';
import { userManagerReducer } from './userManager/index.tsx';
import { quickTransactionReducer, addQuickTransactionReducer } from './quickTransaction/index.tsx';
import { getLPQuickTransactionReducer } from './LPQuickTransaction/index.ts';
import { getLpWhitelistReducer, getLpWhitelistActiveListReducer } from './lpWhitelist/index.ts';
import { getLPTransferListReducer } from './LPTransferlist/index.ts';
import { postLPTransactionCurrenciesReducer, postLPTransactionNetworksReducer } from './LPTransaction/index.ts';
import { getLPAccountsReducer, getLpAccountsWalletsReducer } from './LPAccounts/index.ts';
import { getLpBalanceListReducer, getLpBalanceReducer } from './LPBalance/index.ts';
import { getLpWhitelistIdReducer } from './LPTransaction/index.ts';
import { autoTransferBalanceReducer, transactionLogsReducer } from './autoTransferBalance/index.ts';
import { healthCheckReducer } from './healthCheck/index.ts';
import { getPaymentServiceManagementReducer } from './paymentServiceManagement/index.ts';
import { getEodBalanceListReducer } from './eodBalance/index.ts';
import { withdrawalLogReducer } from './withdrawal/index.tsx';
import { depositLogReducer } from './deposit/index.tsx';
import {
  getProfileListReducer,
  addProfileReducer,
  editProfileReducer,
  getPermissionReducer,
  putPermissionReducer,
  getPermissionModulesReducer,
  getPermissionProfileReducer,
  changeStatusRoleReducer,
} from './permissions/index.ts';
import { getEftRefundListReducer } from './eftRefundList/index.ts';
import { getLpOkxVaspListReducer } from './lpWhitelist/index.ts';
import { getIntegrationReducer } from './integration/index.tsx';

export const store = configureStore({
  reducer: {
    depositValue: depositReducer,
    withdrawalValue: withdrawalReducer,
    bankValue: bankReducer,
    bankAccountValue: bankAccountReducer,
    getBankAccountDetailValue: bankAccountDetailReducer,
    getBankAccountConsensusValue: bankAccountConsensusReducer,
    transactionValue: transactionReducer,
    userValue: userReducer,
    integrationValue: integrationReducer,
    prioritiesValue: prioritiesReducer,
    getTreasuryTransferValue: getTreasuryTransferReducer,
    getWhiteListAccountsValue: getWhiteListAccountsReducer,
    getTransferListValue: getTransferListReducer,
    userManagerValue: userManagerReducer,
    getTransferListAccountValue: getTransferListAccountReducer,
    getQuickTransactionValue: quickTransactionReducer,
    addQuickTransactionValue: addQuickTransactionReducer,
    getProfileListValue: getProfileListReducer,
    addProfileValue: addProfileReducer,
    editProfileValue: editProfileReducer,
    getPermissionValue: getPermissionReducer,
    putPermissionValue: putPermissionReducer,
    getPermissionModulesValue: getPermissionModulesReducer,
    getPermissionProfileValue: getPermissionProfileReducer,
    changeStatusRoleValue: changeStatusRoleReducer,
    getLPQuickTransactionValue: getLPQuickTransactionReducer,
    getLpWhitelistValue: getLpWhitelistReducer,
    getLpWhitelistActiveListValue: getLpWhitelistActiveListReducer,
    getLPTransferListValue: getLPTransferListReducer,
    postLPTransactionCurrenciesValue: postLPTransactionCurrenciesReducer,
    postLPTransactionNetworksValue: postLPTransactionNetworksReducer,
    getLPAccountsValue: getLPAccountsReducer,
    getLpAccountsWalletsValue: getLpAccountsWalletsReducer,
    getLpBalanceListValue: getLpBalanceListReducer,
    getLpBalanceValue: getLpBalanceReducer,
    getLpWhitelistIdValue: getLpWhitelistIdReducer,
    getAutoTransferBalanceValue: autoTransferBalanceReducer,
    getTransactionLogsValue: transactionLogsReducer,
    getSeverHealthCheckValue: healthCheckReducer,
    getEftRefundListValue: getEftRefundListReducer,
    getBankAccountListValue: bankAccountListReducer,
    getLpOkxVaspListValue: getLpOkxVaspListReducer,
    getIntegrationValue: getIntegrationReducer,
    getPaymentServiceManagementValue: getPaymentServiceManagementReducer,
    getEodBalanceListValue: getEodBalanceListReducer,
    getWithdrawalLogValue: withdrawalLogReducer,
    getDepositLogValue: depositLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
