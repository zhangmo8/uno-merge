/**
 * Represents a valid class name value
 * Can be a string, number, boolean, null, undefined, or an array of these
 */
export type ClassNameValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassNameValue[]

/**
 * Represents a rule for resolving conflicts between UnoCSS classes
 */
export interface ClassConflictRule {
  /**
   * The classes that this rule applies to
   * Can be a string for exact match or a RegExp for pattern matching
   */
  classes: (string | RegExp)[]

  /**
   * Function to extract the conflicting part from a class
   * @param className - The class name to extract from
   * @returns The extracted value or null if not applicable
   */
  extractor: (className: string) => string | null
}

/**
 * Represents a rule for excluding certain classes when conditions are met
 */
export interface ExclusionRule {
  /**
   * Function to determine when this exclusion rule should apply
   * @param classNames - All class names in the input
   * @returns Whether the exclusion should be applied
   */
  when: (classNames: string[]) => boolean

  /**
   * Classes to exclude when the condition is met
   */
  exclude: string[]
}

/**
 * Configuration for uno-merge
 */
export interface Config {
  /**
   * Rules for resolving conflicts between UnoCSS classes
   */
  conflictRules: ClassConflictRule[]

  /**
   * UnoCSS theme configuration
   * Used for handling arbitrary values
   */
  theme?: Record<string, unknown>

  /**
   * Function to join the final class names
   * @param classes - The merged class names
   * @returns The joined class names as a string
   */
  join?: (classes: string[]) => string

  /**
   * Rules for excluding certain classes when conditions are met
   * For example, excluding flex classes when grid classes are present
   */
  exclusionRules?: ExclusionRule[]
}
