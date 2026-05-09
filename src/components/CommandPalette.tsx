import React from 'react';
import { Command } from 'cmdk';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useShallow } from 'zustand/react/shallow';
import { Plus, StickyNote, Moon, Sun, Search, Maximize2, Minimize2 } from 'lucide-react';
import type { Note } from '../types';

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { notes, addNote, setActiveNote, toggleDarkMode, isDarkMode, isFocusMode, toggleFocusMode } = useWorkspaceStore(
    useShallow((state) => ({
      notes: state.notes,
      addNote: state.addNote,
      setActiveNote: state.setActiveNote,
      toggleDarkMode: state.toggleDarkMode,
      isDarkMode: state.isDarkMode,
      isFocusMode: state.isFocusMode,
      toggleFocusMode: state.toggleFocusMode,
    }))
  );
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); } };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  const run = (cmd: () => void) => { cmd(); setOpen(false); };
  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Menu" className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-zinc-950/50 backdrop-blur-sm transition-all duration-200">
      <div className="w-full max-w-[640px] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="text-zinc-400 mr-2" size={18} />
          <Command.Input placeholder="Type a command..." className="w-full h-12 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100" />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
          <Command.Empty className="px-4 py-8 text-center text-sm text-zinc-500">No results found.</Command.Empty>
          <Command.Group heading="Actions" className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
            <Command.Item onSelect={() => run(() => addNote())} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800 transition-colors"> <Plus size={16} /> New Note </Command.Item>
            <Command.Item onSelect={() => run(() => toggleDarkMode())} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800 transition-colors"> {isDarkMode ? <Sun size={16} /> : <Moon size={16} />} Toggle Dark Mode </Command.Item>
            <Command.Item onSelect={() => run(() => toggleFocusMode())} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800 transition-colors"> {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />} {isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'} </Command.Item>
          </Command.Group>
          <Command.Group heading="Notes" className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 mb-1">
            {notes.map((n: Note) => ( <Command.Item key={n.id} onSelect={() => run(() => setActiveNote(n.id))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800 transition-colors"> <StickyNote size={16} /> {n.title || 'Untitled'} </Command.Item> ))}
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
