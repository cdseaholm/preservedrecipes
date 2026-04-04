import { UseFormReturnType } from "@mantine/form";

export interface IPost {
    _id: string;
    relatedToID: string | null; //can be recipe ID or family/community ID for now, can expand to other types later
    relatedToType: 'recipe' | 'family' | 'community' | null; //specifies what the post is related to, can expand to other types later
    name: string;
    image: string;
    type: 'recipe' | 'text' | 'image' | 'video' | 'link' | 'other' | null;
    creatorID: string;
    commentIDs: string[];
    ratingIDs: string[];
    category: string[];
    content: string[]; //can be recipe IDs or plain text for now depending on post type
    createdAt: string;
    updatedAt: string;
}

//content can be recipe IDs or plain text for now depending on post type

export type PostFormType = UseFormReturnType<IPost, (values: IPost) => IPost>;