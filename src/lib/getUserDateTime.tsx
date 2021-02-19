import spacetime from 'spacetime';

const getUserDateTime = (userTimezone: string, localTime: string, localDate: string,localTimezone: string,militaryFormat:boolean = true) => {
  // localTime format: HH:MM
  let [_hour, _minute] = localTime.split(':');
  let hour =Number(_hour);
  let minute = Number(_minute);
  let suffix = hour >= 12 ? "pm":"am"; 
  hour = ((hour + 11) % 12 + 1);
  const _localTime = `${hour}:${minute}${suffix}`;
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

export default getUserDateTime;