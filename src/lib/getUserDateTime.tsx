import spacetime from 'spacetime';

const getUserDateTime = (userTimezone: string, localTime: string, localDate: string,localTimezone: string,militaryFormat:boolean = true) => {
  
  const spaceTimeInitValue = () => {
    // 'July 2, 2017 5:01:00'
    let [_number, _label] = localTime.split(' ');
    let [_hour, _minute] = _number.replace(/^0+/, '').split(':');
    if (_label === 'am') _hour = '00';
    if (_label === 'pm') 
      _hour = (parseInt(_hour, 10) + 12).toString();
    return `${localDate} ${_hour}:${_minute}:00`;
  }
  
  // console.dir(userTimezone);
  // console.dir(localTime);
  // console.dir(localDate);
  // console.dir(localTimezone);

  const d = spacetime(spaceTimeInitValue());
  // d.goto(localTimezone);
  // console.log(`Timezone: ${localTimezone}, spacetime.now():`);
  // console.dir(spacetime.now());
  const userTime = d.goto(userTimezone);
  // console.dir(userTime.minute());
  // DONE: switch timezone is not changing time
  // console.log(`Timezone: ${userTimezone}, spacetime.now():`);
  // console.dir(spacetime.now());
  // console.dir(`${d.hour()}:${d.minute()}`);
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