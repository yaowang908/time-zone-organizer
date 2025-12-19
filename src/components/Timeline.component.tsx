'use client';

import React from 'react';
import { getFormattedDate } from '../lib/getFormattedDate';

export interface Props {
  timezone: string;
  localTimezone: string;
  time: string;
  date: string;
  elementWidth?: number;
  sunriseTime?: string;
  sunsetTime?: string;
  militaryFormat?: boolean;
}

const Timeline: React.FC<Props> = ({
  timezone,
  localTimezone,
  time,
  date,
  elementWidth = 75,
  sunriseTime = '6:00',
  sunsetTime = '18:00',
  militaryFormat = false,
}) => {
  const [userTimeState, setUserTimeState] = React.useState(time);
  const [userDateState, setUserDateState] = React.useState(date);
  const [curHour, setCurHour] = React.useState<number>(0);
  const [curMin, setCurMin] = React.useState<number>(0);

  React.useEffect(() => {
    setUserTimeState(time);
  }, [time]);

  React.useEffect(() => {
    setUserDateState(date);
  }, [date]);

  React.useEffect(() => {
    // Parse time to get current hour
    const timeParts = userTimeState.split(' ');
    let hour = 0;
    let minute = 0;

    if (timeParts.length > 1) {
      // 12-hour format: "8:37 PM"
      const [timeStr, period] = timeParts;
      const [h, m] = timeStr.split(':').map(Number);
      hour = h;
      minute = m || 0;
      if (period?.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period?.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
      }
    } else {
      // 24-hour format: "20:37"
      const [h, m] = userTimeState.split(':').map(Number);
      hour = h;
      minute = m || 0;
    }

    setCurHour(hour);
    setCurMin(minute);
  }, [userTimeState]);

  // Generate 24 hours array with current time in the middle (at position 12)
  const generateHoursArray = () => {
    const hours: number[] = [];
    // Start 12 hours before current hour to center it
    // The actual current time (with minutes) will be positioned via scroll calculation
    for (let i = -12; i < 12; i++) {
      hours.push((curHour + i + 24) % 24);
    }
    return hours;
  };

  const hoursArray = generateHoursArray();

  // Determine hour slot style - only two colors: yellowish for day, blueish for night
  const getHourSlotStyle = (hour: number) => {
    // Day hours: 6 AM to 6 PM (hours 6-17) - yellowish color
    // Night hours: 6 PM to 6 AM (hours 18-23, 0-5) - blueish color
    const isDayHour = hour >= 6 && hour < 18;

    if (isDayHour) {
      // Day time (6 AM - 6 PM) - yellowish/amber color
      return 'bg-slot-day-light dark:bg-slot-day-dark text-amber-900 dark:text-amber-50 border-r border-amber-900/5';
    } else {
      // Night time (6 PM - 6 AM) - blueish color
      return 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 border-r border-blue-300/20 dark:border-blue-700/50';
    }
  };

  // Check if we need to show date annotation (when crossing midnight)
  const shouldShowDateAnnotation = (hour: number, index: number) => {
    // Show date annotation when we cross midnight (hour 0) and it's not the first hour
    if (hour === 0 && index > 0 && hoursArray[index - 1] === 23) {
      try {
        const [month, day, year] = userDateState.split('-').map(Number);
        const currentDate = new Date(year, month - 1, day);
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return getFormattedDate(nextDate);
      } catch {
        return null;
      }
    }
    return null;
  };

  const timelineRef = React.useRef<HTMLDivElement>(null);
  const currentHourRef = React.useRef<HTMLDivElement>(null);

  // Scroll timeline to center current time at 50% (where the red indicator is)
  // Since current hour is at index 12 (middle of 24 hours), we need to center it
  React.useEffect(() => {
    if (timelineRef.current && currentHourRef.current) {
      const timeline = timelineRef.current;
      const currentHourElement = currentHourRef.current;

      // Wait for layout to be ready - use requestAnimationFrame to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          if (timeline && currentHourElement) {
            // Current hour is at index 12 (middle of the 24-hour array)
            // Calculate the position of the current hour element relative to the timeline scroll container
            const currentHourLeft = currentHourElement.offsetLeft;
            const currentHourWidth = currentHourElement.offsetWidth;
            const timelineWidth = timeline.offsetWidth;
            const timelineScrollWidth = timeline.scrollWidth;

            // Calculate scroll position to center the current time (hour + minutes) at 50% of viewport
            // Account for minutes: if we're at 22:47, we're 47/60 through hour 22, close to hour 23
            // The minuteOffset positions us within the current hour slot
            const minuteOffset = (curMin / 60) * currentHourWidth;
            const currentTimePosition = currentHourLeft + minuteOffset;

            // Center the current time at 50% of the viewport (where the red indicator is)
            const scrollLeft = currentTimePosition - (timelineWidth / 2);

            timeline.scrollTo({
              left: Math.max(0, Math.min(scrollLeft, timelineScrollWidth - timelineWidth)),
              behavior: 'smooth'
            });
          }
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [curHour, curMin, time, timezone]);

  return (
    <div className="relative w-full">
      <div
        ref={timelineRef}
        className="relative w-full h-10 flex rounded-md overflow-x-auto overflow-y-hidden text-[10px] font-medium select-none ring-1 ring-slate-900/5 dark:ring-white/10 timeline-scroll"
        style={{ scrollbarWidth: 'thin' }}
      >
        {hoursArray.map((hour, index) => {
          // Current hour is at index 12 (middle of 24 hours)
          const isCurrentHour = index === 12;
          return (
            <div
              key={`${hour}-${index}`}
              ref={isCurrentHour ? currentHourRef : null}
              className={`flex-1 flex items-center justify-center min-w-[calc(100%/24)] ${getHourSlotStyle(hour)} ${index === hoursArray.length - 1 ? '' : 'border-r'}`}
            >
              {hour}
            </div>
          );
        })}
      </div>
      {hoursArray.map((hour, index) => {
        const dateAnnotation = shouldShowDateAnnotation(hour, index);
        if (dateAnnotation) {
          // Calculate position for date annotation (at the transition point)
          const positionPercent = ((index + 0.5) / hoursArray.length) * 100;
          return (
            <div
              key={`annotation-${hour}-${index}`}
              className="absolute bottom-1 text-[9px] font-bold text-slate-400 bg-surface-light dark:bg-surface-dark px-1 rounded z-10 opacity-70"
              style={{ left: `${positionPercent}%`, transform: 'translateX(-50%)' }}
            >
              {dateAnnotation}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default Timeline;