export interface Event{
    id: string;
    title: string;
    allDay: boolean;
    startTime: Date;
    endTime: Date;
    daysOfWeek: number;
    user: string;
    room: string;
}