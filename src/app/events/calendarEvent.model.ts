import { Time } from "@angular/common";

export interface CalendarEvent {
    id: string;
    title: string;
    allDay: boolean;
    date: Date;
    startTime: Time;
    endTime: Time;
    daysOfWeek: number;
    user: string;
    room: string;
    isExisting: boolean;
    isRecurring: boolean;
    startRecur: Date;
    endRecur: Date;
}