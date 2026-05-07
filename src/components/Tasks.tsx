import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

const Tasks = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useWorkspaceStore();
  const [newTaskText, setNewTaskText] = React.useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 border-t border-zinc-200 dark:border-zinc-800">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-400">Tasks</h2>
      </div>

      <form onSubmit={handleAddTask} className="p-4">
        <div className="relative">
          <Plus className="absolute left-2.5 top-2.5 text-zinc-400" size={14} />
          <input
            type="text"
            placeholder="Add task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-900 border-none rounded-md focus:ring-1 focus:ring-zinc-400"
          />
        </div>
      </form>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-start gap-3 py-2 border-b border-zinc-50 dark:border-zinc-900/50 last:border-0"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="mt-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              {task.completed ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <Circle size={16} />
              )}
            </button>
            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
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

export default Tasks;
