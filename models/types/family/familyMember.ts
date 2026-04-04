export type IFamilyMember = {
    familyMemberID: string;
    familyMemberName: string;
    familyMemberEmail: string;
    permissionStatus: 'Guest' | 'Member' | 'Admin';
    memberConnected: boolean;
}

export type MemberStatusEditType = {
    memberFormIndex: number;
    familyMemberID: string;
    familyMemberName: string;
    familyMemberEmail: string;
    permissionStatus: 'Guest' | 'Member' | 'Admin';
    memberConnected: boolean;
    selectedByBoxNum: number;
}