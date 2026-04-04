export type CommunityMember = {
    memberEmail: string;
    name: string;
    id: string;
    permissionStatus: 'member' | 'admin' | 'creator';
}