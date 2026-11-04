import { format } from "date-fns-jalali";

export const toFaDigits = (s: string) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/** تاریخ کامل شمسی، مثل «دوشنبه ۱۱ آبان ۱۴۰۵» */
export function fullJalali(date: Date) {
  return toFaDigits(format(date, "EEEE d MMMM y"));
}

/** تاریخ کوتاه شمسی، مثل «۱۱ آبان ۱۴۰۵» */
export function shortJalali(date: Date) {
  return toFaDigits(format(date, "d MMMM y"));
}
