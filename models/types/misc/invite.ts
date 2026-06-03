export type IInvite = {
    email: string;
    inviteType?: 'family' | 'community';
    familyID: string;
    communityID?: string;
    token: string;
    createdAt: Date;
}
