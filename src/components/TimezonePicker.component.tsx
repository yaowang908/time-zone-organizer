import { stringify } from 'querystring';
import React from 'react';
import defaultTimezones from '../data/timezones' 
import Select from "react-select";

import './TimezonePicker.style.scss';

export interface Props {
  placeHolder: string;
};

interface Timezone {
  id:number; 
  value:string; 
  label:string
};

const TimezonePicker: React.FC<Props> = ({
  placeHolder = 'America/New_York',
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
  return (
    <Select 
      options={options} 
      defaultValues={placeHolder} 
      onChange={(values:Timezone) => setSelectedTimezone(values)}
      />
    // <div>
    //   {options[0]?.name}
    // </div>
  );
};

export default TimezonePicker;