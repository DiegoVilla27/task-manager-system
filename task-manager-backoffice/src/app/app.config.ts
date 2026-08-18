import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { routes } from './core/router/app.routes';
import tanstackConfig from '@core/tanstack';
import { jwtInterceptor } from '@core/interceptors/jwt.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    provideTanStackQuery(tanstackConfig()),
  ],
};
