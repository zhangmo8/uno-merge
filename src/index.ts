// Core UnoCSS merge functionality
import { createUnoMerge } from './create-uno-merge.js'
import type { ClassNameValue } from './types.js'
import { defaultConfig } from './default-config.js'

/**
 * Efficiently merges UnoCSS classes without style conflicts
 */
export function unoMerge(...classLists: ClassNameValue[]): string {
  return createUnoMerge(defaultConfig)(...classLists)
}

// Named exports
export { createUnoMerge } from './create-uno-merge.js'
export type { ClassNameValue, ClassConflictRule, Config } from './types.js'
export { defaultConfig } from './default-config.js'
