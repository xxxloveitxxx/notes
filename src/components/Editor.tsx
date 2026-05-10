import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useShallow } from 'zustand/react/shallow';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Eye, Edit3, Columns, Maximize2, Minimize2, Link as LinkIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import type { ViewMode } from '../types';

export default function Editor() {
  const { notes, activeNoteId, updateNote, updateNoteTitle, setActiveNote } = useWorkspaceStore(
    useShallow((state) => ({
      notes: state.notes,
      activeNoteId: state.activeNoteId,
      updateNote: state.updateNote,
      updateNoteTitle: state.updateNoteTitle,
      setActiveNote: state.setActiveNote,
    }))
  );
  const [viewMode, setViewMode] = React.useState<ViewMode>('split');
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const activeNote = notes.find((n: any) => n.id === activeNoteId);
  if (!activeNote) return null;

  return (
    <div className={cn("flex flex-col flex-1 bg-white dark:bg-zinc-950 transition-all", isFullscreen && "fixed inset-0 z-50")}>
      <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
        <input
          type="text"
          value={activeNote.title}
          onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
          className="bg-transparent font-semibold focus:outline-none text-sm w-full"
          placeholder="Note Title"
        />
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-md">
            <button onClick={() => setViewMode('editor')} className={cn("p-1 rounded", viewMode === 'editor' && "bg-white dark:bg-zinc-800 shadow-sm")}><Edit3 size={14} /></button>
            <button onClick={() => setViewMode('split')} className={cn("p-1 rounded", viewMode === 'split' && "bg-white dark:bg-zinc-800 shadow-sm")}><Columns size={14} /></button>
            <button onClick={() => setViewMode('preview')} className={cn("p-1 rounded", viewMode === 'preview' && "bg-white dark:bg-zinc-800 shadow-sm")}><Eye size={14} /></button>
          </div>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">{isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {(viewMode === 'editor' || viewMode === 'split') && (
          <textarea
            value={activeNote.content}
            onChange={(e) => updateNote(activeNote.id, e.target.value)}
            className={cn("flex-1 p-8 resize-none focus:outline-none bg-transparent font-mono text-sm leading-relaxed", viewMode === 'split' && "border-r border-zinc-100 dark:border-zinc-900")}
            placeholder="Start writing..."
          />
        )}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 p-8 overflow-y-auto prose dark:prose-invert max-w-none">
            <ReactMarkdown components={{
                p: ({ children }) => {
                  if (typeof children === 'string') {
                    const parts = children.split(/(\[\[.*?\]\])/g);
                    return (<p>{parts.map((part, i) => {
                          if (part.startsWith('[[') && part.endsWith(']]')) {
                            const title = part.slice(2, -2);
                            const linkedNote = notes.find((n: any) => n.title.toLowerCase() === title.toLowerCase());
                            return (<button key={i} onClick={() => linkedNote && setActiveNote(linkedNote.id)} className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-medium transition-colors", linkedNote ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400")}>
                                <LinkIcon size={12} />{title}</button>);
                          }
                          return part;
                        })}</p>);
                  }
                  return <p>{children}</p>;
                }
              }}>{activeNote.content || '*No content yet*'}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
