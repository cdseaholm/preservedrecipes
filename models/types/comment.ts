import { IResponse } from "./response";

export interface IComment {
    commentorID: string;
    comment: string;
    responses: IResponse[];
    commentLikes: boolean[]
}

//if not commentorID exists, create and array of comments where you store comments, query for user comments