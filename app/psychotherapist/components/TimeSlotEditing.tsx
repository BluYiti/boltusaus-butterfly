import React from 'react';
import { account, databases } from '@/appwrite';
import { Query } from 'appwrite';

interface TimeSlotEditingProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

const TimeSlotEditing: React.FC<TimeSlotEditingProps> = ({ selectedDay, selectedMonth }) => {
  if (!selectedDay || !selectedMonth) {
    return null;
  }

  return (
    <div>
        <div>
            <h1 className="text-2xl font-bold text-[#3585ff]">{selectedMonth} {selectedDay.toString()}</h1>
        </div>
    </div>
  );
};

export default TimeSlotEditing;