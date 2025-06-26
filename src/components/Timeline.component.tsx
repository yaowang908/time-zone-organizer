'use client';

import React from 'react';

import defaultColor from '../settings/color.settings';
import hoursFormat from '../settings/hours.setting';

import { getFormattedDate } from '../lib/getFormattedDate';

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

  const [userTimeState, setLocalTimeState] = React.useState(time);
  const [userDateState, setLocalDateState] = React.useState(date);

  const [hoursArr, setHoursArr] = React.useState<string[]>([]);
  const [curHour, setCurHour] = React.useState<string>('0');
  const [curMin, setCurMin] = React.useState<string>('0');
  const [eleWidth, setEleWidth] = React.useState<number>(75);

  React.useEffect(() => {
    if (elementWidth && elementWidth > 0) {
      setEleWidth(elementWidth);
    }
  }, [elementWidth]);

  React.useEffect(() => {
    setLocalTimeState(time);
  }, [time]);

  React.useEffect(() => {
    setLocalDateState(date);
  }, [date]);

  React.useEffect(() => {
    const cur = userTimeState.split(' ')[0].split(':');
    const [_curHour, _curMin] = cur;
    setCurHour(_curHour);
    setCurMin(_curMin);
  }, [timezone, userTimeState]);

  React.useEffect(() => {
    let tempHoursArr = hoursFormat.normal;
    if (!militaryFormat) tempHoursArr = hoursFormat.military;
    const prevArr = tempHoursArr.slice(0, Number(curHour) + 1);
    const nextArr = tempHoursArr.slice(Number(curHour) + 1, hoursArr.length);
    const baseArr = [...nextArr, ...prevArr, ...nextArr, ...prevArr];
    setHoursArr(baseArr);
  }, [militaryFormat, hoursArr.length, curHour, userTimeState, userDateState]);

  const holderCallbackRef = (ele: (HTMLDivElement | null)) => {
    if (ele) {
      const marginSetByMin = (Number(curMin) / 60) * eleWidth;
      const allCellsWidth = 48 * eleWidth;
      ele.style.left = '50%';
      ele.style.marginLeft = `${-1 * allCellsWidth / 2 + (eleWidth / 2) - marginSetByMin}px`;
    }
  };

  const getTimeWhenUsingMilitaryFormat = (_time: string) => {
    return hoursFormat.normal.indexOf(_time);
  };

  const getTime = (_time: string) => {
    if (!militaryFormat) return Number(_time);
    return getTimeWhenUsingMilitaryFormat(_time);
  }

  const setBackgroundColor = (t: string) => {
    const thisTime: number = getTime(t);
    const type = {
      night: 'NIGHT',
      dawn: 'DAWN',
      day: 'DAY',
      dusk: 'DUSK',
    }
    const sunriseHour = Number(sunriseTime.split(':')[0]);
    const sunsetHour = Number(sunsetTime.split(':')[0]);
    let thisType = type.night;
    if (thisTime < sunriseHour) thisType = type.night;
    if (thisTime > sunriseHour && thisTime < sunsetHour) thisType = type.day;
    if (thisTime > sunsetHour) thisType = type.night;
    if (thisTime === sunriseHour) thisType = type.dawn;
    if (thisTime === sunsetHour) thisType = type.dusk;

    const baseStyle = { "width": "100%", "box-shadow": "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" };

    switch (thisType) {
      case type.night:
        return Object.assign({} as React.CSSProperties, baseStyle, { 'backgroundColor': defaultColor.night, 'color': defaultColor.nightText });
      case type.dawn:
        return Object.assign({} as React.CSSProperties, baseStyle, { 'backgroundImage': `linear-gradient( 90deg, ${defaultColor.night} 13%, ${defaultColor.day} 86%)`, 'color': defaultColor.dayText });
      case type.day:
        return Object.assign({} as React.CSSProperties, baseStyle, { 'backgroundColor': defaultColor.day, 'color': defaultColor.dayText });
      case type.dusk:
        return Object.assign({} as React.CSSProperties, baseStyle, { 'backgroundImage': `linear-gradient( 90deg, ${defaultColor.day} 13%, ${defaultColor.night} 86%)`, 'color': defaultColor.dayText });
      default:
        return Object.assign({} as React.CSSProperties, baseStyle, { 'backgroundColor': defaultColor.night, 'color': defaultColor.nightText });
    }
  }

  const constructValidDateString = (dateString: string) => {
    const [month, day, year] = dateString.split('-');
    if (month && day && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T16:00:00.0`;
    } else {
      console.error('Date format error, Timeline component');
      return 0;
    }
  };

  let zeroCount = 0;
  const getAnnotation = (txt: string) => {
    const curDate = new Date(constructValidDateString(txt));
    let nextDate = new Date();
    nextDate.setDate(curDate.getDate() + 1);
    if (zeroCount === 0) {
      zeroCount += 1;
      return <div className="text-xs text-center mt-1 opacity-70">{getFormattedDate(curDate)}</div>;
    } else {
      zeroCount += 1;
      return <div className="text-xs text-center mt-1 opacity-70">{getFormattedDate(nextDate)}</div>;
    }
  };

  return (
    <div className="relative overflow-hidden"
      style={{
        "backgroundColor": color.background ? color.background : '',
        "color": color.nightText ? color.nightText : '',
      }}>
      <div className="flex relative"
        ref={holderCallbackRef}
        style={{
          "flex": eleWidth ? '1 0 ' + eleWidth + 'px' : '75px',
        }}
      >
        {
          hoursArr.map((x, index) => {
            return (
              <div key={index} className="flex-shrink-0 text-center" style={{
                "width": eleWidth ? eleWidth : '75px',
                "flex": eleWidth ? '0 0 ' + eleWidth + 'px' : '0 0 75px'
              }}>
                <div
                  className="h-5 flex items-center justify-center text-sm font-medium"
                  style={setBackgroundColor(x)}
                >
                  {x}
                </div>
                {(x === '0') ? getAnnotation(userDateState) : ''}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default Timeline;