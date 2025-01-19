export type FamilyMember = {
    familyMemberID: string;
    familyMemberName: string;
    familyMemberEmail: string;
    relations: MemberRelation[];
    status: string;
}

export type MemberRelation = {
    relatedTo: {
        name: string;
        id: string;
    },
    relation: string;
}