import React from 'react';
import spacetime from 'spacetime';

import defaultColor from '../settings/color.settings';
import Entry from '../components/Entry.component';

import './Homepage.style.scss';

export interface Props {
  time: string;
  date: string;
  users: {name: string; time: string; date: string; timezone: string;}[];
  color?: {
    night?: string;
    day?: string;
    nightText?: string;
    dayText?: string;
    background?: string;
    textLighter?: string;
    textDarker?: string;
    white?: string;
  };
  elementWidth?: number;
};

const Homepage: React.FC<Props> = ({ time, date, users, color = defaultColor, elementWidth = 50 }) => {

  const [ usersState, setUsersState ] = React.useState(users);
  const [ localTimeState, setLocalTimeState ] = React.useState(time);
  const [ localDateState, setLocalDateState ] = React.useState(date);
  const defaultTimezone = 'America/New_York';

  const addPersonClickHandler = () => {
    // DONE: get NewYork local time as default value for new users.
    const spaceTimeNowInNewYork = spacetime.now(defaultTimezone);
    const timeNowInNewYork = spaceTimeNowInNewYork.hour() + ':' + spaceTimeNowInNewYork.minute() ;
    const dateNowInNewYork = ( spaceTimeNowInNewYork.month() + 1 ) + '-' + spaceTimeNowInNewYork.date() + '-' + spaceTimeNowInNewYork.year();
    const newUsersState = [...usersState, {name: 'New User', time: timeNowInNewYork, date: dateNowInNewYork, timezone: defaultTimezone}];
    setUsersState(newUsersState);
  };

  //TODO: get correct time and date for every user
  //
  const getUserDateTime = (userTimezone: string, localTime: string, localDate: string,localTimezone: string) => {

    const d = spacetime(localDate, localTimezone);
    d.time(localTime);
    d.goto(userTimezone);
    return {
      date: `${d.month()+1}-${d.date()}-${d.year()}`,
      time: `${d.hour()}:${d.minute()}`
    };
  };

  const dateFormatter = () => {
    // scenarios
    // 1. 2-3-2021
    // 2. February 3, 2021
    // 3. or maybe find a library to format all possible date format

    // this is for spacetime library to work
    // so the return format is going to be February 3, 2021
    return '';
  };

  const timeFormatter = () => {
    // scenarios
    // 1. 16:20
    // 2. 4:20pm
    // 3. or maybe find a library to format all possible date format

    // this is for spacetime library to work
    // so the return format is going to be 4:20pm
    return '';
  };

  React.useEffect(() => {
    // https://stackoverflow.com/questions/53715465/can-i-set-state-inside-a-useeffect-hook

  }, [localTimeState, localDateState]);

  // TODO: add a way to change date
  // thoughts: to make content editable, there are two ways
  // 1. NOTE:input field, disabled when not focused
  // 2. div field, contenteditable when clicked
  const changeLocalDate = (e: React.FocusEvent<HTMLInputElement>) => {
    setLocalDateState(e.target.value);
    console.log(e.target);
  };
  const localDateEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setLocalDateState((e.target as HTMLInputElement).value);
      (e.target as HTMLInputElement).blur();
      // console.dir((e.target as HTMLInputElement).value);
    }
  };
  const changeLocalTime = (e: React.FocusEvent<HTMLInputElement>) => {
    setLocalTimeState(e.target.value);
  };
  const localTimeEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setLocalTimeState((e.target as HTMLInputElement).value);
      (e.target as HTMLInputElement).blur();
    }
  };
  // TODO: next step is to make local Date and local time affect all users

  //TODO: functions that will pass down to child components to updated userName, timezone, time
  const changeUserName = () => {};
  const changeUserTimezone = () => {};
  const changeUserTime = () => {
    //TODO: user time will affect the whole app
    //use context api to avoid unnecessary child components update
  };

  return (
    <div className='container' style={{backgroundColor: color.background}}>
      <div className="nav">
        <div className="logo"></div>
        <div className="menu_container">
          <div className="menu_item" style={{color:color.white}} onClick={addPersonClickHandler}>New</div>
          <div className="menu_item" style={{color:color.white}}>Import</div>
        </div>
      </div>
      <div className="local_time" style={{color:color.white,backgroundColor: color.background}}>
        <div className="title input_div">Local Time</div>
        <input className="time input_div" 
          value={localTimeState} 
          style={{color:color.white,backgroundColor: color.background}}
          onChange={changeLocalTime}
          onBlur={changeLocalTime}
          onKeyDown={localTimeEnterHandler}
        />
        <input className="date input_div" 
          value={localDateState} 
          style={{color:color.white,backgroundColor: color.background}}
          onChange={changeLocalDate}
          onBlur={changeLocalDate}
          onKeyDown={localDateEnterHandler}
        />
        <div className="triangle"></div>
      </div>
      <div className="indicator"></div>
      <div className="content">
        {usersState ? usersState.map((user, index) => (
          <Entry 
            key={index}
            name={user.name} 
            timezone={user.timezone}
            time={user.time}
            date={user.date}
            militaryFormat={false}
            elementWidth={elementWidth}
            />
        )) : ''}
      </div>
      <div className="footer">
        <div className="add_person" onClick={addPersonClickHandler}>
          <div className="cross"></div>
          <div className="cross_title">add person</div>          
        </div>
      </div>
    </div>
  );
};

export default Homepage;