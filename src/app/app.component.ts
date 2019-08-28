import { Component } from '@angular/core';

import { NgModel } from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";
import {AppGlobal} from "./Content/AppGlobal";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppGlobal]
})
export class AppComponent {
  constructor(private translate: TranslateService, private appGlobal: AppGlobal) {
    translate.setDefaultLang(this.appGlobal.defaultContent);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(this.appGlobal.defaultContent);
  }
}
