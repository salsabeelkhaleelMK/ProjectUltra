# Motork future/primitives Dialog – reference

This doc summarizes what is readable from the Motork component library **future namespace** and how AddTagModal is aligned to it.

## Can we read the Motork future namespace?

**Yes.** The following are readable:

- **Package exports**: `package.json` exports `./future/primitives` → `dist/future/primitives.js` and `dist/future/primitives/index.d.ts`.
- **Dialog exports**: `dist/future/primitives/dialog/index.d.ts` exports `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`.
- **Component APIs**: `.d.ts` files for each dialog part (e.g. `dialog-content.vue.d.ts`) define props and slots. For example, `DialogContent` has `showCloseButton?: boolean` and `class?: HTMLAttributes['class']`.
- **Documentation**: `dist/llms/future-primitives-dialog.txt` contains the Dialog doc and **canonical examples** (Demo, Custom close button) with exact template structure.
- **Stories**: `dialog.stories.d.ts` confirms `DialogContent` props (`showCloseButton`, `class`, etc.) and that stories use `DialogClose as-child` with `Button`.

The library ships only **compiled output** (`dist/`): no raw `.vue` source. So we cannot see the exact template/markup of `DialogContent` (e.g. how the X close button is rendered), but we can rely on the types, exports, and documented examples.

## Imports

Imports from `@motork/component-library/future/primitives` are correct:

- The package resolves that path to `dist/future/primitives.js`, which re-exports all dialog components (e.g. `Ma as Dialog`, `Sa as DialogClose`, `Ta as DialogContent`, …).
- If the X or layout looked wrong, it is more likely due to **usage** (structure, props, or extra wrappers) than a wrong import path. If you ever see missing components or runtime errors, double-check that the project resolves `node_modules/@motork/component-library` and that there are no duplicate or stale copies of the library.

## Reference structure (from Motork dialog examples)

From `future-primitives-dialog.txt`:

- **Dialog** wraps everything (controlled: `:open="show"` and `@update:open`).
- **DialogPortal** + **DialogOverlay** for controlled dialogs (stories use DialogTrigger; we use Portal + Overlay).
- **DialogContent** with `class="sm:max-w-md"` (or `sm:max-w-[425px]`). No `max-h` or `flex flex-col` in the examples.
- **DialogHeader** → **DialogTitle** (and optionally **DialogDescription**).
- Body: a single **`<div class="grid gap-4">`** with form fields. No `flex-1 overflow-y-auto`, no extra `px-6 py-4` in the examples (DialogContent may provide its own padding).
- **DialogFooter** with **DialogClose as-child** wrapping the cancel **Button**, and a primary **Button** for submit/save.

So the reference uses:

- Simple content layout: `grid gap-4`, no greedy flex middle.
- **showCloseButton** on DialogContent when the library X is desired.
- **DialogClose as-child** with a **Button** for the cancel action.

AddTagModal is aligned to this structure and props so that layout, footer visibility, and the close button match the Motork dialog reference.
