export interface IUserFamily {
  userPermission: string;
  familyID: string;
  siblingIDs: string[];
  parentIDs: string[];
  childrenIDs: string[];
  partnerIDs: string[];
}