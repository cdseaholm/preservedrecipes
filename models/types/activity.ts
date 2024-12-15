export interface IActivity {
  userID: string;
  activityName: string;
  activityStatus: string;
  activityRatingOfTen: number;
  usedVacayAI: boolean;
  activityDifficultyOfTen: number;
  activityType: string[];
  activityRepeatabilityOfTen: number;
}