import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Task } from '../types';

interface WorkspaceState {
  notes: Note[];
  activeNoteId: string | null;
  tasks: Task[];
  isDarkMode: boolean;
  isFocusMode: boolean;
  
  addNote: (title?: string) => void;
  updateNote: (id: string, content: string) => void;
  updateNoteTitle: (id: string, title: string) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  toggleDarkMode: () => void;
  toggleFocusMode: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      notes: [],
      activeNoteId: null,
      tasks: [],
      isDarkMode: false,
      isFocusMode: false,

      addNote: (title = 'Untitled') => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title,
          content: '',
          updatedAt: Date.now(),
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }));
      },

      updateNote: (id, content) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, content, updatedAt: Date.now() } : n
          ),
        }));
      },

      updateNoteTitle: (id, title) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, title, updatedAt: Date.now() } : n
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        }));
      },

      setActiveNote: (id) => set({ activeNoteId: id }),

      addTask: (text) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: Date.now(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
    }),
    {
      name: 'workspace-storage',
    }
  )
);
