import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

let app = function(){
  // Application Constructor
    this.initialize =  function() {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
      if (environment.dev) {
        this.receivedEvent('deviceready');
      }
    };

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    this.onDeviceReady = function() {
      this.receivedEvent('deviceready');
    };

    // Update DOM on a Received Event
    this.receivedEvent =  function(id) {
      if ( id = 'deviceready') {
        platformBrowserDynamic().bootstrapModule(AppModule)
          .catch(err => console.log(err));
      }
    };
    this.initialize();
}.bind(this);

app();

