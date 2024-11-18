import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const CustomDatePicker = ({ selectedDate, onChange, maxDate = new Date() }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const formatHeaderDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatButtonDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = useCallback((date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }, []);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= maxDate) {
      onChange(newDate);
    }
  };

  return (
    <div className="relative">
      <div className="inline-flex items-center gap-1 p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={handlePreviousDay}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          <Calendar className="w-4 h-4 text-gray-500" />
          {formatButtonDate(selectedDate)}
        </button>

        <button
          onClick={handleNextDay}
          disabled={isToday(selectedDate)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 w-[280px] border border-gray-200">
          <div className="p-2">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={handlePreviousMonth}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-sm font-semibold">
                {formatHeaderDate(currentMonth)}
              </div>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 h-8 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>
            
            <CalendarGrid
              selectedDate={selectedDate}
              currentMonth={currentMonth}
              onChange={(date) => {
                onChange(date);
                setIsOpen(false);
              }}
              maxDate={maxDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CalendarGrid = ({ selectedDate, currentMonth, onChange, maxDate }) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day, index) => {
        if (day === null) {
          return <div key={`empty-${index}`} className="h-8" />;
        }

        const date = new Date(year, month, day);
        const isSelected = 
          selectedDate.getDate() === day && 
          selectedDate.getMonth() === month && 
          selectedDate.getFullYear() === year;
        const isFuture = date > maxDate;
        const isToday = new Date().getDate() === day && 
                       new Date().getMonth() === month && 
                       new Date().getFullYear() === year;

        return (
          <button
            key={day}
            onClick={() => !isFuture && onChange(date)}
            disabled={isFuture}
            className={`
              h-8 text-sm rounded-md transition-colors flex items-center justify-center
              ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                isToday ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 
                'hover:bg-gray-100'
              }
              ${isFuture ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

export default CustomDatePicker;