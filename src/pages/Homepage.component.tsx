import React from 'react';
import spacetime from 'spacetime';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
  const [ localDateTimeState, setLocalDateTimeState ] = React.useState(new Date());
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

  React.useEffect(() => {
    // process timezone for usersState
    const _date = localDateTimeState.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });
    const _time = localDateTimeState.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    console.dir(_date);
    console.dir(_time);
    
  }, [localDateTimeState]);

  const dateFormatter = (date:string) => {
    // input format February 8, 2021
    
    // this is for spacetime library to work
    // so the return format is going to be February 3, 2021
    return date;
  };

  const timeFormatter = (time:string) => {
    // input format 08:50 PM
    const _time = time.replace(/^0+/, '').split(' ').join('');
    // this is for spacetime library to work
    // so the return format is going to be 4:20pm
    return _time;
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
        
        <DatePicker 
          showTimeSelect
          selected={localDateTimeState}
          dateFormat="MMMM d, yyyy h:mm aa"
          onChange={(date: Date) => setLocalDateTimeState(date)}  
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