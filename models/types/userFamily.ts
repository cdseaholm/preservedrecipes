export interface IUserFamily {
  _id: string;
  familyID: string;
  siblingIDs: string[];
  parentIDs: string[];
  childrenIDs: string[];
  partnerIDs: string[];
}