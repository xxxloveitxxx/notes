import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Plus, StickyNote, Trash2, Search } from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
  const { notes, activeNoteId, addNote, setActiveNote, deleteNote } = useWorkspaceStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50">
      <div className="p-4 flex items-center justify-between">
        <h1 className="font-bold text-lg tracking-tight">Workspace</h1>
        <button 
          onClick={() => addNote()}
          className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 text-zinc-400" size={14} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => setActiveNote(note.id)}
            className={cn(
              "group flex items-center justify-between px-3 py-2 mb-1 rounded-md cursor-pointer transition-all",
              activeNoteId === note.id 
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" 
                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <StickyNote size={14} className="shrink-0" />
              <span className="truncate text-sm font-medium">{note.title || 'Untitled'}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
