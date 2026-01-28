# Motork future Dialog – how it’s built and why header/footer show

## Source

- **Base:** Reka UI (`reka-ui`) – Radix-style primitives for Vue.
- **Motork layer:** `@motork/component-library/future/primitives` wraps Reka’s Dialog and adds:
  - `showCloseButton` (default `true`) – X in top-right.
  - Merged `class` with library defaults.

## DialogContent (Motork)

From the bundle (`dialog-content` component, ~L20316):

1. Renders inside a portal.
2. Wraps Reka’s `DialogContent` (Ko) with a root that has **default classes**:
   - `bg-background ... fixed top-[50%] left-[50%] z-50 **grid** w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] **gap-4** rounded-lg border **p-6** shadow-lg ... sm:max-w-lg`
3. Our `class` prop is merged with those defaults via `cn(libraryDefaults, props.class)`.
4. **Slot content** is rendered inside that root; then, if `showCloseButton`, the close button is added as a **sibling** with `absolute top-4 right-4`.

So the DOM is roughly:

```text
div (DialogContent root: grid, gap-4, p-6 + our class)
├── [our default slot]
│   ├── DialogHeader  → div[data-slot="dialog-header"] (flex flex-col gap-2 ...)
│   ├── our body (e.g. scroll wrapper + form)
│   └── DialogFooter  → div[data-slot="dialog-footer"] (flex flex-col-reverse gap-2 sm:flex-row sm:justify-end)
└── [optional] close button (absolute top-4 right-4)
```

## DialogHeader (Motork)

- Renders a **div** with `data-slot="dialog-header"`.
- Default class: `flex flex-col gap-2 text-center sm:text-left`.
- No height/overflow; it just wraps the slot (title + description).

## DialogFooter (Motork)

- Renders a **div** with `data-slot="dialog-footer"`.
- Default class: `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`.
- No fixed position; it’s a normal flow child of the DialogContent root.

## Why the demo looks correct

In the **Edit profile** demo (future-primitives-dialog.txt):

- Content is short: title, description, two fields (name, username), then footer with Cancel + Save.
- The dialog doesn’t need to scroll; everything fits, so the header and footer are visible.

In **AddVehicleModal**:

- Content is long (many fields). Without a fixed height and a scrollable middle:
  - The DialogContent root can grow with content.
  - The whole dialog becomes taller than the viewport, so the footer is below the fold and not visible.

So the library doesn’t “hide” the footer; the footer is just the last child of a container that grows with content.

## What we need for long forms

1. **Fixed height** on the DialogContent root so the dialog doesn’t grow past the viewport:  
   e.g. `h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]`.
2. **Flex or grid layout** on that root so we have:
   - header: natural height,
   - body: takes remaining space and scrolls,
   - footer: natural height, always at the bottom.
3. Our **body** must be the only scrollable part (`overflow-y-auto`, `min-h-0` / `flex-1` or grid row with `1fr`).

We already do this in AddVehicleModal with an inner wrapper and grid/flex. If the footer still doesn’t show, the next suspect is the **reka layer**: Reka’s DialogContent wraps our slot in FocusScope → DismissableLayer; the **class we pass** is applied to DismissableLayer’s root. If that root doesn’t get our height/flex (e.g. overridden or not applied), the layout won’t constrain and the footer can stay off-screen. In that case, a small override in `main.css` for the dialog content wrapper (e.g. by `[data-slot="dialog-content"]` or a class we add) can force `display: flex`, `height`, and `overflow: hidden` so the inner header/scroll/footer layout works and the buttons stay visible.
