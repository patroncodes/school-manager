"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      const isoDate = value.toLocaleDateString("en-CA");
      router.push(`?date=${isoDate}`);
    }
  }, [value, router]);

  return <Calendar onChange={onChange} value={value} view="month" />;
};

export default EventCalendar;
