import { http, HttpResponse } from 'msw';
import { authResponse } from './data/auth';
import { meResponse } from './data/user';

const handlersMockHttp = [
  // Intercepta POST /auth/login
  http.post('*/auth/login', async ({ request }) => {
    await request.json();
    return HttpResponse.json(authResponse);
  }),
  // Intercepta POST /auth/register
  http.post('*/auth/register', async ({ request }) => {
    await request.json();
    return HttpResponse.json(authResponse);
  }),
  // Intercepta GET /users/me
  http.get('*/users/me', () => {
    return HttpResponse.json(meResponse);
  }),
];

export default handlersMockHttp;
