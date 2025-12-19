'use client';
import React from 'react';
import defaultTimezones from '../data/timezones';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';

export interface Props {
  placeHolder: string;
  className?: string;
  setSelectedTimezone: (newTimezone: string) => void;
  defaultValue?: Timezone;
}

export interface Timezone {
  id: number;
  value: string;
  label: string;
}

// Mapping of timezone abbreviations to timezone labels
const timezoneAbbreviations: Record<string, string[]> = {
  'IST': ['Asia/Kolkata', 'Asia/Colombo'],
  'EST': ['America/New_York', 'America/Toronto', 'America/Montreal'],
  'ET': ['America/New_York', 'America/Toronto', 'America/Montreal'],
  'EDT': ['America/New_York', 'America/Toronto', 'America/Montreal'],
  'PST': ['America/Los_Angeles', 'America/Vancouver'],
  'PT': ['America/Los_Angeles', 'America/Vancouver'],
  'PDT': ['America/Los_Angeles', 'America/Vancouver'],
  'CST': ['America/Chicago', 'America/Mexico_City', 'Asia/Shanghai', 'Asia/Taipei'],
  'CT': ['America/Chicago', 'America/Mexico_City'],
  'CDT': ['America/Chicago', 'America/Mexico_City'],
  'MST': ['America/Denver', 'America/Phoenix'],
  'MT': ['America/Denver', 'America/Phoenix'],
  'MDT': ['America/Denver'],
  'GMT': ['Europe/London', 'Europe/Dublin'],
  'UTC': ['UTC'],
  'JST': ['Asia/Tokyo'],
  'CET': ['Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid'],
  'CEST': ['Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid'],
  'EET': ['Europe/Athens', 'Europe/Istanbul', 'Europe/Bucharest'],
  'EEST': ['Europe/Athens', 'Europe/Istanbul', 'Europe/Bucharest'],
  'AEST': ['Australia/Sydney', 'Australia/Melbourne'],
  'AEDT': ['Australia/Sydney', 'Australia/Melbourne'],
  'AWST': ['Australia/Perth'],
  'NZST': ['Pacific/Auckland'],
  'NZDT': ['Pacific/Auckland'],
  'SGT': ['Asia/Singapore'],
  'HKT': ['Asia/Hong_Kong'],
  'KST': ['Asia/Seoul'],
  'PKT': ['Asia/Karachi'],
  'BST': ['Asia/Dhaka'],
  'MYT': ['Asia/Kuala_Lumpur'],
  'PHT': ['Asia/Manila'],
  'THA': ['Asia/Bangkok'],
  'ICT': ['Asia/Ho_Chi_Minh', 'Asia/Bangkok'],
  'WIB': ['Asia/Jakarta'],
  'WIT': ['Asia/Jayapura'],
  'WITA': ['Asia/Makassar'],
};

// Extract city name from value string like "(GMT-05:00) New York, USA" -> "New York"
const extractCityName = (value: string): string => {
  const match = value.match(/\(GMT[+-]\d{2}:\d{2}\)\s+(.+?)(?:,|$)/);
  return match ? match[1].trim() : '';
};

// Filter timezones based on search query
const filterTimezones = (query: string): Timezone[] => {
  if (!query.trim()) {
    return defaultTimezones;
  }

  const lowerQuery = query.toLowerCase().trim();

  return defaultTimezones.filter((tz) => {
    // Match timezone label (e.g., "America/New_York")
    if (tz.label.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Match full value string (e.g., "(GMT-05:00) New York, USA")
    if (tz.value.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Match city name (e.g., "New York")
    const cityName = extractCityName(tz.value);
    if (cityName.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Match timezone abbreviations
    const upperQuery = query.toUpperCase().trim();
    if (timezoneAbbreviations[upperQuery]) {
      return timezoneAbbreviations[upperQuery].includes(tz.label);
    }

    // Match partial abbreviation (e.g., "EST" matches "EST", "EDT", "ET")
    for (const [abbr, labels] of Object.entries(timezoneAbbreviations)) {
      if (abbr.includes(upperQuery) || upperQuery.includes(abbr)) {
        if (labels.includes(tz.label)) {
          return true;
        }
      }
    }

    return false;
  });
};

const TimezonePicker: React.FC<Props> = ({
  placeHolder = 'America/New_York',
  className,
  setSelectedTimezone,
  defaultValue = { id: 27, value: "(GMT-05:00) New York, USA", label: "America/New_York" },
}) => {
  const [searchQuery, setSearchQuery] = React.useState(defaultValue.value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedTimezone, setSelectedTimezoneState] = React.useState<Timezone>(defaultValue);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSelectedTimezoneState(defaultValue);
    if (!isFocused && !isOpen) {
      setSearchQuery(defaultValue.value);
    }
  }, [defaultValue, isFocused, isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        // Reset search query to selected timezone value when closing
        setSearchQuery(selectedTimezone.value);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, selectedTimezone.value]);

  const filteredTimezones = filterTimezones(searchQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(true);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setIsOpen(true);
    // When focusing, show the selected timezone value as starting point
    if (!searchQuery || searchQuery === selectedTimezone.value) {
      setSearchQuery(selectedTimezone.value);
    }
    // Auto-select all text when focused
    e.target.select();
  };

  const handleInputBlur = () => {
    // Delay to allow click events on dropdown items to fire
    setTimeout(() => {
      setIsFocused(false);
      if (!isOpen) {
        setSearchQuery(selectedTimezone.value);
      }
    }, 200);
  };

  const handleTimezoneSelect = (timezone: Timezone) => {
    setSelectedTimezoneState(timezone);
    setSearchQuery(timezone.value);
    setSelectedTimezone(timezone.label);
    setIsOpen(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Show search query when focused/typing, otherwise show selected timezone value
  const displayValue = isFocused || isOpen ? searchQuery : (selectedTimezone.value || placeHolder);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeHolder}
          className={cn("pr-8", className)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(isFocused || isOpen) && searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </div>
      </div>
      {isOpen && filteredTimezones.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="p-1">
            {filteredTimezones.map((timezone) => (
              <div
                key={timezone.id}
                onClick={() => handleTimezoneSelect(timezone)}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground",
                  selectedTimezone.id === timezone.id && "bg-accent text-accent-foreground"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{extractCityName(timezone.value) || timezone.label}</span>
                  <span className="text-xs text-muted-foreground">{timezone.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {isOpen && filteredTimezones.length === 0 && searchQuery && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="p-2 text-sm text-muted-foreground text-center">
            No timezones found
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezonePicker;