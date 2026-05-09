## 2025-05-15 - Zustand Re-render Optimization
**Learning:** Destructuring the entire state from a Zustand store (e.g., `const { ... } = useStore()`) causes the component to re-render on *every* state change in the store, even if the specific fields used by the component didn't change. This is especially problematic in the root `App` component as it triggers a full-tree re-render.
**Action:** Use granular selectors for primitive values and `useShallow` for object/array slices to isolate re-renders. Always favor `useStore(state => state.field)` over destructuring the whole hook.
