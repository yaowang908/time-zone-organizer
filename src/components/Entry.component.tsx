'use client';
import React from 'react';
import TimezonePicker, { Timezone } from './TimezonePicker.component';
import { Input } from './ui/input';

import defaultTimezones from '../data/timezones';
import getUserDateTime from '../lib/getUserDateTime';
import { getFormattedDate } from '../lib/getFormattedDate';

import Timeline from './Timeline.component';

export interface Props {
  id: number;
  name: string;
  role?: string;
  timezone: string;
  localTimezone: string;
  localTime: string;
  localDate: string;
  updateUser: (newTimezone: string) => void;
  updateUserName: (newUsername: string) => void;
  updateUserRole?: (newRole: string) => void;
  deleteUser: () => void;
  isFirst?: boolean;
  sunriseTime?: string;
  sunsetTime?: string;
  militaryFormat?: boolean;
  elementWidth?: number;
}

const Entry: React.FC<Props> = ({
  id,
  name = 'New User',
  role = '',
  timezone = 'America/New_York',
  localTimezone = 'America/New_York',
  localTime,
  localDate,
  sunriseTime = '6:00',
  sunsetTime = '18:00',
  updateUser,
  updateUserName,
  updateUserRole,
  deleteUser,
  isFirst = false,
  militaryFormat = false,
  elementWidth = 75
}) => {

  const getDefaultTimezoneObject = (timezone: string) => {
    const newArray = defaultTimezones.filter(el => { return el.label === timezone });
    if (newArray.length >= 1) {
      return newArray[0];
    }
    return { id: 27, value: "(GMT-05:00) New York, USA", label: "America/New_York" };
  };

  const [selectedTimezone, setSelectedTimezone] = React.useState<Timezone>(getDefaultTimezoneObject(timezone));
  const [userNameState, setUserNameState] = React.useState<string>(name);
  const [userRoleState, setUserRoleState] = React.useState<string>(role || '');
  const [localTimeState, setLocalTimeState] = React.useState(localTime);
  const [localDateState, setLocalDateState] = React.useState(localDate);
  const [userTimeState, setUserTimeState] = React.useState<string>(getUserDateTime(
    timezone,
    localTimeState,
    localDateState,
    localTimezone
  ).time);
  const [userDateState, setUserDateState] = React.useState<string>(getUserDateTime(
    timezone,
    localTimeState,
    localDateState,
    localTimezone
  ).date);

  React.useEffect(() => {
    setSelectedTimezone(getDefaultTimezoneObject(timezone));
  }, [timezone]);

  // Update time when local time/date or timezone changes
  React.useEffect(() => {
    setLocalTimeState(localTime);
    setLocalDateState(localDate);
    const _tempUserDateTime = getUserDateTime(
      selectedTimezone.label,
      localTime,
      localDate,
      localTimezone
    );
    setUserTimeState(_tempUserDateTime.time);
    setUserDateState(_tempUserDateTime.date);
  }, [localTime, localDate, localTimezone, selectedTimezone.label]);

  const userTime = (militaryTime = false) => {
    const _time = getUserDateTime(
      selectedTimezone.label,
      localTimeState,
      localDateState,
      localTimezone,
      militaryTime
    ).time;
    return _time;
  };

  const userNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameState(e.target.value);
    updateUserName(e.target.value);
  };

  const userRoleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserRoleState(e.target.value);
    if (updateUserRole) {
      updateUserRole(e.target.value);
    }
  };

  // Format time for display (e.g., "8:37 pm")
  const formatDisplayTime = (time: string) => {
    const timeStr = userTime(false);
    const [timePart, period] = timeStr.split(' ');
    return { time: timePart, period: period?.toLowerCase() || '' };
  };

  // Check if user date is tomorrow relative to local date
  const isTomorrow = () => {
    try {
      const [localMonth, localDay, localYear] = localDate.split('-').map(Number);
      const [userMonth, userDay, userYear] = userDateState.split('-').map(Number);

      const localDateObj = new Date(localYear, localMonth - 1, localDay);
      const userDateObj = new Date(userYear, userMonth - 1, userDay);

      const diffTime = userDateObj.getTime() - localDateObj.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays === 1;
    } catch {
      return false;
    }
  };

  // Get avatar color based on name
  const getAvatarColor = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    if (firstLetter === 'Y') {
      return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30';
    } else if (firstLetter === 'I') {
      return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
    }
    return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  };

  const displayTime = formatDisplayTime(userTime(false));
  const showTomorrow = isTomorrow();

  return (
    <div className="relative pr-12 group">
      {/* Padding area on the right to keep delete button visible when hovering */}
      <div className="absolute top-0 right-0 w-12 h-full z-0 pointer-events-auto" />

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-soft border border-slate-200 dark:border-slate-700 relative overflow-visible hover:shadow-lg transition-shadow">
        {/* Delete Button - Hidden for first entry, floats out to the right on hover */}
        {!isFirst && (
          <button
            onClick={deleteUser}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-right-10 z-10 flex items-center justify-center"
            aria-label="Delete entry"
          >
            <span className="material-icons-outlined text-[18px]">close</span>
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getAvatarColor(userNameState)}`}>
              {userNameState.charAt(0).toUpperCase()}
            </div>
            <div>
              <Input
                value={userNameState}
                onChange={userNameChangeHandler}
                onFocus={(e) => e.target.select()}
                className="border-0 bg-transparent p-0 h-auto text-lg font-bold text-slate-800 dark:text-white leading-tight focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Name"
              />
              <Input
                value={userRoleState}
                onChange={userRoleChangeHandler}
                onFocus={(e) => e.target.select()}
                className="border-0 bg-transparent p-0 h-auto text-xs text-slate-500 dark:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Role"
              />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="material-icons-outlined text-[14px]">public</span>
              <TimezonePicker
                placeHolder={selectedTimezone.value}
                className="w-80 border-0 bg-transparent text-slate-500 dark:text-slate-400 p-0 h-auto text-xs"
                setSelectedTimezone={updateUser}
                defaultValue={selectedTimezone}
              />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {displayTime.time}
              <span className="text-base font-normal text-slate-500 ml-1">{displayTime.period}</span>
              {showTomorrow && (
                <span className="text-[10px] uppercase text-emerald-500 border border-emerald-500 px-1 rounded ml-1">Tmrw</span>
              )}
            </div>
          </div>
        </div>
        <Timeline
          timezone={selectedTimezone.label}
          localTimezone={localTimezone}
          time={userTimeState}
          date={userDateState}
          militaryFormat={militaryFormat}
          elementWidth={elementWidth}
        />
      </div>
    </div>
  );
}

export default Entry;