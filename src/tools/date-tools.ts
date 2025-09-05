import dayjs from "dayjs";

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
    return dayjs(date).format(format);
  },
  monthName(monthIndex: number = dayjs().month()) {
    return dayjs().month(monthIndex).format("MMMM");
  },
};

export default DateTools;
