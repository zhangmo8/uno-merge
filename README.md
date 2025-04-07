# uno-merge WIP 🚧

Utility function to efficiently merge UnoCSS classes without style conflicts.

## Install

```bash
npm i uno-merge
```

## Usage

```js
import { unoMerge } from 'uno-merge'

// Merges classes and resolves conflicts
unoMerge('text-red text-lg', 'text-blue text-center')
// => 'text-lg text-blue text-center'

// Later classes override earlier ones with the same utility
unoMerge('bg-red-500 p-2', 'bg-blue-500')
// => 'p-2 bg-blue-500'

// Handles complex utility combinations
unoMerge('flex flex-col items-start', 'grid grid-cols-2')
// => 'grid grid-cols-2 items-start'
```

## Features

- Resolves conflicts between UnoCSS utility classes
- Works with arbitrary values and variants
- Supports dynamic class merging
- Fully typed with TypeScript
- Zero dependencies

## License

[MIT](./LICENSE) License 2025 [zhangmo8](https://github.com/zhangmo8)
