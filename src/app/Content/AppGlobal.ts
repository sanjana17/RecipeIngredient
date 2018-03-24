import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class AppGlobal {
  public defaultContent = 'en';
  constructor(public translate: TranslateService){
    this.defaultContent = translate.getBrowserLang();
  }
}
