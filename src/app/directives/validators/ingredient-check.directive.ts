import {AbstractControl, ValidatorFn} from '@angular/forms';

export function IngredientCheckDirective(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): any => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? control.value : null;
  };
}
