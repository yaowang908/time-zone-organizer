'use client';
import React from 'react';
import TimezonePicker, { Timezone } from './TimezonePicker.component';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';

import defaultColor from '../settings/color.settings';
import defaultTimezones from '../data/timezones';
import getUserDateTime from '../lib/getUserDateTime';

import Timeline from './Timeline.component';

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
  localTime: string;
  localDate: string;
  updateUser: (newTimezone: string) => void;
  updateUserName: (newUsername: string) => void;
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
  name = 'New User',
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
  elementWidth = 75
}) => {

  const getDefaultTimezoneObject = (timezone: string) => {
    const newArray = defaultTimezones.filter(el => { return el.label === timezone });
    if (newArray.length >= 1) {
      return newArray[0];
    }
    return { id: 12, value: "(GMT-05:00) Eastern Time", label: "America/New_York" };
  };

  const [selectedTimezone, setSelectedTimezone] = React.useState<Timezone>(getDefaultTimezoneObject(timezone));
  const [userNameState, setUserNameState] = React.useState<string>(name);
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

  React.useEffect(() => {
    setLocalTimeState(localTime);
    const _tempUserDateTime = getUserDateTime(
      timezone,
      localTime,
      localDate,
      localTimezone
    );
    setUserTimeState(_tempUserDateTime.time);
  }, [localDateState, localTime, localDate, localTimeState, localTimezone, timezone]);

  React.useEffect(() => {
    setLocalDateState(localDate);
    const _tempUserDateTime = getUserDateTime(
      timezone,
      localTime,
      localDate,
      localTimezone
    );
    setUserDateState(_tempUserDateTime.date);
  }, [localDate, localDateState, localTime, localTimeState, localTimezone, timezone]);

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

  return (
    <Card className="w-full mb-4 border-0 shadow-lg" style={{ backgroundColor: color.background }}>
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <Input
              value={userNameState}
              onChange={userNameChangeHandler}
              className="border-0 bg-transparent text-white placeholder:text-white/70 focus:ring-0 text-lg font-medium"
              placeholder="Enter name"
            />
            <TimezonePicker
              placeHolder={selectedTimezone.label}
              className="w-64 border-0 bg-transparent text-white"
              setSelectedTimezone={updateUser}
              defaultValue={selectedTimezone}
            />
          </div>
          <div className="text-2xl font-bold text-white">
            {userTime(false)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Timeline
          timezone={selectedTimezone.label}
          localTimezone={localTimezone}
          time={userTimeState}
          date={userDateState}
          militaryFormat={militaryFormat}
          elementWidth={elementWidth}
        />
      </CardContent>
    </Card>
  );
}

export default Entry;