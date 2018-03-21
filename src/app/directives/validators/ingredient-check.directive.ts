import {AbstractControl, ValidatorFn} from '@angular/forms';

export function IngredientCheckDirective(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { 'invalidChar' : {vlaue: control.value} } : null;
  };
}
