import React from 'react';
import defaultColor from '../settings/color.settings';
import hoursFormat from '../settings/hours.setting';

import { Styled } from './Timeline.style';

/**
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
 */

export interface Props {
  timezone: string;
  time: string;
  date: string;
  sunriseTime?: string;
  sunsetTime?: string;
  militaryFormat?: boolean;
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

const Timeline: React.FC<Props> = ({
    timezone, 
    time, 
    date, 
    sunriseTime = '18:00', 
    sunsetTime = '6:00', 
    militaryFormat = true,
    color = defaultColor
}) => {
  let hoursArr:string[];
  hoursArr = hoursFormat.military;
  if (!militaryFormat) hoursArr = hoursFormat.normal; 

  return (
    <Styled.Container bg={color.background} txtColor={color.nightText}>
      <Styled.Holder>
        {
          hoursArr.map((x, index) => {
            return <div key={index}>{x}</div>
          })
        }
      </Styled.Holder>
    </Styled.Container>
  )
}

export default Timeline;