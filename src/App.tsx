import { useEffect } from 'react';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Tasks from './components/Tasks';
import Timer from './components/Timer';
import CommandPalette from './components/CommandPalette';

function App() {
  const { isDarkMode, activeNoteId, isFocusMode } = useWorkspaceStore();

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {!isFocusMode && <Sidebar />}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeNoteId ? <Editor /> : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4 text-sm">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <span className="text-2xl font-bold text-zinc-300">W</span>
            </div>
            <p>Select a note or press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700 text-[10px]">⌘ K</kbd> to start</p>
          </div>
        )}
      </main>
      {!isFocusMode && (
        <aside className="w-80 border-l border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
          <Timer />
          <Tasks />
        </aside>
      )}
      {isFocusMode && (
        <div className="fixed bottom-6 right-6 z-50">
           <button onClick={() => useWorkspaceStore.getState().toggleFocusMode()} className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-lg text-xs font-medium">Exit Focus Mode</button>
        </div>
      )}
      <CommandPalette />
    </div>
  );
}
export default App;
