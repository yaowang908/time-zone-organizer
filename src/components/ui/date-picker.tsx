import * as React from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const [editingHours, setEditingHours] = React.useState(false);
  const [editingMinutes, setEditingMinutes] = React.useState(false);
  const [tempHours, setTempHours] = React.useState(value.getHours().toString().padStart(2, '0'));
  const [tempMinutes, setTempMinutes] = React.useState(value.getMinutes().toString().padStart(2, '0'));

  // Update temp values when value prop changes
  React.useEffect(() => {
    setTempHours(value.getHours().toString().padStart(2, '0'));
    setTempMinutes(value.getMinutes().toString().padStart(2, '0'));
  }, [value]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    selectedDate.setHours(value.getHours(), value.getMinutes());
    onChange(selectedDate);
    setIsOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(value);
    newDate.setHours(hours, minutes);
    onChange(newDate);
  };

  const handleHoursInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTempHours(input);
  };

  const handleMinutesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTempMinutes(input);
  };

  const handleHoursBlur = () => {
    setEditingHours(false);
    const hours = parseInt(tempHours, 10);
    if (!isNaN(hours) && hours >= 0 && hours <= 23) {
      const newDate = new Date(value);
      newDate.setHours(hours);
      onChange(newDate);
    } else {
      setTempHours(value.getHours().toString().padStart(2, '0'));
    }
  };

  const handleMinutesBlur = () => {
    setEditingMinutes(false);
    const minutes = parseInt(tempMinutes, 10);
    if (!isNaN(minutes) && minutes >= 0 && minutes <= 59) {
      const newDate = new Date(value);
      newDate.setMinutes(minutes);
      onChange(newDate);
    } else {
      setTempMinutes(value.getMinutes().toString().padStart(2, '0'));
    }
  };

  const handleHoursKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleHoursBlur();
    } else if (e.key === 'Escape') {
      setEditingHours(false);
      setTempHours(value.getHours().toString().padStart(2, '0'));
    }
  };

  const handleMinutesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMinutesBlur();
    } else if (e.key === 'Escape') {
      setEditingMinutes(false);
      setTempMinutes(value.getMinutes().toString().padStart(2, '0'));
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return day === value.getDate() &&
      currentMonth.getMonth() === value.getMonth() &&
      currentMonth.getFullYear() === value.getFullYear();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase();
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark px-6 py-3 rounded-2xl shadow-soft border border-slate-200 dark:border-slate-700 group cursor-pointer hover:border-primary/50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-2xl font-bold text-slate-800 dark:text-white">{formatDate(value)}</span>
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2"></div>
        <span className="text-2xl font-mono text-primary font-bold">{formatTime(value)}</span>
        <span className="material-icons-outlined text-slate-400 group-hover:text-primary ml-2 transition-colors">edit_calendar</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-xl min-w-[280px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 text-slate-800 dark:text-slate-200" />
              </button>
              <h3 className="text-slate-800 dark:text-slate-200 font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 text-slate-800 dark:text-slate-200" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium p-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isTodayDate = isToday(day);
                const isSelectedDate = isSelected(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      "p-2 text-sm rounded transition-colors",
                      isTodayDate && !isSelectedDate && "bg-primary/20 text-primary font-semibold",
                      isSelectedDate && "bg-primary text-white font-semibold",
                      !isTodayDate && !isSelectedDate && "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Time picker */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Time:</span>
                <div className="flex items-center space-x-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200 text-sm">
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
                      onClick={() => {
                        const newDate = new Date(value);
                        newDate.setHours((value.getHours() + 1) % 24);
                        onChange(newDate);
                      }}
                      aria-label="Increment hour"
                    >
                      ▲
                    </button>
                    {editingHours ? (
                      <input
                        type="text"
                        value={tempHours}
                        onChange={handleHoursInputChange}
                        onBlur={handleHoursBlur}
                        onKeyDown={handleHoursKeyDown}
                        className="w-8 text-lg font-mono min-w-[2ch] text-center bg-transparent border-none text-slate-800 dark:text-slate-200 focus:outline-none"
                        autoFocus
                        maxLength={2}
                      />
                    ) : (
                      <span
                        className="text-lg font-mono min-w-[2ch] text-center select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded px-1"
                        onClick={() => setEditingHours(true)}
                      >
                        {value.getHours().toString().padStart(2, '0')}
                      </span>
                    )}
                    <button
                      type="button"
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
                      onClick={() => {
                        const newDate = new Date(value);
                        newDate.setHours((value.getHours() + 23) % 24);
                        onChange(newDate);
                      }}
                      aria-label="Decrement hour"
                    >
                      ▼
                    </button>
                  </div>
                  <span className="text-lg font-mono select-none">:</span>
                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
                      onClick={() => {
                        const newDate = new Date(value);
                        newDate.setMinutes((value.getMinutes() + 1) % 60);
                        onChange(newDate);
                      }}
                      aria-label="Increment minute"
                    >
                      ▲
                    </button>
                    {editingMinutes ? (
                      <input
                        type="text"
                        value={tempMinutes}
                        onChange={handleMinutesInputChange}
                        onBlur={handleMinutesBlur}
                        onKeyDown={handleMinutesKeyDown}
                        className="w-8 text-lg font-mono min-w-[2ch] text-center bg-transparent border-none text-slate-800 dark:text-slate-200 focus:outline-none"
                        autoFocus
                        maxLength={2}
                      />
                    ) : (
                      <span
                        className="text-lg font-mono min-w-[2ch] text-center select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded px-1"
                        onClick={() => setEditingMinutes(true)}
                      >
                        {value.getMinutes().toString().padStart(2, '0')}
                      </span>
                    )}
                    <button
                      type="button"
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
                      onClick={() => {
                        const newDate = new Date(value);
                        newDate.setMinutes((value.getMinutes() + 59) % 60);
                        onChange(newDate);
                      }}
                      aria-label="Decrement minute"
                    >
                      ▼
                    </button>
                  </div>
                  <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DatePicker }; 