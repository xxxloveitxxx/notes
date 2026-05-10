import { useShallow } from 'zustand/react/shallow';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Plus, StickyNote, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const { notes, activeNoteId, addNote, setActiveNote, deleteNote } = useWorkspaceStore(
    useShallow((state) => ({
      notes: state.notes,
      activeNoteId: state.activeNoteId,
      addNote: state.addNote,
      setActiveNote: state.setActiveNote,
      deleteNote: state.deleteNote,
    }))
  );
  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50">
      <div className="p-4 flex items-center justify-between font-bold text-lg">Workspace <button onClick={() => addNote()} className="hover:bg-zinc-200 dark:hover:bg-zinc-800 p-1 rounded"><Plus size={18}/></button></div>
      <div className="flex-1 overflow-y-auto px-2">
        {notes.map((n: any) => (
          <div key={n.id} onClick={() => setActiveNote(n.id)} className={cn("group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm font-medium", activeNoteId === n.id ? "bg-zinc-200 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50")}>
            <span className="truncate flex items-center gap-2"><StickyNote size={14}/> {n.title || 'Untitled'}</span>
            <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"><Trash2 size={12}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
