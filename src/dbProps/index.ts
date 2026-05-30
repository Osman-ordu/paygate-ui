import { ReactNode } from 'react';

// General
export interface AddGeneralFormProps {
  onClose: () => void;
  onFormReset: any;
  shouldResetForm: any;
}
export interface VerifyFormProps {
  onClose: () => void;
  onFormReset: any;
  shouldResetForm: any;
  emailProp: string | any;
}
export interface EditGeneralFormProps {
  onClose: () => void;
  selectedRowData: any;
  onFormReset: any;
  shouldResetForm: any;
}
export interface DeleteGeneralFormProps {
  onClose: () => void;
  rowData: any;
}
export interface UpdateGeneralFormProps {
  onClose: () => void;
  selectedRowData: any;
  onFormReset: any;
  shouldResetForm: any;
}
// Auth - Login
export interface LoginFormProps {
  email: string;
  password: string;
}
// Accounts Page
export interface AddAccountsProps {
  selectBank: string | any;
  branchOffice: string | any;
  iban: number | any;
  accountName: string | any;
  accountNo: number | any;
  precedence: string | any;
  accountEnable: boolean | any;
  accountHolderName: string | any;
  vkn: string | any;
  accountType: any;
}
// Update Bank Credentials Page
export interface UpdateBankCredentialsProps {
  user_name?: string | any;
  password?: string | any;
  to_user_name?: string | any;
  to_password?: string | any;
  real_sender_name?: string | any;
  api_url?: string | any;
  second_api_url?: string | any;
  account_no?: string | any;
  type?: string | any;
  customer_no?: string | any;
  api_key?: string | any;
  secret_key?: string | any;
  passPhrase?: string | any;
  cointr_tos_password?: string | any;
  okx_tos_password?: string | any;
}

export interface EditBankCredentialsProps {
  userName?: string;
  password?: string;
  tosUserName?: string;
  tosPassword?: string;
  customerNo?: string;
  accountNo?: string;
  apiKey?: string;
  apiUrl?: string;
  secondApiUrl?: string;
  passPhrase?: string;
  secretKey?: string;
  type?: string;
}
export interface EditAccountsProps {
  id: any;
  select_bank: string | any;
  branch_office?: string | any;
  iban: number | any;
  account_name: string | any;
  account_no: number | any;
  precedence: string | any;
  account_enable: string | any;
  accountHolderName: string | any;
  vkn: string | any;
  accountType: any;
}
// Deposit Page
export interface SortableData {
  depositDate: string;
  [key: string]: any;
}
export interface IRefundData {
  loading: boolean;
  triggeredActionIds: string[];
}
export interface ICancellationData {
  loading: boolean;
  triggeredActionIds: string[];
}
export interface IRefundData {
  loading: boolean;
  triggeredActionIds: string[];
}
// Consensus Page
export interface ConsensusProps {
  currency: string;
  endDate: string | Date;
  startDate: string | Date;
  adjustedEndDate?: string | Date;
  adjustedStartDate?: string | Date;
}
// Refunds Page
export interface RefundsProps {
  endDate: string | Date;
  startDate: string | Date;
  adjustedEndDate?: string | Date;
  adjustedStartDate?: string | Date;
}

export interface ConsensusData {
  bankName?: string;
  currency?: string;
  depositAmount?: number;
  withdrawAmount?: number;
  accountName?: string;
}
export interface ConsensusFormProps {
  onClose?: () => void;
  onFormReset?: any;
  shouldResetForm?: any;
}
// integration
export interface FormValues {
  user_name: any;
  password: any;
  api_url: any;
  type: any;
  real_sender_name?: any;
  account_no?: any;
}
// ToolbarButton
export interface ToolbarButtonProps {
  title?: any;
  icon?: any;
  type?: string;
  htmlType?: 'submit' | undefined;
  handleClick?: any;
}
// Deposit
export interface DepositGridCellData {
  data: {
    transactionStatus: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    [key: string]: any;
  };
  value: any;
}
// Withdrawal
export interface WithdrawalGridCellData {
  data: {
    transactionStatus: 0 | 1 | 2 | 3 | 4 | 5;
    [key: string]: any;
  };
  value: any;
}

