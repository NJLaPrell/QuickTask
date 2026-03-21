export type QtCommand = {
    kind: 'menu';
} | {
    kind: 'create';
    taskName: string;
    instructions: string;
} | {
    kind: 'run';
    taskName: string;
    userInput: string;
} | {
    kind: 'improve';
    taskName: string;
    userInput?: string;
} | {
    kind: 'incomplete';
    reason: 'missing-improve-task';
    usage: '/qt improve [task] [input]';
};
export declare function describeQt(): string;
