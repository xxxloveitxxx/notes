import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Task, SubTask } from '../types';
import { decomposeTask } from '../lib/groq';

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
  toggleSubTask: (taskId: string, subtaskId: string) => void;
  smartExpandTask: (taskId: string) => Promise<void>;
  toggleDarkMode: () => void;
  toggleFocusMode: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      tasks: [],
      isDarkMode: false,
      isFocusMode: false,
      addNote: (title = 'Untitled') => {
        const newNote: Note = { id: crypto.randomUUID(), title, content: '', updatedAt: Date.now() };
        set((state) => ({ notes: [newNote, ...state.notes], activeNoteId: newNote.id }));
      },
      updateNote: (id, content) => set((state) => ({ notes: state.notes.map((n) => n.id === id ? { ...n, content, updatedAt: Date.now() } : n) })),
      updateNoteTitle: (id, title) => set((state) => ({ notes: state.notes.map((n) => n.id === id ? { ...n, title, updatedAt: Date.now() } : n) })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id), activeNoteId: state.activeNoteId === id ? null : state.activeNoteId })),
      setActiveNote: (id) => set({ activeNoteId: id }),
      addTask: (text) => {
        const newTask: Task = { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        if (text.length > 10 || text.includes('...')) get().smartExpandTask(newTask.id);
      },
      toggleTask: (id) => set((state) => ({ tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      toggleSubTask: (taskId, subtaskId) => set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? { ...t, subtasks: t.subtasks?.map((st: SubTask) => st.id === subtaskId ? { ...st, completed: !st.completed } : st) } : t),
      })),
      smartExpandTask: async (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task || task.subtasks?.length) return;
        set((state) => ({ tasks: state.tasks.map((t) => t.id === taskId ? { ...t, isAIExpanding: true } : t) }));
        try {
          const activeNote = get().notes.find(n => n.id === get().activeNoteId);
          const result = await decomposeTask(task.text, activeNote?.content || "");
          const subtasks: SubTask[] = result.subtasks.map((st) => ({ id: crypto.randomUUID(), text: st.text, how: st.how, duration: st.duration, completed: false }));
          set((state) => ({ tasks: state.tasks.map((t) => t.id === taskId ? { ...t, subtasks, isAIExpanding: false } : t) }));
        } catch (error) {
          set((state) => ({ tasks: state.tasks.map((t) => t.id === taskId ? { ...t, isAIExpanding: false } : t) }));
        }
      },
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
    }),
    { name: 'workspace-storage' }
  )
);
