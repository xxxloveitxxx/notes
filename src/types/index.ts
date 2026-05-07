export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type ViewMode = 'editor' | 'preview' | 'split';
