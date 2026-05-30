import { App, ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '../store/store';
import { HistoryRouter } from '../routes/HistoryRouter';
import AppRoutes from '../routes';
import GeneralLayout from '../layout/GeneralLayout';
import { customHistory } from '../routes/History';
import { theme } from '../theme/theme';

export const Root = () => {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <GeneralLayout>
          <App>
            <ToastContainer />
            <HistoryRouter history={customHistory}>
              <AppRoutes />
            </HistoryRouter>
          </App>
        </GeneralLayout>
      </ConfigProvider>
    </Provider>
  );
};
