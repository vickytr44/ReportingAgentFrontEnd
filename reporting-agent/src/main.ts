import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GenerateReportComponent } from './app/Components/generate-report/generate-report.component';
import { GenerateBarGraphComponent } from './app/Components/generate-bargraph/generate-bargraph.component';

bootstrapApplication(AppComponent, {
  providers:[
    provideRouter([
      { path: '', redirectTo: 'report', pathMatch: 'full' },
      { path: 'report', component: GenerateReportComponent },
      { path: 'graph', component: GenerateBarGraphComponent }
    ]),
    ...appConfig.providers,
    importProvidersFrom(BrowserAnimationsModule)
  ]})
  .catch((err) => console.error(err));
