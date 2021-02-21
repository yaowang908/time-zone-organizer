import React from 'react';

import defaultColor from '../settings/color.settings';
import hoursFormat from '../settings/hours.setting';

import { getFormattedDate } from '../lib/getFormattedDate';

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
 * @param { number } elementWidth - number of the element width in px
 */

export interface Props {
  timezone: string;
  localTimezone: string;
  time: string;
  date: string;
  elementWidth?: number;
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
    localTimezone,
    time, 
    date,
    elementWidth, 
    sunriseTime = '6:00', 
    sunsetTime = '18:00', 
    militaryFormat = true,
    color = defaultColor
}) => {
  
  const [ userTimeState, setLocalTimeState ] = React.useState(time);
  const [ userDateState, setLocalDateState ] = React.useState(date);

  // const getUserTime = () => {
  //   // timezone, time, date, localTimezone
  //   return getUserDateTime(
  //       timezone, 
  //       localTimeState,
  //       localDateState, 
  //       localTimezone
  //     ).time;
  // };
  // const getUserDate = () => {
  //   return getUserDateTime(
  //       timezone, 
  //       localTimeState, 
  //       localDateState, 
  //       localTimezone
  //     ).date;
  // };
  const [hoursArr, setHoursArr] = React.useState<string[]>([]);
  const [curHour, setCurHour] = React.useState<string>('0');
  const [curMin, setCurMin] = React.useState<string>('0');
  const [eleWidth, setEleWidth] = React.useState<number>(75);
  // const [dateState, setDateState] = React.useState<string>(getUserDate());
  

  React.useEffect(() => {
    if( elementWidth && elementWidth > 0 ) {
      setEleWidth(elementWidth);
    }
  }, [elementWidth]);
  
  React.useEffect(()=>{
    // console.log("🚀 ~ file: Timeline.component.tsx ~ line 125 ~ React.useEffect ~ time", time)
    setLocalTimeState(time);
  }, [time]);
  React.useEffect(()=>{
    // console.log("🚀 ~ file: Timeline.component.tsx ~ line 125 ~ React.useEffect ~ date", date)
    setLocalDateState(date);
  }, [date]);
  

  React.useEffect(() => {
    const cur = userTimeState.split(' ')[0].split(':');
    // console.log("🚀 ~ file: Timeline.component.tsx ~ line 105 ~ React.useEffect ~ cur", cur)
    const [_curHour, _curMin ]= cur;
    setCurHour(_curHour);
    setCurMin(_curMin);
  }, [timezone, userTimeState]);

  React.useEffect(() => {
    //recreate hoursArr base on the time parameter at middle
    let tempHoursArr = hoursFormat.normal;
    if (!militaryFormat) tempHoursArr = hoursFormat.military;
    const prevArr = tempHoursArr.slice(0, Number(curHour) + 1);
    const nextArr = tempHoursArr.slice(Number(curHour) + 1, hoursArr.length);
    const baseArr = [...nextArr, ...prevArr, ...nextArr, ...prevArr];
    // console.dir(1);
    setHoursArr(baseArr);
    // console.log("🚀 ~ file: Timeline.component.tsx ~ line 123 ~ userDateState", userDateState)
  }, [militaryFormat, hoursArr.length, curHour, userTimeState, userDateState]);

  const holderCallbackRef = (ele: (HTMLDivElement | null)) => {
      if (ele) {
        // set cur hour in middle
        const marginSetByMin = ( Number(curMin) / 60 ) * eleWidth; 
        ele.scrollLeft = (ele.scrollWidth / 2) - (ele.clientWidth / 2) - (eleWidth / 2) + marginSetByMin;
      }
  };

  const getTimeWhenUsingMilitaryFormat = (_time:string) => {
    // console.dir(_time);
    // console.dir(hoursFormat.normal.indexOf(_time));
    return hoursFormat.normal.indexOf(_time);
  };
  const getTime = (_time:string) => {
    if(!militaryFormat) return Number(_time);
      return getTimeWhenUsingMilitaryFormat(_time);
  }

  const setBackgroundColor = (t:string) => {  
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

    const baseStyle = {"width":"100%"};

    switch (thisType) {
      case type.night:
        return Object.assign({} as React.CSSProperties, baseStyle, {'backgroundColor': defaultColor.night});
      case type.dawn:
        return Object.assign({} as React.CSSProperties, baseStyle,  {'backgroundImage': `linear-gradient( 90deg, ${defaultColor.night} 13%, ${defaultColor.day} 86%)`, 'color': defaultColor.white });
      case type.day:
        return Object.assign({} as React.CSSProperties, baseStyle, {'backgroundColor': defaultColor.day});
      case type.dusk:
        return Object.assign({} as React.CSSProperties, baseStyle, {'backgroundImage': `linear-gradient( 90deg, ${defaultColor.day} 13%, ${defaultColor.night} 86%)`, 'color': defaultColor.white });
      default:
        return Object.assign({} as React.CSSProperties, baseStyle, {'backgroundColor': defaultColor.night});
    }
  }
  
  const constructValidDateString = (dateString:string) => {
    const [month, day, year] = dateString.split('-');
    if(month&&day&&year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T16:00:00.0`;
    } else {
      console.error('Date format error, Timeline component');
      return 0;
    }
  };

  const getAnnotation = (txt :string) => {
    // txt format will be MM-DD-YYYY
    let zeroCount = 0;
  // console.log("🚀 ~ file: Timeline.component.tsx ~ line 186 ~ getAnnotation ~ txt", txt)
    
    const curDate = new Date(constructValidDateString(txt));
    console.log("🚀 ~ file: Timeline.component.tsx ~ line 183 ~ getAnnotation ~ curDate", curDate)
    let nextDate = new Date();
    nextDate.setDate(curDate.getDate() + 1);
    const annotationStyle = {
      'position': 'absolute',
      'top': '14px',
      'fontSize': '0.6em',
    } as React.CSSProperties;
// DONE: show date under midnight cell
//DONE: change date base on real data
    if (zeroCount === 0) {
      zeroCount += 1;
      return <div style={annotationStyle} >{getFormattedDate(curDate)}</div>;
    } else {
      zeroCount += 1;
      return <div style={annotationStyle} >{getFormattedDate(nextDate)}</div>;
    }
    
    // return txt;
  };

  /**
   * DONE: 3: click on time zone to edit time zone 
   * */

  return (
    <Styled.Container bg={color.background} txtColor={color.nightText}>
      <Styled.Holder elementWidth={eleWidth} ref={holderCallbackRef} isScrollEnabled={false}>
        {
          hoursArr.map((x, index) => {
            return (
            <div key={index} style={{"display":"flex","flexDirection":"column","position":"relative", "alignItems":"center", "fontSize":"1rem"}}>
              <div style={setBackgroundColor(x)} >{x}</div>
              {(x === '0') ? getAnnotation(userDateState) : ''}
            </div>
            );
          })
        }
      </Styled.Holder>
    </Styled.Container>
  )
}

export default Timeline;