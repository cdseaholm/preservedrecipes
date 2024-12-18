import { IResponse } from "./response";

export interface IComment {
    commentor: string;
    comment: string;
    responses: IResponse[];
    commentLikes: boolean[]
}