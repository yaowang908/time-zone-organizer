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

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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

  return (
    <div className={cn("relative", className)}>
      <div
        className="flex items-center justify-center space-x-2 text-white/80 mb-2 cursor-pointer hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs font-medium">Local Time</span>
      </div>

      <div className="text-center space-y-2">
        <div
          className="text-center text-lg font-semibold bg-transparent border-0 text-white focus:ring-0 p-2 cursor-pointer flex items-center justify-center space-x-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{value.toLocaleDateString()} {value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <Calendar className="w-4 h-4 text-white/60" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl min-w-[280px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <h3 className="text-white font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs text-white/60 font-medium p-1">
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
                      "p-2 text-sm rounded transition-colors hover:bg-white/20",
                      isTodayDate && !isSelectedDate && "bg-blue-500/30 text-white font-semibold",
                      isSelectedDate && "bg-blue-600 text-white font-semibold",
                      !isTodayDate && !isSelectedDate && "text-white/80 hover:text-white"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Time picker */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs text-white/60">Time:</span>
                <div className="flex items-center space-x-2 bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm">
                  <span>{value.getHours().toString().padStart(2, '0')}:{value.getMinutes().toString().padStart(2, '0')}</span>
                  <Clock className="w-3 h-3 text-white/60" />
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