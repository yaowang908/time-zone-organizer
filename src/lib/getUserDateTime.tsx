import spacetime from 'spacetime';

const getUserDateTime = (
  userTimezone: string,
  localTime: string,
  localDate: string,
  localTimezone: string,
  militaryFormat: boolean = true
) => {
  let _localTime = ``;
  if (is12HourFormat(localTime)) {
    _localTime = format12HourTime(localTime);
  } else {
    _localTime = format24HourTime(localTime);
  }
  // _localTime HH:MMam/pm

  let [monthDay, year] = localDate?.split(', ');
  let [month, day] = monthDay?.split(' ');
  const formattedDate = formatDate(year, month as keyof typeof months, day);
  // console.log("🚀 ~ file: getUserDateTime.tsx ~ line 16 ~ getUserDateTime ~ formattedDate", formattedDate)

  const d = spacetime(formattedDate, localTimezone).time(_localTime);

  const userTime = d.goto(userTimezone);
  // console.log("🚀 ~ file: getUserDateTime.tsx ~ line 21 ~ getUserDateTime ~ userTime", userTime)
  // DONE: switch timezone is not changing time
  // DONE: getting Shanghai time, but am and pm is opposite
  const timeCache = new Date(userTime.epoch);
  // console.log("🚀 ~ file: getUserDateTime.tsx ~ line 25 ~ getUserDateTime ~ timeCache", timeCache.getMonth())
  if (!militaryFormat) {
    return {
      date: `${
        timeCache.getMonth() + 1
      }-${timeCache.getDate()}-${timeCache.getFullYear()}`,
      time: userTime.format('time') as string,
    };
  }
  return {
    date: `${
      timeCache.getMonth() + 1
    }-${timeCache.getDate()}-${timeCache.getFullYear()}`,
    time: userTime.format('time-24') as string,
  };
};

const is12HourFormat = (time: string) => {
  return (
    time?.toLowerCase()?.includes('am') || time?.toLowerCase()?.includes('pm')
  );
};
const format12HourTime = (time: string) => {
  // This function only handles 12:23 PM or 12:23 pm.
  // Currently system only output these two types.
  let [_time, _label] = time?.split(' ');
  if (!_label) {
    return 'Wrong time format';
  }
  return `${_time}${_label?.toLowerCase()}`;
};
const format24HourTime = (time: string) => {
  let [_hour, _minute] = time?.split(':');
  let hour = Number(_hour);
  let minute = Number(_minute);
  let suffix = hour >= 12 ? 'pm' : 'am';
  hour = ((hour + 11) % 12) + 1;
  const _localTime = `${hour}:${minute}${suffix}`;
  return _localTime;
};
const months = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};
const formatDate = (year: string, month: keyof typeof months, day: string) => {
  // let [monthDay, year] = date.split(', ');
  // let month: keyof typeof months;
  // let day: string;
  // [month, day] = monthDay.split(' ');

  // return format yyyy/mm/dd
  return `${year}/${months[month]}/${day.padStart(2, '0')}`;
};

export default getUserDateTime;
