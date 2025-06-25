'use client';
import React from 'react';
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
  const [dateTimeState, setDateTimeState] = React.useState({
    time: getCurrentDateTimeInFormat().time,
    date: getCurrentDateTimeInFormat().date,
  });
  const [usersLocalStorage, setUsersLocalStorage] = useLocalStorage<User[]>('users', users);

  React.useEffect(() => {
    const savedUsers = usersLocalStorage;
    setUsersState(savedUsers);
  }, []);

  const addPersonClickHandler = () => {
    const newUsersState = [...usersState, { id: usersState.length, name: 'New User', timezone: defaultTimezoneState }];
    setUsersState(newUsersState);
  };

  React.useEffect(() => {
    const { date, time } = getCurrentDateTimeInFormat(defaultTimezoneState, localDateTimeState);
    setDateTimeState({ time, date })
  }, [localDateTimeState]);

  const updateUser = (id: number, newTimezone: string) => {
    let _users = [...usersState];
    let user = { ..._users[id] }
    user.timezone = newTimezone;
    _users[id] = user;
    setUsersState(_users);
    setUsersLocalStorage(_users);
  };

  const updateUserName = (id: number, newUsername: string) => {
    let _users = [...usersState];
    let user = { ..._users[id] }
    user.name = newUsername;
    _users[id] = user;
    setUsersState(_users);
    setUsersLocalStorage(_users);
  };

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