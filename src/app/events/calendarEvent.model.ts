
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    roomId: string;
    isRecur: boolean,
    startRecur: Date;
    daysOfWeek: [Number],
    groupId: string
}