import { ApplicationConfig, NgModule } from '@angular/core';
import { RouterLink, RouterOutlet, provideRouter } from '@angular/router';
import { AppRoutingModule, routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StoreModule } from '@ngrx/store';
import { OtrosProcesosModule } from './otros-procesos/otros-procesos.module';


@NgModule({
  declarations: [
  ],
  imports: [
    // otros imports
    HttpClientModule,
    BrowserModule,
    FormsModule,
    RouterOutlet, 
    FormsModule, 
    RouterLink,
    //AppRoutingModule,
    StoreModule.forRoot({
    }),
    OtrosProcesosModule
  ],
  providers: []
})
export class AppConfigModule { }

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimationsAsync()
  ]
};