// column props
export interface ColumnConfig {
  dataField: string;
  caption: string;
  cellRender?: any;
  addition?: any;
  dataType?: any;
}
// datagrid props
export interface CDataGridProps {
  children?: React.ReactNode;
  editLogsVisible?: boolean | ((data: any) => boolean);
  handleEditLogs?: (data: any) => void;
  stateStore?: string;
  gridKey?: string;
  className?: any;
  data: any;
  refSource?: any;
  height?: string;
  columns?: ColumnConfig[] | [];
  handleOpenEditModal?: (data: any) => void;
  handleOpenDeleteModal?: (data: any) => void;
  handleOpenModal?: () => void;
  handleOpenSearch?: () => void;
  handleUploadModal?: () => void;
  handleExportExcel?: (data: any) => void;
  handleSelectRow?: (data: any) => void;
  handleReset?: (data: any) => void;
  handleLogs?: (data: any) => void;
  handleDeleteRow?: (data: any) => void;
  handleOpenChangePasswordModal?: (data: any) => void;
  handleAssignSpa?: (data: any) => void;
  handleAutoSize?: () => void;
  handleRefresh?: () => void;
  handleBackButton?: () => void;
  handleImport?: () => void;
  handleSave?: (data: any) => void;
  handleStartAllBot?: (data: any) => void;
  handleStopAllBot?: (data: any) => void;
  onSelectionChanged?: (data: any) => void;
  handleActiveButton?: (data: any) => void;
  allowColumnResizing?: boolean;
  allowSorting?: boolean;
  selectedRowKeys?: any;
  remoteOperations?: any;
  allowEditing?: boolean;
  exportButtonTitle?: string;
  loadPanel?: any;
  isVisible?: true;
  addLogicVisible?: boolean;
  editButtonVisible?: boolean | ((rowData: any) => boolean);
  activeButtonVisible?: boolean;
  changePasswordButtonVisible?: boolean;
  deleteButtonVisible?: boolean;
  deleteVisible?: boolean;
  resetVisible?: boolean;
  logsVisible?: boolean;
  deleteBotVisible?: boolean;
  assignSpaVisible?: boolean;
  refreshVisible?: boolean;
  saveVisible?: boolean;
  selectButtonVisible?: boolean;
  startStopBotVisible?: boolean;
  startAllBotVisible?: boolean;
  stopAllBotVisible?: boolean;
  startBotDisabled?: boolean;
  stopBotDisabled?: boolean;
  multiselect?: boolean;
  autoSizeVisible?: boolean;
  backButtonVisible?: boolean;
  linkTo?: (data: any) => void;
  enableSwitchVisible?: boolean;
  handleEnable?: (data: any) => void;
  handleStatusChange?: (data: any) => void;
  importButtonVisible?: boolean;
  columnChooserButtonVisible?: boolean;
  searchVisible?: boolean;
  toolbarVisible?: boolean;
  excelExportVisible?: boolean;
  customMenuItems?: (e: any) => void;
  onRowPrepared?: (e: any) => void;
  onCellClick?: (e: any) => void;
  onCellPrepared?: (e: any) => void;
  onRowUpdating?: (data: any) => void;
  columnFilter?: boolean;
  paging?: boolean;
  pTitle?: any;
  pageSize?: number;
  renderingMode?: 'virtual' | 'standard' | undefined;
  scrollingMode?: 'virtual' | 'infinite' | 'standard' | undefined;
  summary?: {
    totalItems?: Array<{
      column: string;
      summaryType?: string;
      showInColumn?: string;
      displayFormat?: string | ((cellInfo: any) => string);
      valueFormat?: string;
      format?: string;
    }>;
    position?: 'top' | 'bottom';
  };
}
export interface AddUserProps {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  roleId?: number;
  profile?: any;
  isActive?: boolean;
}
export interface AddUserFormProps {
  onClose: () => void;
  onFormReset: any;
  shouldResetForm: any;
}
export interface Profile {
  id: number;
  name: string;
  profileName: string;
}
export interface EditUserProps {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  roleId: number;
}

export interface IbanCellProps {
  value: string;
  variant: 'deposit' | 'withdrawal';
}

export interface IActionState {
  loading: boolean;
  triggeredActionIds: string[];
}

export interface SelectBoxOption {
  key: number;
  id: number;
  label: string;
}

export interface AddTransferListProps {
  senderAccountName: SelectBoxOption;
  senderBankName: string | any;
  senderIban: string | any;
  transactionNo: string | any;
  comment: string | any;
  transferType: number | any;
  dateAndTime: Date | any;
  whitelistAccountName: SelectBoxOption;
  recipientBankName: string | any;
  recipientFullName: string | any;
  recipientIban: string | any;
  amount: number | any;
}

export interface AddTransferProps {
  senderBankName: string | number | readonly string[] | undefined;
  recipientBankName: string | number | readonly string[] | undefined;
  sender: SelectBoxOption;
  recipient: SelectBoxOption;
  transferType: number | any;
  numberOfTransfers: number | any;
  eachTransferAmount: number | any;
  description: string | any;
  comment: string | any;
}

export interface EditProfileDataType {
  key: React.Key;
  fieldKey: string;
  moduleName: string;
  moduleId: number;
  view: number;
  create: number;
  edit: number;
  delete: number;
  permissionScore: number[];
}

export interface EditRoleDataType {
  key: React.Key;
  moduleName: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  permissionScore: number;
  fieldKey: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface VerifyProps {
  email?: string;
  code: string;
}

export interface QRCodeModalProps {
  isVisible: boolean;
  onClose: () => void;
  qrCodeData: string;
  title?: string;
}

export interface TabButtonProps {
  title: string;
  handleClick: () => void;
  status: string;
}

export interface FormFieldConfig {
  dataField: string;
  caption: string;
  dataType?: string;
  required?: boolean;
  label?: string;
}

export interface IntegrationEditFormProps extends UpdateGeneralFormProps {
  integrationType: 'BANKS' | 'EXCHANGE' | 'LPS';
}

export interface StatusUpdateFormProps {
  transactionStatus: any;
  refundStatus: any;
  comment: string | any;
}
