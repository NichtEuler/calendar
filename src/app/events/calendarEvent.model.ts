
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    isRecur: boolean;
    isImportant: boolean,
    allDay: boolean;
    roomId: string;
    startRecur: Date;
    daysOfWeek: [Number];
    groupId: string;
}