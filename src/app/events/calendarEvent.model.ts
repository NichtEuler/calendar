
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    isRecur: boolean;
    allDay: boolean;
    roomId: string;
    extendedProps: {
        startTime: Date;
        daysOfWeek: [Number];
    };
    groupId: string;
}