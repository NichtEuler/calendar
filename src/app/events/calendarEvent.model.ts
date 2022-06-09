
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    roomId: string;
    startRecur: Date;
    daysOfWeek: [Number],
    groupId: string
}