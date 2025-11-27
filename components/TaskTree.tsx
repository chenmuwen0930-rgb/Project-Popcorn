import React from 'react';
import { Task, ExecutorType } from '../types';
import { Bot, User, Wrench, CheckSquare, Square } from 'lucide-react';

interface TaskTreeProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectTask: (id: string) => void;
}

export const TaskTree: React.FC<TaskTreeProps> = ({ tasks, activeTaskId, onSelectTask }) => {
  return (
    <div className="h-full overflow-y-auto pr-4 custom-scrollbar">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-2 font-pixel flex items-center gap-2">
        <span className="w-2 h-2 bg-slate-900 inline-block"></span>
        Mission Control
      </h3>
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const isActive = activeTaskId === task.id;
          const isCompleted = task.status === 'completed';

          return (
            <div
              key={task.id}
              onClick={() => onSelectTask(task.id)}
              style={{ animationDelay: `${index * 0.15}s` }}
              className={`
                animate-pixel-drop opacity-0
                relative flex items-start gap-3 p-4 cursor-pointer transition-all pixel-border pixel-btn
                ${isActive 
                  ? 'bg-yellow-100 pixel-shadow translate-x-[-2px] translate-y-[-2px]' 
                  : 'bg-white hover:bg-slate-50 pixel-shadow-sm hover:pixel-shadow'
                }
              `}
            >
              {/* Pixel Connection Line (Visual only, distinct from smooth lines) */}
              {index !== tasks.length - 1 && (
                <div className="absolute left-[23px] top-14 bottom-[-24px] w-[4px] bg-slate-200 -z-10 border-x border-slate-300 pattern-dots" />
              )}

              <div className={`
                mt-0.5 shrink-0 transition-colors
                ${isCompleted ? 'text-green-600' : isActive ? 'text-slate-900' : 'text-slate-300'}
              `}>
                {isCompleted ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`
                    text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider font-pixel border-2
                    ${task.executor_type === ExecutorType.AI ? 'bg-purple-100 text-purple-900 border-purple-900' : ''}
                    ${task.executor_type === ExecutorType.HUMAN ? 'bg-orange-100 text-orange-900 border-orange-900' : ''}
                    ${task.executor_type === ExecutorType.TOOL ? 'bg-blue-100 text-blue-900 border-blue-900' : ''}
                  `}>
                    {task.executor_type}
                  </span>
                </div>
                <h4 className={`text-sm font-bold truncate font-pixel leading-tight mb-1 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                  {task.task_name}
                </h4>
                <p className="text-sm text-slate-500 truncate font-retro">
                  {task.actionable_content}
                </p>
              </div>

              {/* Icon for type */}
              <div className="text-slate-400 border-2 border-transparent p-1">
                {task.executor_type === ExecutorType.AI && <Bot className="w-4 h-4" />}
                {task.executor_type === ExecutorType.HUMAN && <User className="w-4 h-4" />}
                {task.executor_type === ExecutorType.TOOL && <Wrench className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};