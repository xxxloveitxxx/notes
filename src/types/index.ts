export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface SubTask {
  id: string;
  text: string;
  how: string;
  duration: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subtasks?: SubTask[];
  isAIExpanding?: boolean;
}

export type ViewMode = 'editor' | 'preview' | 'split';
