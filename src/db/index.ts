export const transferListDetailFields = ['ttId', 'ttTcknVkn', 'ttTransferDate', 'ttFullName', 'ttComment', 'ttAmount', 'ttBankName', 'ttStatus', 'ttIban'];
export const lpAccountsDetailFields = ['currencyNetwork', 'accountId'];

export const searchEditorOptions = { placeholder: 'Search column' };

export const columnChooserModes: { key: 'select' | 'dragAndDrop'; name: string }[] = [
  { key: 'dragAndDrop', name: 'Drag and drop' },
  { key: 'select', name: 'Select' },
];

// Services and Mesages Area
export const allowedEndpoints: Set<string> = new Set([
  '/api/Auth/Login',
  `/api/Auth/refreshToken`,
  '/api/BankAccount/consensus',
  '/api/Deposit/refund',
  '/api/Deposit/confirm',
  '/api/Deposit/reject',
  '/api/Deposit/getList',
  `/api/Withdrawal/getList`,
]);

export const encryptionKey = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const viewPageSizes = 4;

export const labelMappings: Record<string, Record<string, string>> = {
  // Banks
  ZiraatBankSettings: {
    userName: 'web_service_username',
    password: 'web_service_password',
    tosUserName: 'web_service_tos_username',
    tosPassword: 'web_service_tos_password',
    apiUrl: 'web_service_api_url',
    secondApiUrl: 'web_service_second_api_url',
    accountNo: 'web_service_account_no',
    customerNo: 'web_service_customer_no',
  },
  VakifbankSettings: {
    userName: 'web_service_username',
    password: 'web_service_password',
    tosUserName: 'web_service_tos_username',
    tosPassword: 'web_service_tos_password',
    apiUrl: 'web_service_api_url',
    secondApiUrl: 'web_service_second_api_url',
    accountNo: 'web_service_account_no',
    customerNo: 'web_service_customer_no',
  },
  SekerbankCredentials: {
    userName: 'web_service_username',
    password: 'web_service_password',
    tosUserName: 'web_service_tos_username',
    tosPassword: 'web_service_tos_password',
    apiUrl: 'web_service_api_url',
    secondApiUrl: 'web_service_second_api_url',
    accountNo: 'web_service_account_no',
    customerNo: 'web_service_customer_no',
  },
  TurkiyeFinansBankSettings: {
    userName: 'web_service_username',
    password: 'web_service_password',
    tosUserName: 'web_service_tos_username',
    tosPassword: 'web_service_tos_password',
    apiUrl: 'web_service_api_url',
    secondApiUrl: 'web_service_second_api_url',
    accountNo: 'web_service_account_no',
    customerNo: 'web_service_customer_no',
  },
  // LPs
  BinanceTrSettings: {
    apiKey: 'api_key',
    secretKey: 'secret_key',
    apiUrl: 'api_url',
    passPhrase: 'passPhrase',
  },
  WhitebitSettings: {
    apiKey: 'api_key',
    secretKey: 'secret_key',
    apiUrl: 'api_url',
    passPhrase: 'passPhrase',
  },
  OkxSettings: {
    apiKey: 'api_key',
    secretKey: 'secret_key',
    apiUrl: 'api_url',
    passPhrase: 'passPhrase',
  },
  CoinTrSettings: {
    apiKey: 'api_key',
    secretKey: 'secret_key',
    apiUrl: 'api_url',
    passPhrase: 'passPhrase',
  },
  // Exchange
  ChainUpCredentials: {
    apiKey: 'chainUpUserName',
    secretKey: 'chainUpPassword',
    apiUrl: 'chainUpApiUrl',
  },
};
