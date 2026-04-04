import { UseFormReturnType } from "@mantine/form";

export type CommunityType = {
    name: string;
    privacyLevel: 'public' | 'private' | 'hidden' | 'restricted' | 'passwordProtected';
    communityPassword: string;
    description: string;
    tags: string[];
}

export type CommunityFormType = UseFormReturnType<CommunityType, (values: CommunityType) => CommunityType>;