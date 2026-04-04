export interface ICommunity {
    name: string;
    _id: string;
    adminIDs: string[];
    creatorID: string;
    communityMemberIDs: string[];
    privacyLevel: 'public' | 'private' | 'hidden' | 'restricted' | 'passwordProtected';
    communityPassword: string;
    description: string;
    postIDs: string[];
    recipeIDs: string[];
    tags: string[];
    requestIDs: string[];
    createdAt: string;
    updatedAt: string;
}