export type ISuggestion = {
    suggestorEmail: string;
    suggestorName: string;
    suggestion: string;
    handled: boolean;
    createdAt: Date;
    suggestionTitle: string;
}