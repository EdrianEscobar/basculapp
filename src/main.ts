import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppConfigModule, appConfig} from './app/app.config';
import { AppComponent } from './app/app.component';


//platformBrowserDynamic().bootstrapModule(AppConfigModule).catch(err => console.error(err));

 bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
