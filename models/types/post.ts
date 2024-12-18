import { IComment } from "./comment";

export interface IPost {
    _id: string
    name: string;
    image: string;
    creatorID: string;
    comments: IComment[];
    category: string[];
    content: string[];
}