import * as ReactDOM from 'react-dom/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Root } from './components/Root';
import './i18n/index';
import 'devextreme/dist/css/dx.dark.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

dayjs.extend(utc);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
