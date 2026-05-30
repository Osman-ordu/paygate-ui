import { renderCellFix, formatDateTimeForDisplay, renderCellWithZeroAndLargeNumberMask } from '../../utils/general';

// lp Whitelisted
export const lpWhitelistedColumns = [
  { dataField: 'accountName', caption: 'accountName' },
  { dataField: 'lpName', caption: 'lpName' },
  { dataField: 'currency', caption: 'currencyOfTheAccount' },
  { dataField: 'walletAddress', caption: 'walletAddress' },
  { dataField: 'network', caption: 'network' },
  { dataField: 'memoTag', caption: 'memoTag', addition: { visible: false } },
  { dataField: 'channel', caption: 'channel' },
  { dataField: 'vaspName', caption: 'vaspName' },
  { dataField: 'targetType', caption: 'targetType' },
  { dataField: 'innerToType', caption: 'innerToType', addition: { visible: false } },
  { dataField: 'entity', caption: 'entity' },
  { dataField: 'name', caption: 'name', addition: { visible: false } },
  { dataField: 'surname', caption: 'surname', addition: { visible: false } },
  { dataField: 'birthdate', caption: 'birthDate', addition: { visible: false, dataType: 'date', format: 'yyyy/MM/dd' } },
  { dataField: 'corporateName', caption: 'corporateName' },
  { dataField: 'corporateAddress', caption: 'corporateAddress' },
  { dataField: 'description', caption: 'description' },
  { dataField: 'country', caption: 'country' },
  { dataField: 'city', caption: 'city' },
  { dataField: 'district', caption: 'district' },
  { dataField: 'streetName', caption: 'streetName' },
];
// lp Accounts
export const lpAccountsColumns = [
  { dataField: 'lpName', caption: 'lpName' },
  { dataField: 'accountCurrency', caption: 'accountCurrency' },
  { dataField: 'accountStatus', caption: 'accountStatus' },
];

export const lpAccountsWalletsColumns = [
  { dataField: 'currencyNetwork', caption: 'currencyNetwork' },
  { dataField: 'accountId', caption: 'accountId' },
];

// lp transfer list
export const lpTransferListColumns = [
  { dataField: 'id', caption: 'paymentHubId' },
  { dataField: 'senderLP', caption: 'senderLp' },
  { dataField: 'recipient', caption: 'recipient' },
  { dataField: 'currency', caption: 'currency' },
  { dataField: 'network', caption: 'network' },
  { dataField: 'walletAddress', caption: 'walletAddress' },
  { dataField: 'amount', caption: 'transferAmount' },
  { dataField: 'fee', caption: 'fee' },
  { dataField: 'txid', caption: 'txid' },
  { dataField: 'status', caption: 'status' },
  { dataField: 'createTimePH', caption: 'createTimeonPaymentHub' },
  { dataField: 'createTimeLP', caption: 'createTimeOnLp' },
  { dataField: 'transactionHash', caption: 'transactionHash', addition: { visible: false } },
  { dataField: 'lpId', caption: 'lpId', addition: { visible: false } },
  { dataField: 'comment', caption: 'comment', addition: { visible: false } },
];

// Treasury Transfer
export const treasuryTransferColumns = [
  { dataField: 'companyBankName', caption: 'bankName' },
  { dataField: 'accountName', caption: 'accountName' },
  { dataField: 'iban', caption: 'iban' },
  {
    dataField: 'balance',
    caption: 'balance',
    cellRender: (rowData: any) => renderCellFix(rowData.data.balance),
  },
];

// Quick Transfer
export const quickTransferColumns = [
  { dataField: 'senderAccountName', caption: 'sender' },
  { dataField: 'recipientName', caption: 'recipient' },
  { dataField: 'eachTransferAmount', caption: 'eachTransferAmount' },
  { dataField: 'transferType', caption: 'transferType' },
  { dataField: 'numberOfTransfers', caption: 'numberOfTransfers' },
  { dataField: 'description', caption: 'description' },
  { dataField: 'comment', caption: 'comment' },
];

// Auto Transfer Balance
export const autoTransferBalanceColumns = [
  { dataField: 'withdrawAccount', caption: 'withdrawalAccount' },
  { dataField: 'depositAccount', caption: 'depositAccount' },
  { dataField: 'maintenanceBalance', caption: 'maintenanceBalance' },
  { dataField: 'topUpBalance', caption: 'topUpBalance' },
  { dataField: 'prioritization', caption: 'prioritization' },
];

