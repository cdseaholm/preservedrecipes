import { IUserPreferences } from "./userPreferences";
import { IVacation } from "./vacation";

export interface IUser {
    name: string;
    email: string;
    password: string;
    userPreferences: IUserPreferences;
    vacations: IVacation[];
    _id: string;
    createdAt: string;
    updatedAt: string;
    resetPasswordToken: string;
    resetPasswordExpires: string;
  }