import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// NOSONAR: Top-level await is not supported in the Angular application browser target
bootstrapApplication(AppComponent, appConfig).catch((err: unknown) => {
  console.error(err);
});
