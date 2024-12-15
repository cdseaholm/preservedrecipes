import { IUserPreferences } from '@/models/types/userPreferences';
import { IVacation } from '@/models/types/vacation';
import { create } from 'zustand';

interface UserStore {
    userPreferences: IUserPreferences;
    setUserPreferences: (userPreferences: IUserPreferences) => void;
    vacations: IVacation[];
    setVacations: (vacations: IVacation[]) => void;
    userID: string;
    setUserID: (userID: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    userPreferences: {} as IUserPreferences,
    setUserPreferences: (preferences) => set({userPreferences: preferences}),
    vacations: [] as IVacation[],
    setVacations: (vacays) => set({vacations: vacays}),
    userID: '',
    setUserID: (newString) => set({userID: newString})
}));