export const transactionLogsColumns = [
  { dataField: 'timestamp', caption: 'timeStamp', addition: { dataType: 'date', format: 'dd/MM/yyyy HH:mm:ss' } },
  { dataField: 'depositAccount', caption: 'depositAccount' },
  { dataField: 'withdrawAccount', caption: 'withdrawalAccount' },
  { dataField: 'amount', caption: 'amount' },
  { dataField: 'status', caption: 'status' },
  { dataField: 'errorMessage', caption: 'errorMessage' },
];

// Transfer List
export const transferListColumns = [
  { dataField: 'bankName', caption: 'bankName' },
  {
    dataField: 'stTransferDate',
    caption: 'stTransferDate',
    dataType: 'date',
    addition: {
      allowSorting: true,
      format: 'dd/MM/yyyy HH:mm:ss',
      sortOrder: 'desc',
    },
  },
  { dataField: 'stTransactionNo', caption: 'stTransactionNo' },
  { dataField: 'stAmount', caption: 'stAmount', dataType: 'number' },
  { dataField: 'stTransferStatus', caption: 'stTransferStatus' },
  { dataField: 'stTransactionDescription', caption: 'reason', addition: { visible: false } },
  { dataField: 'ttId', caption: 'ttId' },
  {
    dataField: 'ttTransferDate',
    caption: 'ttTransferDate',
    dataType: 'date',
    addition: {
      format: 'dd/MM/yyyy HH:mm:ss',
    },
  },
  { dataField: 'ttComment', caption: 'ttComment', addition: { visible: false } },
  { dataField: 'ttBankName', caption: 'ttBankName' },
  { dataField: 'ttIban', caption: 'ttIban', addition: { visible: false } },
  { dataField: 'ttFullName', caption: 'ttFullName' },
  { dataField: 'ttStatus', caption: 'ttStatus' },
  {
    dataField: 'updateDate',
    caption: 'updateDate',
    dataType: 'date',
    addition: {
      format: 'dd/MM/yyyy HH:mm:ss',
    },
  },
  { dataField: 'transferredBy', caption: 'transferedBy' },
  { dataField: 'transferType', caption: 'transferType' },
];

