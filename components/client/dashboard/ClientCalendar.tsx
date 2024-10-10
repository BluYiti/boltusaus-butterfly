"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import Image from "next/image";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// To-Do displayed in the calendar
const events = [
  {
    id: 1,
    icon: "🧘‍♀️",
    title: "Meditate",
    time: "20-30 minutes/day",
    description: "Meditating helps relax the mind",
  },
  {
    id: 2,
    icon: "🐶",
    title: "Pet Time",
    time: "",
    description: "Be sure to have some play time with your beloved pets",
  },
  {
    id: 3,
    icon: "💪",
    title: "Exercise",
    time: "30-35 minutes/day",
    description: "Exercising keeps the mind and body healthy",
  },
  {
    id: 4,
    icon: "🎨",
    title: "Arts",
    time: "",
    description: "Showcase your talent, express yourself",
  },
];

const ClientCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold my-4">What to do?</h1>
          <Image
            src="/assets/icons/ellipse.svg"
            alt="Search"
            height={20}
            width={20}
          />
        </div>
        {events.map((event) => (
          <div
            className="p-3 rounded-md bg-gray-100 flex items-center space-x-3"
            key={event.id}
          >
            <div className="flex-shrink-0 text-2xl">{event.icon}</div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <h1 className="font-semibold text-gray-700">{event.title}</h1>
                <span className="text-gray-300 text-xs">{event.time}</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientCalendar;
