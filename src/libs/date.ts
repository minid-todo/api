import dayjs, { type Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const DateJS = {
  getCurrentDate(): Dayjs {
    return dayjs().tz('Asia/Bangkok');
  },
  format(template: string) {
    return DateJS.getCurrentDate().tz('Asia/Bangkok').format(template);
  },

  toUnix(): number {
    return DateJS.getCurrentDate().tz('Asia/Bangkok').unix();
  },
};
