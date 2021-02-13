import spacetime from 'spacetime';

const getUserDateTime = (userTimezone: string, localTime: string, localDate: string,localTimezone: string) => {
  
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
  // d.time(_localTime());
  d.goto(userTimezone);
  // console.dir(`${d.hour()}:${d.minute()}`);
  return {
    date: `${d.month()+1}-${d.date()}-${d.year()}`,
    time: `${d.hour()}:${d.minute()}`
  };
};

export default getUserDateTime;