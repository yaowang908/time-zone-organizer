import React, { Dispatch, SetStateAction } from 'react';
import defaultTimezones from '../data/timezones' 
import Select from "react-select";

import './TimezonePicker.style.scss';

export interface Props {
  placeHolder: string;
  className?: string;
  setSelectedTimezone: Dispatch<SetStateAction<Timezone>>;
};

export interface Timezone {
  id:number; 
  value:string; 
  label:string
};

const TimezonePicker: React.FC<Props> = ({
  placeHolder = 'America/New_York',
  className,
  setSelectedTimezone,
}) => {

// TODO: return selected value
// TODO: pass in selected value
// DONE: style it

  return (
    <Select 
      options={defaultTimezones} 
      onChange={(values:Timezone) => setSelectedTimezone(values)}
      className={className?className:''}
      classNamePrefix="react-select"
      defaultValue={{ value: "(GMT-05:00) Eastern Time", label: "America/New_York"}}
      theme={(theme:any) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: '#293c6b',
          primary: '#ffd466',
        },
      })}
      />
    // <div>
    //   {options[0]?.name}
    // </div>
  );
};

export default TimezonePicker;