// Profile List
export const profileManagerColumns = [
  { dataField: 'id', caption: 'Id' },
  { dataField: 'name', caption: 'profile_name' },
  { dataField: 'status', caption: 'status' },
];
// Integration
export const integrationColumns = [
  { dataField: 'type', caption: 'type', dataType: 'string' },
  { dataField: 'realSenderName', caption: 'real_sender_name', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'accountNo', caption: 'account_no', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'apiUrl', caption: 'api_url', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'secondApiUrl', caption: 'second_api_url', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'customerNo', caption: 'customer_no', addition: { allowSorting: true }, dataType: 'string' },
];
// Account
export const accountColumns = [
  { dataField: 'companyBankName', caption: 'company_bank_name', addition: { allowSorting: true } },
  { dataField: 'currency', caption: 'Currency', addition: { allowSorting: true } },
  { dataField: 'iban', caption: 'iban', addition: { allowSorting: true } },
  { dataField: 'accountName', caption: 'Account_name', addition: { allowSorting: true } },
  { dataField: 'accountNo', caption: 'account_no', addition: { allowSorting: true } },
  { dataField: 'accountHolderName', caption: 'accountHolderName', addition: { allowSorting: true } },
  { dataField: 'vkn', caption: 'vkn', addition: { allowSorting: true } },
  { dataField: 'priority', caption: 'Priority', addition: { allowSorting: true } },
  { dataField: 'status', caption: 'activity', addition: { allowSorting: true } },
  { dataField: 'accountType', caption: 'accountType', addition: { allowSorting: true } },
];
// Balance
export const balanceColumns = [
  { dataField: 'companyBankName', caption: 'bank_name', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'currency', caption: 'currency', addition: { allowSorting: true } },
  {
    dataField: 'balance',
    caption: 'current_balance',
    addition: { allowSorting: true, format: '#,##0.##;($ #,##0.##)' },
  },
  {
    dataField: 'availableBalance',
    caption: 'available_balance',
    addition: { allowSorting: true, format: '#,##0.##;($ #,##0.##)' },
  },
  { dataField: 'name', caption: 'account_name', addition: { allowSorting: true } },
  { dataField: 'priority', caption: 'priority', dataType: 'number', addition: { allowSorting: true } },
];
// Hours & Banks
export const bankColumns = [
  { dataField: 'id', caption: 'Id', addition: { allowSorting: false } },
  { dataField: 'bankName', caption: 'Bank Name', addition: { allowSorting: false } },
  { dataField: 'bankCode', caption: 'Bank Code', addition: { allowSorting: false } },
  { dataField: 'openingTime', caption: 'Opening Time', addition: { allowSorting: false } },
  { dataField: 'closingTime', caption: 'Closing Time', addition: { allowSorting: false } },
  { dataField: 'status', caption: 'Status', addition: { allowSorting: false } },
];
// User
export const userColumns = [
  { dataField: 'name', caption: 'name', addition: { allowSorting: true } },
  { dataField: 'surname', caption: 'surname', addition: { allowSorting: true } },
  { dataField: 'roleId', caption: 'roleId', addition: { allowSorting: true } },
  { dataField: 'email', caption: 'Email', addition: { allowSorting: true } },
  { dataField: 'phoneNumber', caption: 'phone', addition: { allowSorting: true } },
  { dataField: 'status', caption: 'status', addition: { allowSorting: true } },
];
// Whitelist Accounts
export const whitelistAccountColumns = [
  { dataField: 'readableName', caption: 'name' },
  { dataField: 'bankName', caption: 'recipientBank' },
  { dataField: 'fullName', caption: 'recipientFullName' },
  { dataField: 'tcknVkn', caption: 'recipientTC' },
  { dataField: 'iban', caption: 'recipientIBAN' },
  { dataField: 'comment', caption: 'comment' },
];
// Deposit Columns
export const depositColumns = [
  { dataField: 'id', caption: 'Id', addition: { width: '50px' }, dataType: 'string' },
  { dataField: 'uid', caption: 'uid', dataType: 'number' },
  { dataField: 'companyBankName', caption: 'incoming_account', addition: { allowSorting: true }, dataType: 'string' },
  {
    dataField: 'depositDate',
    caption: 'transaction_date',
    addition: {
      allowSorting: true,
      format: 'dd/MM/yyyy HH:mm:ss',
      sortOrder: 'desc',
    },
    dataType: 'date',
    filterType: 'date',
    editorOptions: {
      type: 'date',
      displayFormat: 'dd/MM/yyyy',
      pickerType: 'calendar',
      dateSerializationFormat: 'yyyy-MM-ddT00:00:01',
    },
  },
  { dataField: 'receiptNo', caption: 'receipt_no', addition: { allowSorting: true, visible: false }, dataType: 'number' },
  { dataField: 'userBankName', caption: 'members_bank', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'iban', caption: 'iban', addition: { allowSorting: true, visible: false }, dataType: 'string' },
  { dataField: 'tckn', caption: 'tckn', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'amount', caption: 'amount', addition: { allowSorting: true }, dataType: 'number' },
  { dataField: 'symbol', caption: 'currency', addition: { allowSorting: true, visible: false }, dataType: 'string' },
  {
    dataField: 'transactionStatus',
    caption: 'transaction_status',
    addition: { allowSorting: true },
    dataType: 'number',
  },
  {
    dataField: 'transactionNo',
    caption: 'transaction_no',
    addition: { allowSorting: true },
    dataType: 'string',
  },
  {
    dataField: '',
    caption: 'transfer_money',
    addition: { allowSorting: false },
    dataType: 'number',
  },
  { dataField: 'depositDescriptionIade', caption: 'reason_cancelation', addition: { allowSorting: true }, dataType: 'string' },
  {
    dataField: 'refund',
    caption: 'return',
    addition: { allowSorting: false, alignment: 'center' },
    dataType: 'number',
  },
  { dataField: 'refundTransactionNo', caption: 'return_transaction_no', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'masakDecRequeired', caption: 'masak_notification', addition: { alignment: 'center', allowSorting: true, visible: false }, dataType: 'boolean' },
  { dataField: 'masakReport', caption: 'masak_notification_made', addition: { alignment: 'center', allowSorting: true, visible: false }, dataType: 'boolean' },
];
// Withdrawal Columns
export const withdrawalColumns = [
  { dataField: 'uid', caption: 'uid', dataType: 'number' },
  { dataField: 'companyBankName', caption: 'send_account', addition: { allowSorting: true }, dataType: 'string' },
  {
    dataField: 'withdrawDate',
    caption: 'transaction_date',
    addition: { allowSorting: true, format: 'dd/MM/yyyy HH:mm:ss', sortOrder: 'desc' },
    dataType: 'date',
    filterType: 'date',
    editorOptions: { type: 'date', displayFormat: 'dd/MM/yyyy', pickerType: 'calendar', dateSerializationFormat: 'yyyy-MM-ddT00:00:01' },
  },
  { dataField: 'recordId', caption: 'transaction_no', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'channel', caption: 'channel', addition: { allowSorting: true, visible: false }, dataType: 'string' },
  { dataField: 'bankName', caption: 'members_bank', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'iban', caption: 'iban', addition: { allowSorting: true, visible: false }, dataType: 'string' },
  { dataField: 'tckn', caption: 'tckn', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'amount', caption: 'amount', addition: { allowSorting: true }, dataType: 'number' },
  { dataField: 'symbol', caption: 'currency', addition: { allowSorting: true, visible: false }, dataType: 'string' },
  { dataField: 'transactionStatus', caption: 'transaction_status', addition: { allowSorting: true } },
  { dataField: 'withdrawDescription', caption: 'reason_cancelation', addition: { allowSorting: true }, dataType: 'string' },
];
// User Manager
export const userManagerColumns = [
  { dataField: 'profileName', caption: 'profile', dataType: 'number' },
  { dataField: 'name', caption: 'name', dataType: 'string' },
  { dataField: 'surname', caption: 'surname', dataType: 'string' },
  { dataField: 'phoneNumber', caption: 'phone', dataType: 'string' },
  { dataField: 'email', caption: 'email', dataType: 'string' },
  { dataField: 'status', caption: 'active_passive', dataType: 'number', addition: { alignment: 'center' } },
];

