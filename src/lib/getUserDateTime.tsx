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

  let [monthDay, year] = localDate?.split(', ');
  let [month, day] = monthDay?.split(' ');
  const formattedDate = formatDate(year, month as keyof typeof months, day);

  const d = spacetime(formattedDate, localTimezone).time(_localTime);

  const userTime = d.goto(userTimezone);
  const timeCache = new Date(userTime.epoch);
  if (!militaryFormat) {
    return {
      date: `${timeCache.getMonth() + 1
        }-${timeCache.getDate()}-${timeCache.getFullYear()}`,
      time: userTime.format('time') as string,
    };
  }
  return {
    date: `${timeCache.getMonth() + 1
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
  return `${year}/${months[month]}/${day.padStart(2, '0')}`;
};

export default getUserDateTime;
