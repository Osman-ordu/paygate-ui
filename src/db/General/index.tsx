import { generateMenuKey } from '../../utils/general';
import PiHandDeposit from '../../assets/svg/PiHandDeposit.svg?react';
import PiHandWithdraw from '../../assets/svg/PiHandWitdraw.svg?react';
import PiBank from '../../assets/svg/PiBank.svg?react';
import PiWallet from '../../assets/svg/PiWallet.svg?react';
import PiTransferList from '../../assets/svg/PiTransferList.svg?react';
import PiHandShake from '../../assets/svg/PiHandShake.svg?react';
import PiFilePlus from '../../assets/svg/PiFilePlus.svg?react';
import PiClockUser from '../../assets/svg/PiClockUser.svg?react';
import SettingsOutlined from '../../assets/svg/SettingsOutlined.svg?react';
import ProfileManagement from '../../assets/svg/ProfileManagement.svg?react';
import UserManagement from '../../assets/svg/UserManagement.svg?react';
import PaymentIcon from '../../assets/svg/PaymentIcon.svg?react';
import TreasuryIcon from '../../assets/svg/TreasuryIcon.svg?react';
import ILpBalance from '../../assets/svg/LpBalance.svg?react';
import ILpTransfer from '../../assets/svg/LpTransfer.svg?react';
import ILpTransferlist from '../../assets/svg/LpTransferlist.svg?react';
import ILpAccounts from '../../assets/svg/LpAccounts.svg?react';
import ILpWhitelist from '../../assets/svg/LpWhitelist.svg?react';
import IAutoTransfer from '../../assets/svg/AutoTransferBalance.svg?react';
import PaymentServiceManagementSvg from '../../assets/svg/PaymentServiceManagement.svg?react';
import BalanceHubSvg from '../../assets/svg/BalanceHub.svg?react';
import LpIcon from '../../assets/svg/Lp.svg?react';

export const menuData: any = [
  {
    key: 'sub1',
    icon: <TreasuryIcon />,
    title: 'treasury_hub',
    submenu: [
      {
        key: generateMenuKey(),
        icon: <PiHandWithdraw />,
        title: 'treasuryTransfer',
        titleV: 'TreasuryTransfer',
        link: '/treasury-transfer',
      },
      {
        key: generateMenuKey(),
        icon: <PiTransferList />,
        title: 'transferList',
        titleV: 'TransferList',
        link: '/transfer-list',
      },
      {
        key: generateMenuKey(),
        icon: <PiFilePlus />,
        title: 'whitelistAccounts',
        titleV: 'Whitelist',
        link: '/whitelist-accounts',
      },
    ],
  },
  {
    key: 'sub2',
    icon: <LpIcon />,
    title: 'lp_transfer_hub',
    submenu: [
      {
        key: generateMenuKey(),
        icon: <ILpTransfer />,
        title: 'lp_transfer',
        titleV: 'LPTransfer',
        link: '/lp-transfer',
      },
      {
        key: generateMenuKey(),
        icon: <ILpTransferlist />,
        title: 'lp_transfer_list',
        titleV: 'LPTransferList',
        link: '/lp-transferlist',
      },
      {
        key: generateMenuKey(),
        icon: <ILpBalance />,
        title: 'lp_balances',
        titleV: 'LPBalances',
        link: '/lp-balances',
      },
      {
        key: generateMenuKey(),
        icon: <ILpAccounts />,
        title: 'lp_accounts',
        titleV: 'LPAccounts',
        link: '/lp-accounts',
      },
      {
        key: generateMenuKey(),
        icon: <ILpWhitelist />,
        title: 'lp_whitelisted',
        titleV: 'LPWhiteListed',
        link: '/lp-whitelisted',
      },
    ],
  },
  {
    key: 'sub3',
    icon: <PaymentIcon />,
    title: 'payment_hub',
    submenu: [
      {
        key: generateMenuKey(),
        icon: <PiHandDeposit />,
        title: 'deposit',
        titleV: 'Deposit',
        link: '/deposit',
      },
      {
        key: generateMenuKey(),
        icon: <PiHandWithdraw />,
        title: 'withdrawal',
        titleV: 'Withdrawal',
        link: '/withdrawal',
      },
      {
        key: generateMenuKey(),
        icon: <ILpTransfer />,
        title: 'eftRefunds',
        titleV: 'Refund',
        link: '/eft-refunds',
      },
    ],
  },
  {
    key: 'sub4',
    icon: <BalanceHubSvg />,
    title: 'balance_hub',
    submenu: [
      {
        key: generateMenuKey(),
        icon: <BalanceHubSvg />,
        title: 'eod_balance_summary',
        titleV: 'EODBalance',
        link: '/eod-balance',
      },
    ],
  },
  {
    key: 'sub5',
    icon: <PiBank />,
    title: 'banks',
    submenu: [
      {
        key: generateMenuKey(),
        icon: <PiWallet />,
        title: 'instant_balance',
        titleV: 'InstanyBalance',
        link: '/balance',
      },
      {
        key: generateMenuKey(),
        icon: <IAutoTransfer />,
        title: 'auto_transfer_balance',
        titleV: 'AutoTransfer',
        link: '/auto-transfer',
      },
      {
        key: generateMenuKey(),
        icon: <PiHandShake />,
        title: 'consensus',
        titleV: 'Consensus',
        link: '/consensus',
      },
      {
        key: generateMenuKey(),
        icon: <PiFilePlus />,
        title: 'add_account',
        titleV: 'AddAccount',
        link: '/account',
      },
      {
        key: generateMenuKey(),
        icon: <PiClockUser />,
        title: 'working_hours',
        titleV: 'WorkingHours',
        link: '/hours',
      },
    ],
  },
  {
    key: 'sub6',
    icon: <SettingsOutlined />,
    title: 'settings',
    submenu: [
      {
        key: generateMenuKey(),
        icon: <ProfileManagement />,
        title: 'profile_manager',
        titleV: 'ProfileManager',
        link: '/profile-manager',
      },
      {
        key: generateMenuKey(),
        icon: <UserManagement />,
        title: 'user_manager',
        titleV: 'UserManager',
        link: '/user-manager',
      },
      {
        key: generateMenuKey(),
        icon: <PiBank />,
        title: 'integrations',
        titleV: 'Integration',
        link: '/integrations',
      },
      {
        key: generateMenuKey(),
        icon: <PaymentServiceManagementSvg />,
        title: 'paymentServicesManagement',
        titleV: 'PaymentServiceManagement',
        link: '/payment-services-management',
      },
    ],
  },
];
