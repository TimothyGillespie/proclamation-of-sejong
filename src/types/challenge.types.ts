export type HangulBlock = {
    characters: string[];
    completed: boolean;
};

export type EvaluatedHangulBlock = {
    characters: string[];
    completed: boolean;
    state: 'correct' | 'incorrect';
};
