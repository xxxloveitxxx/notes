import React from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Trash2, CheckCircle2, Circle, Sparkles, ChevronDown, ChevronRight, Clock, Info, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Task, SubTask } from '../types';

const Tasks = () => {
  const { tasks, addTask, toggleTask, deleteTask, toggleSubTask, smartExpandTask } = useWorkspaceStore();
  const [newTaskText, setNewTaskText] = React.useState('');
  const [expandedTasks, setExpandedTasks] = React.useState<Set<string>>(new Set());

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedTasks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTasks(next);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 border-t border-zinc-200 dark:border-zinc-800">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-900">
        <h2 className="font-semibold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            Tasks <Sparkles size={12} className="text-amber-500 animate-pulse"/>
        </h2>
      </div>
      <form onSubmit={handleAddTask} className="p-4">
        <input value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} type="text" placeholder="Add task..." className="w-full p-2 bg-zinc-100 dark:bg-zinc-900 rounded-md text-sm outline-none" />
      </form>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {tasks.map((task: Task) => (
          <div key={task.id} className="mb-2">
            <div className="group flex items-start gap-3 py-2 border-b border-zinc-50 dark:border-zinc-900/50 last:border-0">
              <button onClick={() => toggleTask(task.id)} className="mt-0.5">{task.completed ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-zinc-300" />}</button>
              <div className="flex-1 min-w-0 flex items-center gap-2 text-sm">
                    <span className={cn("font-medium", task.completed && 'line-through text-zinc-400')}>{task.text}</span>
                    {task.isAIExpanding && <Loader2 size={12} className="animate-spin text-zinc-400" />}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <button onClick={() => toggleExpand(task.id)}>{expandedTasks.has(task.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
                    )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!task.subtasks?.length && !task.isAIExpanding && <button onClick={() => smartExpandTask(task.id)} className="p-1 text-amber-500"><Sparkles size={12}/></button>}
                <button onClick={() => deleteTask(task.id)} className="p-1 hover:text-red-500"><Trash2 size={12}/></button>
              </div>
            </div>
            {expandedTasks.has(task.id) && task.subtasks?.map((sub: SubTask) => (
                <div key={sub.id} className="ml-7 mt-2 pl-3 border-l-2 border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-start gap-2">
                        <button onClick={() => toggleSubTask(task.id, sub.id)} className="mt-0.5">{sub.completed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Circle size={14} className="text-zinc-300" />}</button>
                        <div>
                            <p className={cn("text-xs font-medium", sub.completed && "line-through text-zinc-400")}>{sub.text}</p>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400">
                                <span className="flex items-center gap-1"><Clock size={10}/> {sub.duration}</span>
                                <span className="flex items-center gap-1"><Info size={10}/> {sub.how}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
