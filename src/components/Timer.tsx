import React from 'react';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import { cn } from '../lib/utils';

const Timer = () => {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(false);
  const [mode, setMode] = React.useState<'work' | 'break'>('work');

  React.useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Logic for switching modes could go here
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => {
            setMode('work');
            setTimeLeft(25 * 60);
            setIsActive(false);
          }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors",
            mode === 'work' ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
        >
          <Target size={12} />
          Work
        </button>
        <button
          onClick={() => {
            setMode('break');
            setTimeLeft(5 * 60);
            setIsActive(false);
          }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors",
            mode === 'break' ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
        >
          <Coffee size={12} />
          Break
        </button>
      </div>

      <div className="text-5xl font-mono font-bold tracking-tighter mb-6">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className="w-12 h-12 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-transform"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
