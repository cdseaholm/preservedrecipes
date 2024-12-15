import { IActivity } from "./activity";

export interface IVacation {
    userID: string;
    name: string;
    vacationStatus: string;
    dates: Date | { start: Date, end: Date }
    location: string;
    vacationType: string[];
    vacationStyle: string[];
    vacationClimate: string[];
    vacationScore: number;
    vacayAIRating: number;
    vacationActivities: IActivity[];
}