import React, { Dispatch, SetStateAction } from 'react';
import defaultTimezones from '../data/timezones' 
import Select from "react-select";

import './TimezonePicker.style.scss';

export interface Props {
  placeHolder: string;
  className?: string;
  setSelectedTimezone: (newTimezone:string) => void;
  defaultValue?: Timezone
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
  defaultValue = { value: "(GMT-05:00) Eastern Time", label: "America/New_York"},
}) => {

// DONE: return selected value
// DONE: pass in selected value
// DONE: style it
const [ defaultValueState, setDefaultValueState ] = React.useState({
              value: defaultValue.value, 
              label: defaultValue.label
            });

React.useEffect(() => {
  setDefaultValueState(defaultValue);
  // console.log(defaultValue);
}, [defaultValue]);

  return (
    <Select 
      options={defaultTimezones} 
      onChange={(values:Timezone) => setSelectedTimezone(values.label)}
      className={className?className:''}
      classNamePrefix="react-select"
      defaultValue={defaultValueState}
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