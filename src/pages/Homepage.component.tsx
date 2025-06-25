'use client';
import React from 'react';
// import spacetime from 'spacetime';
import DatePicker from "react-datepicker";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import "react-datepicker/dist/react-datepicker.css";

import defaultColor from '../settings/color.settings';
import Entry from '../components/Entry.component';
import getCurrentDateTimeInFormat from '../lib/getCurrentDateTimeInFormat';
import useLocalStorage from '../lib/useLocalStorageHook';
import getClientTimezone from '../lib/getClientTimezone';

import '../style/Homepage.style.scss';

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

  const defaultTimezoneInitValue = getClientTimezone();

  const [usersState, setUsersState] = React.useState(users);
  const [localDateTimeState, setLocalDateTimeState] = React.useState(new Date());
  const [defaultTimezoneState, setDefaultTimezoneState] = React.useState(defaultTimezoneInitValue);
  // DONE: this init defaultTimezone needs to match user's timezone
  // const [ timeState, setTimeState ] = React.useState(getCurrentDateTimeInFormat().time);
  // const [ dateState, setDateState ] = React.useState(getCurrentDateTimeInFormat().date);
  const [dateTimeState, setDateTimeState] = React.useState({
    time: getCurrentDateTimeInFormat().time,
    date: getCurrentDateTimeInFormat().date,
  });
  const [usersLocalStorage, setUsersLocalStorage] = useLocalStorage<User[]>('users', users);

  // DONE: add support for mobile devices
  // DONE: publish project
  // TODO: add live sunset sunrise time
  // ... or calculate the sunrise sunset approximately

  React.useEffect(() => {
    // DONE: when init, check local storage for users data first; 
    const savedUsers = usersLocalStorage;
    setUsersState(savedUsers);
    // console.dir(savedUsers);
  }, []);

  const addPersonClickHandler = () => {
    // DONE: get NewYork local time as default value for new users.
    // const spaceTimeNowInNewYork = spacetime.now(defaultTimezoneState);
    // const timeNowInNewYork = spaceTimeNowInNewYork.hour() + ':' + spaceTimeNowInNewYork.minute() ;
    // const dateNowInNewYork = ( spaceTimeNowInNewYork.month() + 1 ) + '-' + spaceTimeNowInNewYork.date() + '-' + spaceTimeNowInNewYork.year();
    const newUsersState = [...usersState, { id: usersState.length, name: 'New User', timezone: defaultTimezoneState }];

    setUsersState(newUsersState);
  };

  React.useEffect(() => {
    // process timezone for usersState
    // const _date = localDateTimeState.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });
    // const _time = localDateTimeState.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const { date, time } = getCurrentDateTimeInFormat(defaultTimezoneState, localDateTimeState);
    // console.log("🚀 ~ file: Homepage.component.tsx ~ line 58 ~ React.useEffect ~ time", time)
    // console.log("🚀 ~ file: Homepage.component.tsx ~ line 58 ~ React.useEffect ~ date", date)
    // setTimeState(time);
    // setDateState(date);
    setDateTimeState({ time, date })

    // DONE: next step is to make local Date and local time affect all users

  }, [localDateTimeState]);

  const updateUser = (id: number, newTimezone: string) => {
    // update usersState
    let _users = [...usersState];
    let user = { ..._users[id] }
    user.timezone = newTimezone;
    _users[id] = user;
    setUsersState(_users);
    setUsersLocalStorage(_users);
    // console.log("🚀 ~ file: Homepage.component.tsx ~ line 74 ~ updateUser ~ users", users)
  };

  const updateUserName = (id: number, newUsername: string) => {
    // update currentUserName
    let _users = [...usersState];
    let user = { ..._users[id] }
    user.name = newUsername;
    _users[id] = user;
    setUsersState(_users);
    setUsersLocalStorage(_users);
    // console.log("🚀 ~ file: Homepage.component.tsx ~ line 89 ~ updateUserName ~ users", users)
  };

  //DONE: functions that will pass down to child components to updated userName
  // time could only be changed in local format 

  // DONE: get all changes into on object, save to localStorage
  // DONE: add a reset button
  const clearLocalStorage = () => {
    setUsersLocalStorage(users);
    setUsersState(users);
  };
  const reset = () => {
    confirmAlert({
      title: 'Confirm to DELETE all data',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => { clearLocalStorage() }
        },
        {
          label: 'No',
          onClick: () => { console.log('Deletion Abort!') }
        }
      ]
    });
  };

  return (
    <div className='container' style={{ backgroundColor: color.background }}>
      <div className="nav">
        <div className="logo"></div>
        <div className="menu_container">
          <div className="menu_item" onClick={reset}>Reset</div>
        </div>
      </div>
      <div className="local_time" style={{ color: color.white, backgroundColor: color.background }}>
        <div className="title input_div">Local Time</div>

        <DatePicker
          showTimeSelect
          selected={localDateTimeState}
          dateFormat="MMMM d, yyyy h:mm aa"
          onChange={(date: Date | null) => setLocalDateTimeState(date || new Date())}
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
            updateUser={(newTimezone: string) => {
              updateUser(user.id, newTimezone);
            }}
            updateUserName={(newUsername: string) => {
              updateUserName(user.id, newUsername);
            }}
            name={user.name}
            timezone={user.timezone}
            localTimezone={defaultTimezoneState}
            localTime={dateTimeState.time}
            localDate={dateTimeState.date}
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