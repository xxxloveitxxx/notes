## 2025-05-14 - Granular Zustand Selectors
**Learning:** Components that consume the Zustand store by destructuring the entire state object re-render whenever any part of the store changes, even if the specific properties they use remain the same. This is a common performance bottleneck in large stores.
**Action:** Always use granular selectors combined with `useShallow` from `zustand/react/shallow` to isolate component re-renders to only the relevant state changes.
