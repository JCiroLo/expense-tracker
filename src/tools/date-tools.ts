import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

const DateTools = {
  get now() {
    return new Date();
  },
  get day() {
    return new Date().getDate();
  },
  get daysInMonth() {
    return dayjs().daysInMonth();
  },
  get month() {
    return new Date().getMonth();
  },
  get months() {
    return Array.from({ length: 12 }, (_, i) => ({
      name: dayjs().month(i).format("MMMM"),
      value: i,
    }));
  },
  get year() {
    return new Date().getFullYear();
  },
  format(date: Date | string, format: string) {
    return dayjs(this.timestampToDate(date)).format(format);
  },
  monthName(monthIndex: number = dayjs().month()) {
    return dayjs().month(monthIndex).format("MMMM");
  },
  timestampToDate(timestamp: Date | string | Timestamp) {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  },
};

export default DateTools;
