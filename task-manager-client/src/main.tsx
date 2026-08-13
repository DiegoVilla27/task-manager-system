import AppRoutes from '@core/router';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import './index.css';
import '@core/interceptors';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <AppRoutes />
    <Toaster richColors position="bottom-left" closeButton />
  </>
);
