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

  const [hoursArr, setHoursArr] = React.useState<string[]>([]);
  const [curHour, setCurHour] = React.useState<string>('0');
  const [curMin, setCurMin] = React.useState<string>('0');
  const [eleWidth, setEleWidth] = React.useState<number>(75);

  React.useEffect(() => {
    const cur = time.split(':');
    const [_curHour, _curMin ]= cur;
    setCurHour(_curHour);
    setCurMin(_curMin);
  }, [time]);

  React.useEffect(() => {
    let tempHoursArr = hoursFormat.normal;
    if (!militaryFormat) tempHoursArr = hoursFormat.military;
    const prevArr = tempHoursArr.slice(0, Number(curHour) + 1);
    const nextArr = tempHoursArr.slice(Number(curHour) + 1, hoursArr.length);
    const baseArr = [...nextArr, ...prevArr, ...nextArr, ...prevArr];
    // console.dir(1);
    setHoursArr(baseArr);
  }, [militaryFormat, hoursArr.length, curHour]);

  const holderCallbackRef = (ele: (HTMLDivElement | null)) => {
      if (ele) {
        // set cur hour in middle
        //TODO: min not showing in correct position, 11:15
        const marginSetByMin = ( Number(curMin) / 60 ) * eleWidth; 
        ele.scrollLeft = (ele.scrollWidth / 2) - (ele.clientWidth / 2) - (eleWidth / 2) + marginSetByMin;
      }
  };

  return (
    <Styled.Container bg={color.background} txtColor={color.nightText}>
      <Styled.Holder elementWidth={eleWidth} ref={holderCallbackRef} isScrollEnabled={false}>
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