import spacetime from 'spacetime';

const getUserDateTime = (userTimezone: string, localTime: string, localDate: string,localTimezone: string,militaryFormat:boolean = true) => {
  // localTime format: HH:MM
  // let [_hour, _minute] = localTime.split(':');
  // let hour =Number(_hour);
  // let minute = Number(_minute);
  // let suffix = hour >= 12 ? "pm":"am"; 
  // hour = ((hour + 11) % 12 + 1);
  // const _localTime = `${hour}:${minute}${suffix}`;
  // console.log("🚀 ~ file: getUserDateTime.tsx ~ line 11 ~ getUserDateTime ~ _localTime", _localTime)

  let _localTime = ``;
  if(is12HourFormat(localTime)) {
    _localTime = format12HourTime(localTime);
  } else {
    _localTime = format24HourTime(localTime);
  }
  const d = spacetime().time(_localTime);

  const userTime = d.goto(userTimezone);
  // console.dir(userTime.minute());
  // DONE: switch timezone is not changing time
  // console.log(`Timezone: ${userTimezone}, spacetime.now():`);
  // console.dir(spacetime.now());
  // console.log('Shanghai time:')
  // console.dir(d.goto('Asia/Shanghai').format('time'));
  // DONE: getting Shanghai time, but am and pm is opposite
  if(!militaryFormat) {
    return {
      date: `${userTime.month()+1}-${userTime.date()}-${userTime.year()}`,
      time: userTime.format('time') as string
    }
  }
  return {
    date: `${userTime.month()+1}-${userTime.date()}-${userTime.year()}`,
    time: userTime.format('time-24') as string
  };
};

const is12HourFormat = (time:string) => {
  return (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm'));
};
const format12HourTime = (time:string) => {
  // This function only handles 12:23 PM or 12:23 pm.
  // Currently system only output these two types.
  let [ _time, _label ] = time.split(' ');
  return `${_time}${_label.toLowerCase()}`;
};
const format24HourTime = (time:string) => {
  let [_hour, _minute] = time.split(':');
  let hour =Number(_hour);
  let minute = Number(_minute);
  let suffix = hour >= 12 ? "pm":"am"; 
  hour = ((hour + 11) % 12 + 1);
  const _localTime = `${hour}:${minute}${suffix}`;
  return _localTime;
};

export default getUserDateTime;