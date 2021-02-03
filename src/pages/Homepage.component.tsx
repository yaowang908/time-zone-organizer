import React from 'react';
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
  }
};

const Homepage: React.FC<Props> = ({ time, date, users, color = defaultColor }) => {


  return (
    <div className='container' style={{backgroundColor: color.background}}>
      <div className="nav">
        <div className="logo"></div>
        <div className="menu_container">
          <div className="menu_item" style={{color:color.white}}>New</div>
          <div className="menu_item" style={{color:color.white}}>Import</div>
        </div>
      </div>
      <div className="local_time" style={{color:color.white,backgroundColor: color.background}}>
        <div className="title">Local Time</div>
        <div className="time">{time}</div>
        <div className="date">{date}</div>
        <div className="triangle"></div>
      </div>
      <div className="indicator"></div>
      <div className="content">
        {users ? users.map((user, index) => (
          <Entry 
            key={index}
            name={user.name} 
            timezone={user.timezone}
            time={user.time}
            date={user.date}
            militaryFormat={false}
            />
        )) : ''}
      </div>
    </div>
  );
};

export default Homepage;