// lp Quick Transfer
export const lpQuickTransferColumns = [
  { dataField: 'senderLP', caption: 'senderLp' },
  { dataField: 'senderLPCurrency', caption: 'senderLpCurrency' },
  { dataField: 'recipient', caption: 'recipient' },
  { dataField: 'recipientCurrency', caption: 'recipientCurrency' },
  { dataField: 'transferAmount', caption: 'transferAmount' },
  { dataField: 'network', caption: 'network' },
  { dataField: 'walletAddress', caption: 'walletAddress' },
  { dataField: 'channel', caption: 'channel' },
  { dataField: 'entityType', caption: 'entityType' },
  { dataField: 'vaspName', caption: 'vaspName' },
  { dataField: 'coporateName', caption: 'corporateName' },
  { dataField: 'comment', caption: 'comment' },
];

// lp Balances
export const lpBalancesColumns = [
  { dataField: 'lpName', caption: 'lpName' },
  { dataField: 'currency', caption: 'currency' },
  { dataField: 'balance', caption: 'balance' },
  { dataField: 'avaiableBalance', caption: 'availableBalance' },
];

// lp Balance List
export const LpBalanceListColumns = [
  { dataField: 'lpName', caption: 'currency' },
  { dataField: 'totalQuantity', caption: 'quantity' },
  { dataField: 'totalBalance', caption: 'balanceUSDT' },
  { dataField: 'availableBalance', caption: 'availableBalanceUSDT' },
];

// Refunds
export const refundsColumns = [
  { dataField: 'uid', caption: 'uid' },
  { dataField: 'sendAccount', caption: 'sendAccount' },
  { dataField: 'transactionDate', caption: 'transactionDate' },
  { dataField: 'transactionNo', caption: 'transactionNo' },
  { dataField: 'channel', caption: 'channel' },
  { dataField: 'membersBank', caption: 'membersBank' },
  { dataField: 'iban', caption: 'iban' },
  { dataField: 'tckn', caption: 'tckn' },
  { dataField: 'amount', caption: 'amount' },
  { dataField: 'currency', caption: 'currency' },
  { dataField: 'transactionStatus', caption: 'transactionStatus' },
  { dataField: 'reasonForRefund', caption: 'reasonForRefund' },
];

export const banksColumns = [
  { dataField: 'type', caption: 'type', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'userName', caption: 'web_service_username', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'password', caption: 'web_service_password', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'tosUserName', caption: 'web_service_tos_username', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'tosPassword', caption: 'web_service_tos_password', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'apiUrl', caption: 'web_service_api_url', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'secondApiUrl', caption: 'web_service_second_api_url', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'accountNo', caption: 'web_service_account_no', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'customerNo', caption: 'web_service_customer_no', addition: { allowSorting: true }, dataType: 'string' },
];

