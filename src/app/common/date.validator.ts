import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";
import { acceptedDateFormats } from "./date.utils";


export function DateValidator(format = acceptedDateFormats): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = moment(control.value, format, true);

    if (!val.isValid()) {
      return { invalidDate: true };
    }

    return null;
  };
}

export function DateStringNoFormValidator(format = acceptedDateFormats): any {
  return (dateString: string): any | null => {
    const val = moment(dateString, format, true);
    if (!val.isValid()) {
      return { invalidDate: true };
    }
    return null;
  };
}
