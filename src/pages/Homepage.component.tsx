import React from 'react';
import spacetime from 'spacetime';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import defaultColor from '../settings/color.settings';
import Entry from '../components/Entry.component';
import getCurrentDateTimeInFormat from '../lib/getCurrentDateTimeInFormat';

import './Homepage.style.scss';

interface User {
  id: number; 
  name: string; 
  timezone: string;
};
export interface Props {
  users: User[];
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

const Homepage: React.FC<Props> = ({ users, color = defaultColor, elementWidth = 50 }) => {

  const [ usersState, setUsersState ] = React.useState(users);
  const [ localDateTimeState, setLocalDateTimeState ] = React.useState(new Date());
  const [ defaultTimezoneState, setDefaultTimezoneState ] = React.useState('America/New_York');
  // TODO: this init defaultTimezone needs to match user's timezone
  const [ timeState, setTimeState ] = React.useState(getCurrentDateTimeInFormat().time);
  const [ dateState, setDateState ] = React.useState(getCurrentDateTimeInFormat().date);

  const addPersonClickHandler = () => {
    // DONE: get NewYork local time as default value for new users.
    const spaceTimeNowInNewYork = spacetime.now(defaultTimezoneState);
    const timeNowInNewYork = spaceTimeNowInNewYork.hour() + ':' + spaceTimeNowInNewYork.minute() ;
    const dateNowInNewYork = ( spaceTimeNowInNewYork.month() + 1 ) + '-' + spaceTimeNowInNewYork.date() + '-' + spaceTimeNowInNewYork.year();
    const newUsersState = [...usersState, {id: usersState.length,name: 'New User', timezone: defaultTimezoneState}];
    
    setUsersState(newUsersState);
  };

  React.useEffect(() => {
    // process timezone for usersState
    // const _date = localDateTimeState.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });
    // const _time = localDateTimeState.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const {date, time} = getCurrentDateTimeInFormat(defaultTimezoneState, localDateTimeState);
    console.log("🚀 ~ file: Homepage.component.tsx ~ line 58 ~ React.useEffect ~ time", time)
    console.log("🚀 ~ file: Homepage.component.tsx ~ line 58 ~ React.useEffect ~ date", date)
    setTimeState(time);
    setDateState(date);

    // TODO: next step is to make local Date and local time affect all users
    // steps 1. datePicker onchange setTime setDate

  }, [localDateTimeState]);

  const updateUser = (id:number, newTimezone:string) => {
    // update usersState
    let users = [...usersState];
    let user = {...users[id]}
    user.timezone = newTimezone;
    users[id] = user;
    setUsersState(users);
    // console.log("🚀 ~ file: Homepage.component.tsx ~ line 74 ~ updateUser ~ users", users)
  };

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
      </div>
      <div className="local_time" style={{color:color.white,backgroundColor: color.background}}>
        <div className="title input_div">Local Time</div>
        
        <DatePicker 
          showTimeSelect
          selected={localDateTimeState}
          dateFormat="MMMM d, yyyy h:mm aa"
          onChange={(date: Date) => setLocalDateTimeState(date)}  
        />
        {/* NOTE: local time change on real time */}
        {/* after a second thought, I don't think it's good idea to update it per minute, this app is not really time sensitive after all */}
        <div className="triangle"></div>
      </div>
      <div className="indicator"></div>
      <div className="content">
        {usersState ? usersState.map((user, index) => (
          <Entry 
            key={index}
            updateUser={ (newTimezone:string) => {
              updateUser(user.id, newTimezone);
            }}
            name={user.name} 
            timezone={user.timezone}
            localTimezone={defaultTimezoneState}
            localTime={timeState}
            localDate={dateState}
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