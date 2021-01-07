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
    sunriseTime = '6:00', 
    sunsetTime = '18:00', 
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
        const marginSetByMin = ( Number(curMin) / 60 ) * eleWidth; 
        ele.scrollLeft = (ele.scrollWidth / 2) - (ele.clientWidth / 2) - (eleWidth / 2) + marginSetByMin;
      }
  };

  const setBackgroundColor = (t:string) => {
    const getTimeWhenUsingMilitaryFormat = (_time:string) => {
      // console.dir(_time);
      // console.dir(hoursFormat.normal.indexOf(_time));
      return hoursFormat.normal.indexOf(_time);
    };
    const getTime = (_time:string) => {
      if(!militaryFormat) return Number(_time);
      return getTimeWhenUsingMilitaryFormat(_time);
    };
    const thisTime:number = getTime(t);
    const type = {
      night: 'NIGHT',
      dawn: 'DAWN',
      day: 'DAY',
      dusk: 'DUSK',
    }
    // sunriseTime = '18:00', 
    // sunsetTime = '6:00', 
    const sunriseHour = Number(sunriseTime.split(':')[0]);
    const sunsetHour = Number(sunsetTime.split(':')[0]);
    let thisType = type.night;
    if (thisTime < sunriseHour) thisType = type.night;
    if (thisTime > sunriseHour && thisTime < sunsetHour ) thisType = type.day;
    if (thisTime > sunsetHour) thisType = type.night;
    if (thisTime === sunriseHour) thisType = type.dawn;
    if (thisTime === sunsetHour) thisType = type.dusk;

    switch (thisType) {
      case type.night:
        return {'backgroundColor': defaultColor.night};
      case type.dawn:
        return {'backgroundImage': `linear-gradient( 90deg, ${defaultColor.night} 13%, ${defaultColor.day} 86%)`, 'color': defaultColor.white };
      case type.day:
        return {'backgroundColor': defaultColor.day};
      case type.dusk:
        return {'backgroundImage': `linear-gradient( 90deg, ${defaultColor.day} 13%, ${defaultColor.night} 86%)`, 'color': defaultColor.white };
      default:
        return {'backgroundColor': defaultColor.night};
    }

    
  }

  return (
    <Styled.Container bg={color.background} txtColor={color.nightText}>
      <Styled.Holder elementWidth={eleWidth} ref={holderCallbackRef} isScrollEnabled={false}>
        {
          hoursArr.map((x, index) => {
            return <div key={index} style={setBackgroundColor(x)}>{x}</div>
          })
        }
      </Styled.Holder>
    </Styled.Container>
  )
}

export default Timeline;