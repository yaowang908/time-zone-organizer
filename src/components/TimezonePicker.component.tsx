import React from 'react';
import defaultTimezones from '../data/timezones' 
import Select from "react-select";

import './TimezonePicker.style.scss';

export interface Props {
  placeHolder: string;
  className?: string;
};

interface Timezone {
  id:number; 
  value:string; 
  label:string
};

const TimezonePicker: React.FC<Props> = ({
  placeHolder = 'America/New_York',
  className,
}) => {

  const [ options, setOptions ] = React.useState<Timezone[]>([]);
  const [ selectedTimezone, setSelectedTimezone ] = React.useState<Timezone>(); 

  const optionsInit = () => {
    const _options:{id:number, value:string, label:string}[] = [];
    defaultTimezones.map((timezone, index) => {
      _options.push({id: index, value: timezone.timezone, label: timezone.city});
      return <></>;
    });
    return _options;
  };

  React.useEffect(() => {
    setOptions(optionsInit());
  }, []);
// TODO: return selected value
// TODO: style it

  return (
    <Select 
      options={options} 
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