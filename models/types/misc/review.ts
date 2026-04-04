export type IReview = {
    _id: string;
    rating: number | null;
    authorId: string;
    authorFirstName: string;
    comment: string | null;
    commentLikes: [Boolean];
    inResponseToId: string | null;
    createdAt: Date;
    updatedAt: Date;
}