import AppRoutes from '@core/router/config';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import './index.css';
import interceptorErrors from '@core/interceptors/errors';
import interceptorJwtAuth from '@core/interceptors/jwt';

interceptorErrors();
interceptorJwtAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <AppRoutes />
    <Toaster richColors position="bottom-left" closeButton />
  </>
);
