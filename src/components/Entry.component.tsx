import React from 'react';
import spacetime from 'spacetime';
import TimezonePicker, { Timezone } from './TimezonePicker.component';

import defaultColor from '../settings/color.settings';

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
  time: string;
  date: string;
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
  time = '19:38', 
  date = '1-8-2021', 
  sunriseTime = '6:00', 
  sunsetTime = '18:00', 
  militaryFormat = true,
  color = defaultColor,
  elementWidth = 50
}) => {

  const [ selectedTimezone,setSelectedTimezone ] = React.useState<Timezone>({id: 0, value: '(GMT-05:00) Eastern Time', label: 'America/New_York'});
  // NOTE: setState here probably is not a perfect solution, context api should be good to solve this
  // Is it really necessary to hold a overall timezone data in homepage component
  // Only change the state in individual Entry, this could save time and simplify the logic
  
  const getTimezone = () => {
    return selectedTimezone.label;
  };

  const getUserDateTime = (userTimezone: string, localTime: string, localDate: string,localTimezone: string) => {

    const d = spacetime(localDate, localTimezone);
    d.time(localTime);
    d.goto(userTimezone);
    return {
      date: `${d.month()+1}-${d.date()}-${d.year()}`,
      time: `${d.hour()}:${d.minute()}`
    };
  };

  const setDateTimeFormat = () => {
    const localDateTimeState = new Date();
    // TODO: is it a good practice to hold a local state instead of everything in the parent node
    //FIXME: d.toLocaleString('en-US', { timeZone: 'America/New_York' })

    const _date = localDateTimeState.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' });
    const _time = localDateTimeState.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    console.dir(_date);
    console.dir(_time);
  };

  const getTime = () => {
    return time;
  };
  const getDate = () => {
    return date;
  };

  return (
    <Styled.Container>
      <Styled.Header  bg={color.background} txtColor={color.nightText}>
        <div className="single_user_timezone_holder">
          <span className="single_user_timezone_name">{name}</span>
          <TimezonePicker placeHolder={selectedTimezone.label}  className="single_user_timezone_picker" setSelectedTimezone={setSelectedTimezone}/>
        </div>
        <div>{time}</div>
      </Styled.Header>
      <Timeline 
        timezone={selectedTimezone.label}
        time = {getTime()}
        date = {getDate()}
        militaryFormat = {militaryFormat}
        elementWidth = {elementWidth}
        />
      <Styled.Footer  bg={color.background} txtColor={color.nightText}>
      </Styled.Footer>
    </Styled.Container>
  );
}

export default Entry;