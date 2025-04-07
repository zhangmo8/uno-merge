import type { Config } from './types.js'

/**
 * Default configuration for uno-merge
 * Contains conflict rules for common UnoCSS utilities
 */
export const defaultConfig: Config = {
  conflictRules: [
    // Display
    {
      classes: [
        'block',
        'inline-block',
        'inline',
        'flex',
        'inline-flex',
        'grid',
        'inline-grid',
        'hidden',
      ],
      extractor: (className) => className,
    },

    // Flex & Grid
    {
      classes: [/^flex-(?:row|col)(?:-reverse)?$/, /^grid-(?:rows|cols)-\d+$/],
      extractor: (className) => {
        if (className.startsWith('flex-')) return 'flex-direction'
        if (className.startsWith('grid-rows-')) return 'grid-rows'
        if (className.startsWith('grid-cols-')) return 'grid-cols'
        return null
      },
    },

    // Text alignment
    {
      classes: ['text-left', 'text-center', 'text-right', 'text-justify'],
      extractor: () => 'text-align',
    },

    // Font weight
    {
      classes: [
        /^(?:font|fw)-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black|100|200|300|400|500|600|700|800|900)$/,
      ],
      extractor: () => 'font-weight',
    },

    // Font size
    {
      classes: [
        /^(?:text|text-size)-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[.+\])$/,
      ],
      extractor: () => 'font-size',
    },

    // Sizing (width & height)
    {
      classes: [/^w-(?:\d+|full|screen|auto|\[.+\])$/],
      extractor: () => 'width',
    },
    {
      classes: [/^h-(?:\d+|full|screen|auto|\[.+\])$/],
      extractor: () => 'height',
    },

    // Margin
    {
      classes: [/^m[trblxy]?-(?:\d+|auto|\[.+\])$/],
      extractor: (className) => {
        const dir = className.charAt(1)
        if (dir === 't') return 'margin-top'
        if (dir === 'r') return 'margin-right'
        if (dir === 'b') return 'margin-bottom'
        if (dir === 'l') return 'margin-left'
        if (dir === 'x') return 'margin-x'
        if (dir === 'y') return 'margin-y'
        return 'margin'
      },
    },

    // Padding
    {
      classes: [/^p[trblxy]?-(?:\d+|auto|\[.+\])$/],
      extractor: (className) => {
        const dir = className.charAt(1)
        if (dir === 't') return 'padding-top'
        if (dir === 'r') return 'padding-right'
        if (dir === 'b') return 'padding-bottom'
        if (dir === 'l') return 'padding-left'
        if (dir === 'x') return 'padding-x'
        if (dir === 'y') return 'padding-y'
        return 'padding'
      },
    },

    // Colors - Text, Background, Border
    {
      classes: [/^(?:text|color)-(?:[a-z]+(?:-\d+)?|\[.+\])$/],
      extractor: () => 'text-color',
    },
    {
      classes: [/^bg-(?:[a-z]+(?:-\d+)?|\[.+\])$/],
      extractor: () => 'background-color',
    },
    {
      classes: [/^border-(?:[a-z]+(?:-\d+)?|\[.+\])$/],
      extractor: () => 'border-color',
    },

    // Border width
    {
      classes: [/^(?:border|b)-(?:\d+|\[.+\])$/],
      extractor: () => 'border-width',
    },
    {
      classes: [/^(?:border|b)-(?:collapse|separate)$/],
      extractor: () => 'border-collapse',
    },
  ],

  // Default joining function for class names
  join: (classes) => classes.join(' '),

  // Exclusion rules to handle special cases
  exclusionRules: [
    // When grid classes are present, exclude flex classes
    {
      when: (classNames) => classNames.some(
        (className) => className === 'grid' || className.startsWith('grid-'),
      ),
      exclude: ['flex', 'flex-col', 'flex-row', 'flex-row-reverse', 'flex-col-reverse']
    }
  ]
}
