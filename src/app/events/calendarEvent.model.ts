
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
    creator: string;
    daysOfWeek: [Number];
    groupId: string;
}