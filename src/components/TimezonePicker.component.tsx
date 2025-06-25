'use client';
import React from 'react';
import defaultTimezones from '../data/timezones';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export interface Props {
  placeHolder: string;
  className?: string;
  setSelectedTimezone: (newTimezone: string) => void;
  defaultValue?: Timezone
};

export interface Timezone {
  id: number;
  value: string;
  label: string
};

const TimezonePicker: React.FC<Props> = ({
  placeHolder = 'America/New_York',
  className,
  setSelectedTimezone,
  defaultValue = { id: 12, value: "(GMT-05:00) Eastern Time", label: "America/New_York" },
}) => {

  const [selectedValue, setSelectedValue] = React.useState(defaultValue.label);

  React.useEffect(() => {
    setSelectedValue(defaultValue.label);
  }, [defaultValue]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    setSelectedTimezone(value);
  };

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent>
        {defaultTimezones.map((timezone) => (
          <SelectItem key={timezone.id} value={timezone.label}>
            {timezone.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimezonePicker;