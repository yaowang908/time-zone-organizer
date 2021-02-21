import React from 'react';
import TimezonePicker, { Timezone } from './TimezonePicker.component';

import defaultColor from '../settings/color.settings';
import defaultTimezones from '../data/timezones';
import getUserDateTime from '../lib/getUserDateTime';

// import getCurrentDateTimeInFormat from '../lib/getCurrentDateTimeInFormat';
import Timeline from './Timeline.component';
import { Styled } from './Entry.style'; 
import './Entry.style.scss';

/**
 * @param { string } name - person's name
 * Timeline component
 * @param { string } timezone - selected from a drop down
 * @param { string } time - must be military time: 16:15, set this time to the middle
 * @param { string } date - current date: 12-23-2020
 * @param { string } sunriseTime - must be military time: 7:00
 * @param { string } sunsetTime - must be military time: 18:00
 * @param { boolean } militaryFormat - whether to show time in military format
 * @param { object } color 
 *  @param { string } night - hex code default: '#0A2875',
 *  @param { string } day - hex code default: '#FFEDC0',
 *  @param { string } nightText - hex code default: '#90AFFF',
 *  @param { string } dayText - hex code default: '#0A2875',
 *  @param { string } background - hex code default: '#0A2875',
 *  @param { string } textLighter - hex code default: '#FDFDFF',
 *  @param { string } textDarker - hex code default: '#4B67AD',
 * @param { number } elementWidth - number of the element width in px
 */

export interface Props {
  name: string;
  timezone: string;
  localTimezone: string;
  localTime:string;
  localDate:string;
  updateUser: (newTimezone:string) => void;
  updateUserName: (newUsername:string) => void;
  sunriseTime?: string;
  sunsetTime?: string;
  militaryFormat?: boolean;
  elementWidth?: number;
  color?: {
    night?: string;
    day?: string;
    nightText?: string;
    dayText?: string;
    background?: string;
    textLighter?: string;
    textDarker?: string;
  }
}

const Entry: React.FC<Props> = ({
  name='New User',
  timezone = 'America/New_York', 
  localTimezone = 'America/New_York',
  localTime,
  localDate,
  sunriseTime = '6:00', 
  sunsetTime = '18:00', 
  updateUser,
  updateUserName,
  militaryFormat = true,
  color = defaultColor,
  elementWidth = 50
}) => {

  const getDefaultTimezoneObject = (timezone: string) => {
    const newArray = defaultTimezones.filter(el => {return el.label === timezone});
    if (newArray.length >= 1) {
      // console.dir(newArray[0]);
      return newArray[0];
    }
    return { id: 12,value: "(GMT-05:00) Eastern Time", label: "America/New_York"};
  };

  const [ selectedTimezone,setSelectedTimezone ] = React.useState<Timezone>(getDefaultTimezoneObject(timezone));
  const [ userNameState, setUserNameState ] = React.useState<string>(name);
  // DONE: should use the prop to init selectedTimezone
  // NOTE: setState here probably is not a perfect solution, context api should be good to solve this
  // Is it really necessary to hold a overall timezone data in homepage component
  // Only change the state in individual Entry, this could save time and simplify the logic
  const [ localTimeState, setLocalTimeState ] = React.useState(localTime);
  const [ localDateState, setLocalDateState ] = React.useState(localDate);
  const [ userTimeState, setUserTimeState ] = React.useState<string>(getUserDateTime(
        timezone, 
        localTimeState, 
        localDateState, 
        localTimezone
      ).time);
  const [ userDateState, setUserDateState ] = React.useState<string>(getUserDateTime(
        timezone, 
        localTimeState, 
        localDateState, 
        localTimezone
      ).date);


  React.useEffect(() => {
    setSelectedTimezone(getDefaultTimezoneObject(timezone));
    // console.log("🚀 ~ file: Entry.component.tsx ~ line 102 ~ React.useEffect ~ timezone", timezone)
    // console.log(defaultValue);
  }, [timezone]);
  React.useEffect(()=>{
    setLocalTimeState(localTime);
    // console.log("🚀 ~ file: Entry.component.tsx ~ line 118 ~ React.useEffect ~ timezone", timezone)
    // console.log("🚀 ~ file: Entry.component.tsx ~ line 117 ~ React.useEffect ~ localTime", localTime);
    // console.log("🚀 ~ file: Entry.component.tsx ~ line 118 ~ React.useEffect ~ localDate", localDate)
    // console.log("🚀 ~ file: Entry.component.tsx ~ line 118 ~ React.useEffect ~ localTimezone", localTimezone)
    const _tempUserDateTime = getUserDateTime(
        timezone, 
        localTime, 
        localDate, 
        localTimezone
      );
    setUserTimeState(_tempUserDateTime.time);
    // console.log("🚀 ~ file: Entry.component.tsx ~ line 95 ~ _tempUserDateTime.time", _tempUserDateTime.time)
    // NOTE: keep timezone to update component when timezone updates
  }, [localDateState, localTime, localDate, localTimeState, localTimezone, timezone]);
  React.useEffect(()=>{
    setLocalDateState(localDate);
    // console.log("🚀 ~ file: Entry.component.tsx ~ line 123 ~ React.useEffect ~ localDate", localDate)
    const _tempUserDateTime = getUserDateTime(
        timezone, 
        localTime, 
        localDate, 
        localTimezone
      );
    setUserDateState(_tempUserDateTime.date);
    // DONE: localdate is not passing in
    // console.log("🚀 ~ file: Entry.component.tsx ~ line 123 ~ _tempUserDateTime.time", _tempUserDateTime.date);
    // NOTE: keep timezone to update component when timezone updates
  }, [localDate, localDateState, localTime, localTimeState, localTimezone, timezone]);

  const userTime = (militaryTime = false) => {

    const _time = getUserDateTime(
      selectedTimezone.label,
      localTimeState, 
      localDateState, 
      localTimezone,
      militaryTime
    ).time;
    // console.dir(_time);
    return _time;
  };

  // DONE: 2: click on name to edit name
  const userNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameState(e.target.value);
    updateUserName(e.target.value);
  };

  return (
    <Styled.Container>
      <Styled.Header  bg={color.background} txtColor={color.nightText}>
        <div className="single_user_timezone_holder">
          <input className="single_user_timezone_name" value={userNameState} onChange={userNameChangeHandler}/>
          <TimezonePicker 
            placeHolder={selectedTimezone.label}  
            className="single_user_timezone_picker" 
            setSelectedTimezone={updateUser}
            defaultValue={selectedTimezone}
          />
        </div>
        <div>{userTime(false)}</div>
      </Styled.Header>
      <Timeline 
        timezone={selectedTimezone.label}
        localTimezone={localTimezone}
        time = {userTimeState}
        date = {userDateState}
        militaryFormat = {militaryFormat}
        elementWidth = {elementWidth}
        />
      <Styled.Footer  bg={color.background} txtColor={color.nightText}>
      </Styled.Footer>
    </Styled.Container>
  );
}

export default Entry;