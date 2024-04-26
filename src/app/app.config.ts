import { ApplicationConfig, NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReportesComponent } from './reportes/reportes.component';
import { AppComponent } from './app.component';




@NgModule({
  imports: [
    // otros imports
    HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  declarations: [
    
  ],
  
  providers: [],
  
})
export class AppConfigModule { }

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(), provideAnimationsAsync()]
};
