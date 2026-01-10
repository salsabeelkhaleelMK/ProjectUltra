---
description: "Use MotorK Component Library documentation when working with @motork/component-library components"
globs:
alwaysApply: false
---

# MotorK Component Library

When working with components from `@motork/component-library`, use the bundled documentation to understand component APIs, props, and usage patterns.

## Documentation Files

The component library includes AI-optimized documentation:

- **llms.txt**: Summary of all available components
- **llms-full.txt**: Comprehensive documentation with all component details
- **llms/**: Individual component documentation files

## How to Use

When asked to work with MotorK components, reference the documentation:

@node_modules/@motork/component-library/dist/llms.txt
@node_modules/@motork/component-library/dist/llms-full.txt

## Guidelines

1. **Check available components** - Review llms.txt for a list of all components
2. **Read component docs** - Use llms-full.txt or individual files in llms/ for detailed API information
3. **Follow patterns** - Use the documented props, slots, and events as specified
4. **Import correctly** - Components are exported from `@motork/component-library` or subpaths like `@motork/component-library/future/components`

## Example Import

```vue
<script setup lang="ts">
import { Button, DataTable, Modal } from '@motork/component-library';
// Or from future components
import { Filters, Command } from '@motork/component-library/future/components';
</script>
```
