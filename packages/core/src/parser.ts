import type { QtCommand } from './types.js'

function normalize(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

export function parseQtCommand(input: string): QtCommand {
  const value = normalize(input)

  if (value === '/qt') {
    return { kind: 'menu' }
  }

  if (value.startsWith('/qt improve ')) {
    const remainder = value.slice('/qt improve '.length).trim()
    const firstSpace = remainder.indexOf(' ')

    if (firstSpace === -1) {
      return {
        kind: 'improve',
        taskName: remainder
      }
    }

    return {
      kind: 'improve',
      taskName: remainder.slice(0, firstSpace).trim(),
      userInput: remainder.slice(firstSpace + 1).trim()
    }
  }

  if (value.startsWith('/qt/')) {
    const remainder = value.slice('/qt/'.length).trim()
    const firstSpace = remainder.indexOf(' ')

    if (firstSpace === -1) {
      return {
        kind: 'run',
        taskName: remainder,
        userInput: ''
      }
    }

    return {
      kind: 'run',
      taskName: remainder.slice(0, firstSpace).trim(),
      userInput: remainder.slice(firstSpace + 1).trim()
    }
  }

  if (value.startsWith('/qt ')) {
    const remainder = value.slice('/qt '.length).trim()
    const firstSpace = remainder.indexOf(' ')

    if (firstSpace === -1) {
      return {
        kind: 'create',
        taskName: remainder,
        instructions: ''
      }
    }

    return {
      kind: 'create',
      taskName: remainder.slice(0, firstSpace).trim(),
      instructions: remainder.slice(firstSpace + 1).trim()
    }
  }

  throw new Error('Input is not a QuickTask command.')
}
