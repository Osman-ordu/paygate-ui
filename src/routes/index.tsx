import { lazy, Suspense, useCallback, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from '../utils/errorBoundry/ErrorBoundry';
import { getEncryptModuleData } from '../utils/general';
import UserLayout from '../layout/UserLayout';
import Loader from '../components/Loader';
import AuthRoute from '../components/AuthRoute';
const Login = lazy(() => import('../pages/Auth/Login'));
const TreasuryTransfer = lazy(() => import('../pages/TreasuryTransfer'));
const TransferList = lazy(() => import('../pages/TransferList'));
const Withdrawal = lazy(() => import('../pages/Withdrawal'));
const Balance = lazy(() => import('../pages/Balance'));
const Consensus = lazy(() => import('../pages/Consensus'));
const Account = lazy(() => import('../pages/Account'));
const Hours = lazy(() => import('../pages/Hours'));
const WhitelistAccounts = lazy(() => import('../pages/WhitelistAccounts'));
const Integration = lazy(() => import('../pages/Integration/integration'));
const ChangePassword = lazy(() => import('../pages/ChangePassword/index'));
const ProfileManager = lazy(() => import('../pages/ProfileManager'));
const UserManager = lazy(() => import('../pages/UserManager'));
const UserApprovals = lazy(() => import('../pages/UserApprovals'));
const AutoTransfer = lazy(() => import('../pages/AutoTransferBalance'));
const LpAccounts = lazy(() => import('../pages/LpAccounts'));
const LpTransfer = lazy(() => import('../pages/LpTransfer/index'));
const LpTransferList = lazy(() => import('../pages/LpTransferList/index'));
const LpWhitelisted = lazy(() => import('../pages/LpWhitelisted/index'));
const LpBalance = lazy(() => import('../pages/LpBalance/index'));
const Refunds = lazy(() => import('../pages/Refunds/index'));
const PaymentServicesManagement = lazy(() => import('../pages/PaymentServicesManagement/index'));
const EodBalance = lazy(() => import('../pages/EodBalance/index'));
import Deposit from '../pages/Deposit';

const AsyncRoute: any = ({ component: Component }: { component: React.LazyExoticComponent<() => JSX.Element> }) => (
  <ErrorBoundary>
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

export default function AppRoutes() {
  const perData = useMemo(() => getEncryptModuleData(), []);
  const hasPermission = useCallback((moduleName: string) => perData?.find((item: any) => item.moduleName === moduleName)?.permissionScore >= 1, [perData]);
  return (
    <Routes>
      <Route
        path='/'
        element={
          <AuthRoute>
            <UserLayout />
          </AuthRoute>
        }>
        <Route index element={<Navigate to='/deposit' />} />
        <Route path='/auto-transfer' element={hasPermission('AutoTransfer') ? <AsyncRoute component={AutoTransfer} /> : <Navigate to='/deposit' />} />
        <Route path='/treasury-transfer' element={hasPermission('TreasuryTransfer') ? <AsyncRoute component={TreasuryTransfer} /> : <Navigate to='/deposit' />} />
        <Route path='/transfer-list' element={hasPermission('TransferList') ? <AsyncRoute component={TransferList} /> : <Navigate to='/deposit' />} />
        <Route path='/whitelist-accounts' element={hasPermission('Whitelist') ? <AsyncRoute component={WhitelistAccounts} /> : <Navigate to='/deposit' />} />
        <Route path='/deposit' element={hasPermission('Deposit') ? <AsyncRoute component={Deposit} /> : <Navigate to='/deposit' />} />
        <Route path='/withdrawal' element={hasPermission('Withdrawal') ? <AsyncRoute component={Withdrawal} /> : <Navigate to='/deposit' />} />
        <Route path='/balance' element={hasPermission('InstanyBalance') ? <AsyncRoute component={Balance} /> : <Navigate to='/deposit' />} />
        <Route path='/consensus' element={hasPermission('Consensus') ? <AsyncRoute component={Consensus} /> : <Navigate to='/deposit' />} />
        <Route path='/account' element={hasPermission('AddAccount') ? <AsyncRoute component={Account} /> : <Navigate to='/deposit' />} />
        <Route path='/hours' element={hasPermission('WorkingHours') ? <AsyncRoute component={Hours} /> : <Navigate to='/deposit' />} />
        <Route path='/integrations' element={hasPermission('Integration') ? <AsyncRoute component={Integration} /> : <Navigate to='/deposit' />} />
        <Route path='/profile-manager' element={hasPermission('ProfileManager') ? <AsyncRoute component={ProfileManager} /> : <Navigate to='/deposit' />} />
        <Route path='/user-manager' element={hasPermission('UserManager') ? <AsyncRoute component={UserManager} /> : <Navigate to='/deposit' />} />
        <Route path='/user-approvals' element={hasPermission('UserApprovals') ? <AsyncRoute component={UserApprovals} /> : <Navigate to='/deposit' />} />
        <Route path='/lp-transfer' element={hasPermission('LPTransfer') ? <AsyncRoute component={LpTransfer} /> : <Navigate to='/deposit' />} />
        <Route path='/lp-transferlist' element={hasPermission('LPTransferList') ? <AsyncRoute component={LpTransferList} /> : <Navigate to='/deposit' />} />
        <Route path='/lp-balances' element={hasPermission('LPBalances') ? <AsyncRoute component={LpBalance} /> : <Navigate to='/deposit' />} />
        <Route path='/lp-accounts' element={hasPermission('LPAccounts') ? <AsyncRoute component={LpAccounts} /> : <Navigate to='/deposit' />} />
        <Route path='/lp-whitelisted' element={hasPermission('LPWhiteListed') ? <AsyncRoute component={LpWhitelisted} /> : <Navigate to='/deposit' />} />
        <Route path='/eft-refunds' element={hasPermission('Refund') ? <AsyncRoute component={Refunds} /> : <Navigate to='/deposit' />} />
        <Route path='/payment-services-management' element={hasPermission('PaymentServiceManagement') ? <AsyncRoute component={PaymentServicesManagement} /> : <Navigate to='/deposit' />} />
        <Route path='/eod-balance' element={hasPermission('EODBalance') ? <AsyncRoute component={EodBalance} /> : <Navigate to='/deposit' />} />
        <Route path='/changepassword' element={<AsyncRoute component={ChangePassword} />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
      <Route
        path='/auth/login'
        element={
          <AuthRoute isPublic={true}>
            <AsyncRoute component={Login} />
          </AuthRoute>
        }
      />
    </Routes>
  );
}