export const lpsColumns = [
  { dataField: 'type', caption: 'type', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'apiKey', caption: 'api_key', dataType: 'string' },
  { dataField: 'secretKey', caption: 'secret_key', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'apiUrl', caption: 'api_url', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'passPhrase', caption: 'passPhrase', addition: { allowSorting: true }, dataType: 'string' },
];
export const exchangeColumns = [
  { dataField: 'type', caption: 'type', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'apiKey', caption: 'api_key', dataType: 'string' },
  { dataField: 'secretKey', caption: 'secret_key', addition: { allowSorting: true }, dataType: 'string' },
  { dataField: 'apiUrl', caption: 'api_url', addition: { allowSorting: true }, dataType: 'string' },
];

export const serviceManagementColumns = [
  {
    dataField: 'serviceName',
    caption: 'serviceName',
    addition: {
      allowEditing: false,
    },
  },
  {
    dataField: 'workFrequency',
    caption: 'workFrequencySeconds',
    dataType: 'number',
    cellRender: (rowData: any) => {
      const value = rowData.data.workFrequency;
      return value !== null && value !== undefined ? value : '-';
    },
    addition: {
      allowEditing: false,
      cssClass: 'work-frequency-column',
    },
  },
  {
    dataField: 'lastUpdateBy',
    caption: 'lastUpdateBy',
    addition: {
      allowEditing: false,
    },
    cellRender: (rowData: any) => {
      const value = rowData.data.lastUpdateBy;
      if (!value) return '-';

      return value;
    },
  },
  {
    dataField: 'lastUpdateAt',
    caption: 'lastUpdateAt',
    addition: {
      allowSorting: true,
      format: 'dd/MM/yyyy HH:mm:ss',
      sortOrder: 'desc',
    },
    dataType: 'date',
    cellRender: (rowData: any) => {
      return formatDateTimeForDisplay(rowData.data.lastUpdateAt);
    },
  },
  {
    dataField: 'integrationType',
    caption: 'integrationType',
    addition: {
      visible: false,
      allowEditing: false,
    },
  },
];

export const eodBalanceSummaryColumns = [
  { dataField: 'id', caption: 'id', addition: { visible: false, allowSorting: true, sortOrder: 'asc', sortIndex: 0 } },
  { dataField: 'symbol', caption: 'symbol' },
  {
    dataField: 'client',
    caption: 'client',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.client),
  },
  {
    dataField: 'clientUSDT',
    caption: 'clientUsdt',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.clientUSDT),
  },
  {
    dataField: 'custody',
    caption: 'custody',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.custody),
  },
  {
    dataField: 'custodyUSDT',
    caption: 'custodyUsdt',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.custodyUSDT),
  },
  {
    dataField: 'lp',
    caption: 'lp',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.lp),
  },
  {
    dataField: 'lpusdt',
    caption: 'lpUsdt',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.lpusdt),
  },
  {
    dataField: 'bank',
    caption: 'bank',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.bank),
  },
  {
    dataField: 'bankUSDT',
    caption: 'bankUsdt',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.bankUSDT),
  },
  {
    dataField: 'company',
    caption: 'company',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.company),
  },
  {
    dataField: 'companyUSDT',
    caption: 'companyUsdt',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.companyUSDT),
  },
  {
    dataField: 'clientvsCompany',
    caption: 'clientVsCompany',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.clientvsCompany),
  },
  {
    dataField: 'dcr',
    caption: 'dailyConversionRate',
    cellRender: (rowData: any) => renderCellWithZeroAndLargeNumberMask(rowData.data.dcr),
  },
  { dataField: 'lastUpdatedAt', caption: 'lastUpdateAt' },
  { dataField: 'lastUpdatedBy', caption: 'lastUpdateBy' },
];

export const logDetailsColumns = [
  { dataField: 'request', caption: 'requestSendToBank' },
  { dataField: 'response', caption: 'responseReceivedFromBank' },
];

// Payment Service Management Edit Columns
export const getPaymentServiceManagementEditColumns = (t: (key: string) => string) => [
  {
    title: t('field'),
    dataIndex: 'label',
    key: 'label',
    width: '20%',
    render: (text: string) => text,
  },
  {
    title: t('value'),
    dataIndex: 'value',
    key: 'value',
    width: '80%',
  },
];
