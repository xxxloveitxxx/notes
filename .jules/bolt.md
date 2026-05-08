## 2025-05-14 - [Zustand Store Subscription Bottleneck]
**Learning:** Destructuring the entire store from a Zustand hook (e.g., `const { ... } = useWorkspaceStore()`) causes the component to re-render on *any* store change, even if the used properties didn't change. This is especially problematic in the root `App` component, as it triggers a full-tree re-render on every keystroke in the editor.
**Action:** Use specific selectors or `useShallow` to subscribe only to the necessary state slices to isolate re-renders and improve UI responsiveness.
