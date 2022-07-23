import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export const acceptedFormats = ["MM-DD-YYYY", "MM/DD/YYYY", "DD-MM-YYYY", "DD/MM/YYYY", 
        moment.HTML5_FMT.DATE, moment.HTML5_FMT.DATETIME_LOCAL_MS, "YYYY-MM-DDTHH:mm:ss.SSSZ",
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS, moment.HTML5_FMT.DATETIME_LOCAL];

export function DateValidator(format = acceptedFormats): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // format = ["MM/DD/YYYY", ""]
    const val = moment(control.value, format, true);

    if (!val.isValid()) {
      return { invalidDate: true };
    }

    return null;
  };
}