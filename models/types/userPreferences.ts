import { IVacation } from "./vacation";

export enum Season {
    Winter = "Winter",
    Spring = "Spring",
    Summer = "Summer",
    Fall = "Autumn",
    Undefined = ""
}

export interface IUserPreferences {
  userID: string;
  completed: boolean;
  climatePref: string[];
  vacationType: string[];
  vacationStyle: string[];
  favoriteVacation: IVacation;
  dreamVacation: IVacation;
  favVacationTimeOfYear: Season;
}