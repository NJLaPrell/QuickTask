export type QtCommand =
  | { kind: 'menu' }
  | { kind: 'create'; taskName: string; instructions: string }
  | { kind: 'run'; taskName: string; userInput: string }
  | { kind: 'improve'; taskName: string; userInput?: string };

export function describeQt(): string {
  return [
    'QuickTask (qt) is a task templating system accessed through /qt.',
    'Use /qt to view help, /qt [task] [instructions] to define a task, /qt/[task] to run a task, and /qt improve [task] [input] to improve a task template.'
  ].join(' ');
}
