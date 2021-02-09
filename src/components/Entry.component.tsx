import React from 'react';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';

import defaultColor from '../settings/color.settings';

import Timeline from './Timeline.component';
import { Styled } from './Entry.style'; 

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
  timezone = 'america/New_York', 
  time = '19:38', 
  date = '1-8-2021', 
  sunriseTime = '6:00', 
  sunsetTime = '18:00', 
  militaryFormat = true,
  color = defaultColor,
  elementWidth = 50
}) => {

  const timezoneTextStyle = () => {
    return {
      'color': '#4B67AD',
      'fontSize':'0.8em',
      'marginLeft': '1em',
    }
  }

  const handleTimezoneChange = (timezone: string) => {
    console.dir(timezone);
  }

  return (
    <Styled.Container>
      <Styled.Header  bg={color.background} txtColor={color.nightText}>
        <div>
          <span>{name}</span>
          <span style={timezoneTextStyle()}>
            {/* TODO: need to style this timezone value or create my own */}
            {/* TODO: if you decided to build you own remember to remove this timezone picker and react-bootstrap and bootstrap */}
            <TimezonePicker
              absolute      = {false}
              defaultValue  = "America/New_York"
              placeholder   = "Select timezone..."
              onChange      = {handleTimezoneChange}
            />
          </span>
        </div>
        <div>{time}</div>
      </Styled.Header>
      <Timeline 
        timezone={timezone}
        time = {time}
        date = {date}
        militaryFormat = {militaryFormat}
        elementWidth = {elementWidth}
        />
      <Styled.Footer  bg={color.background} txtColor={color.nightText}>
      </Styled.Footer>
    </Styled.Container>
  );
}

export default Entry;