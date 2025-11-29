
import React, { useState } from 'react';
import { PlanItem } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  items: PlanItem[];
  onDateClick: (date: string) => void;
}

const CalendarTab: React.FC<Props> = ({ items, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getItemsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return items.filter(i => i.date === dateStr);
  };

  const renderDay = (day: number) => {
    const dayItems = getItemsForDate(day);
    const hasMeal = dayItems.some(i => i.type === 'meal');
    const hasMed = dayItems.some(i => i.type === 'medicine');
    const hasSleep = dayItems.some(i => i.type === 'sleep');

    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === new Date().toISOString().split('T')[0];

    return (
      <div 
        key={day} 
        onClick={() => onDateClick(dateStr)}
        className={`aspect-square p-1 relative border-2 rounded-xl flex flex-col items-center justify-start cursor-pointer transition-all active:scale-95
            ${isToday ? 'bg-duoBlue border-duoBlueDark text-white border-b-4' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 border-b-4'}`}
      >
        <span className="text-sm font-extrabold">{day}</span>
        
        <div className="flex gap-1 mt-1 flex-wrap justify-center">
            {hasMeal && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-duoGreen'}`}></div>}
            {hasMed && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-duoPurple'}`}></div>}
            {hasSleep && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-duoBlue'}`}></div>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-5 animate-fade-in overflow-y-auto pb-24">
      <h3 className="text-2xl font-extrabold text-gray-700 mb-6 uppercase tracking-wide">Plan Ahead</h3>

      <div className="bg-white p-4 rounded-3xl shadow-sm border-2 border-gray-200 border-b-4">
        <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-duoBlue transition-colors">
                <ChevronLeft size={28} strokeWidth={3} />
            </button>
            <h4 className="text-xl font-extrabold text-gray-700 uppercase tracking-wide">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-duoBlue transition-colors">
                <ChevronRight size={28} strokeWidth={3} />
            </button>
        </div>

        <div className="grid grid-cols-7 mb-2 text-center">
            {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-xs font-extrabold text-gray-400">{d}</div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
            {blanks.map((_, i) => <div key={`blank-${i}`} />)}
            {days.map(day => renderDay(day))}
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;
