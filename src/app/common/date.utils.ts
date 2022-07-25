import * as moment from "moment";

export const acceptedDateFormats : [] | any = ["MM-DD-YYYY", "MM/DD/YYYY", "DD-MM-YYYY", "DD/MM/YYYY", 
        moment.HTML5_FMT.DATE, moment.HTML5_FMT.DATETIME_LOCAL_MS, "YYYY-MM-DDTHH:mm:ss.SSSZ",
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS, moment.HTML5_FMT.DATETIME_LOCAL];

export const xlsxDateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";

export function minDateString(date1: string, date2: string, format = acceptedDateFormats) {
  if(date1 && date2) {
    const momentDate1 = moment(date1, format, true);
    const momentDate2 = moment(date2, format, true);
    return moment.min(momentDate1, momentDate2).format(format);
  }
  if(!date1 && date2) {
    return date2;
  }
  if(!date2 && date1) {
    return date1;
  }
  return "";
}

export function convertDatepickerToMomentDate(dateQuery: any): string {
  if(!dateQuery) {
    return "";
  }
  // month of datepicker starts with 1 and moment starts with 0
  const dateObj = {...dateQuery, month: dateQuery.month-1};
  return moment(dateObj).format(moment.HTML5_FMT.DATE);
}