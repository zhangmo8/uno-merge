import type { ClassNameValue, Config } from './types.js'

/**
 * Creates a customized unoMerge function with the provided configuration
 * @param config - Configuration for handling UnoCSS class conflicts
 * @returns A function that merges UnoCSS classes without conflicts
 */
export function createUnoMerge(config: Config) {
  const { conflictRules, join = defaultJoiner, exclusionRules = [] } = config

  /**
   * Merges UnoCSS classes without style conflicts
   * @param classLists - Class names to merge
   * @returns Merged class names as a string
   */
  return function unoMerge(...classLists: ClassNameValue[]): string {
    // Flatten and normalize all class names
    const allClasses = flattenClassNames(classLists)

    // Early return for empty input
    if (allClasses.length === 0) {
      return ''
    }

    // Initialize data structures
    const inputOrder: string[] = []
    const seenClasses = new Set<string>()
    const conflictGroups = new Map<string, string[]>()
    const classToGroupMap = new Map<string, string | null>()
    const finalClasses = new Set<string>()

    // First pass: process all classes, build conflict groups
    for (const className of allClasses) {
      // Skip duplicates efficiently using Set
      if (seenClasses.has(className)) continue
      seenClasses.add(className)
      inputOrder.push(className)

      // Find conflict group for this class
      let conflictGroup: string | null = null

      for (const rule of conflictRules) {
        const { classes, extractor } = rule

        const isMatch = classes.some((pattern) => {
          if (typeof pattern === 'string') {
            return pattern === className
          }
          return pattern.test(className)
        })

        if (isMatch) {
          const extracted = extractor(className)
          if (extracted) {
            conflictGroup = extracted
            break
          }
        }
      }

      classToGroupMap.set(className, conflictGroup)

      if (conflictGroup) {
        if (!conflictGroups.has(conflictGroup)) {
          conflictGroups.set(conflictGroup, [])
        }
        conflictGroups.get(conflictGroup)!.push(className)
      }
    }

    // Determine winning classes for each conflict group (last one wins)
    const winningClasses = new Map<string, string>()

    for (const [group, classes] of conflictGroups.entries()) {
      if (classes.length > 0) {
        // Get last class in input order (more efficient than max index searching)
        for (let i = inputOrder.length - 1; i >= 0; i--) {
          if (classes.includes(inputOrder[i])) {
            winningClasses.set(group, inputOrder[i])
            break
          }
        }
      }
    }

    // Add all non-conflicting classes and winning classes to finalClasses
    for (const className of inputOrder) {
      const group = classToGroupMap.get(className)

      if (group === null) {
        finalClasses.add(className)
      } else {
        const winner = group ? winningClasses.get(group) : undefined
        if (winner === className) {
          finalClasses.add(className)
        }
      }
    }

    // Apply exclusion rules
    const excludeClasses: string[] = []
    for (const rule of exclusionRules) {
      if (rule.when(inputOrder)) {
        excludeClasses.push(...rule.exclude)
      }
    }

    // Build result maintaining original order
    const result: string[] = []
    for (const className of inputOrder) {
      if (excludeClasses.includes(className)) {
        continue
      }

      if (finalClasses.has(className)) {
        result.push(className)
      }
    }

    return join(result)
  }
}

/**
 * Default function to join class names
 */
function defaultJoiner(classNames: string[]): string {
  return classNames.join(' ')
}

/**
 * Flattens and normalizes class name values
 */
function flattenClassNames(classNames: ClassNameValue[]): string[] {
  const result: string[] = []

  for (const className of classNames) {
    if (!className) continue

    if (Array.isArray(className)) {
      result.push(...flattenClassNames(className))
    } else if (typeof className === 'string') {
      result.push(...className.split(/\s+/).filter(Boolean))
    } else if (
      typeof className === 'number' ||
      typeof className === 'boolean'
    ) {
      result.push(String(className))
    }
  }

  return result
}
