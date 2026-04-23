'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCycles } from '@/lib/firestore';

export default function CycleCalendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [periodDays, setPeriodDays] = useState<number[]>([]);
  const [predictionStart, setPredictionStart] = useState<number | null>(null);

  useEffect(() => {
    const loadCycleData = async () => {
      if (!user) return;

      try {
        const cycles = await getUserCycles(user.uid);
        
        if (cycles.length > 0) {
          const latestCycle = cycles[cycles.length - 1];
          const startDate = new Date(latestCycle.start_date);
          const endDate = new Date(latestCycle.end_date);
          
          // Mark period days
          const days: number[] = [];
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if (d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()) {
              days.push(d.getDate());
            }
          }
          setPeriodDays(days);

          // Calculate next period prediction (28 days from start)
          const nextPeriodDate = new Date(startDate);
          nextPeriodDate.setDate(nextPeriodDate.getDate() + 28);
          
          if (nextPeriodDate.getMonth() === currentMonth.getMonth() && 
              nextPeriodDate.getFullYear() === currentMonth.getFullYear()) {
            setPredictionStart(nextPeriodDate.getDate());
          }
        }
      } catch (error) {
        console.error('Error loading cycle data:', error);
      }
    };

    loadCycleData();
  }, [user, currentMonth]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
          <div key={index} className="text-center text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const isToday = day === new Date().getDate() && 
                         currentMonth.getMonth() === new Date().getMonth() &&
                         currentMonth.getFullYear() === new Date().getFullYear();
          const isPeriodDay = day && periodDays.includes(day);
          const isPrediction = day === predictionStart;

          return (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all cursor-pointer
                ${!day ? 'invisible' : ''}
                ${isToday ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-300' : ''}
                ${isPeriodDay && !isToday ? 'bg-red-100 text-red-700 font-semibold' : ''}
                ${isPrediction && !isToday ? 'bg-purple-100 text-purple-700 font-semibold border-2 border-purple-300 border-dashed' : ''}
                ${!isToday && !isPeriodDay && !isPrediction ? 'hover:bg-gray-100 text-gray-700' : ''}
              `}
              onClick={() => day && setSelectedDay(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-600 rounded"></div>
          <span className="text-gray-600">Prediction: Period starts Mar 28</span>
        </div>
      </div>
    </div>
  );
}
