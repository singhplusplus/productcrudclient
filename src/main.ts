import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  if (typeof console !== "undefined" && console !== null) {
    const noOp = () => {}; // no-op function
    console.log = noOp;
    console.error = noOp;
    console.warn = noOp;
  }
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
