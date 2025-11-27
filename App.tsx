
import React, { useState } from 'react';
import { InputHero } from './components/InputHero';
import { TaskTree } from './components/TaskTree';
import { TaskCard } from './components/TaskCard';
import { generateProjectPlan } from './services/geminiService';
import { Task, ProjectPlan } from './types';
import { LayoutDashboard, LogOut, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleIdeaSubmit = async (idea: string) => {
    setIsLoading(true);
    try {
      // The InputHero component handles the visual "Unbundle" animation during isLoading state
      const tasks = await generateProjectPlan(idea);
      
      setProjectPlan({
        originalIdea: idea,
        tasks: tasks
      });
      // Note: We do NOT auto-select the first task anymore. 
      // This allows the user to see the full "Tree" structure first (the Unbundled result).
      setActiveTaskId(null);
    } catch (error) {
      alert("Failed to generate plan. Please try again with a clearer prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setProjectPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
      };
    });
  };

  const activeTask = projectPlan?.tasks.find(t => t.id === activeTaskId);

  if (!projectPlan) {
    return <InputHero onSubmit={handleIdeaSubmit} isLoading={isLoading} />;
  }

  return (
    <div className="h-screen flex flex-col bg-pixel-pattern overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b-2 border-slate-900 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 pixel-shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-slate-900 p-1.5 border-2 border-slate-900">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-slate-900 leading-none font-pixel text-sm tracking-wider truncate">PROJECT POPCORN</h1>
            <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px] md:max-w-[300px] font-retro">{projectPlan.originalIdea}</p>
          </div>
        </div>
        <button 
          onClick={() => setProjectPlan(null)}
          className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-2 font-pixel border-2 border-transparent hover:border-red-100 p-2"
        >
          <LogOut className="w-4 h-4" /> <span className="hidden md:inline">RESTART</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-4 md:p-6 gap-6 relative">
        
        {/* Left Sidebar - Task Tree (Rebundle) */}
        {/* Responsive Logic: Hidden on mobile if a task is active. Always visible on Desktop. */}
        <aside className={`
          flex-col h-full
          w-full md:w-[350px] shrink-0
          ${activeTaskId ? 'hidden md:flex' : 'flex'}
        `}>
          <TaskTree 
            tasks={projectPlan.tasks} 
            activeTaskId={activeTaskId} 
            onSelectTask={setActiveTaskId} 
          />
        </aside>

        {/* Right Content - Execution Card */}
        {/* Responsive Logic: Visible on mobile ONLY if task is active. Always visible on Desktop. */}
        <section className={`
          flex-1 min-w-0 h-full flex-col
          ${activeTaskId ? 'flex' : 'hidden md:flex'}
        `}>
          {activeTask ? (
            <div className="flex flex-col h-full w-full">
              {/* Mobile Back Button */}
              <button 
                onClick={() => setActiveTaskId(null)}
                className="md:hidden mb-4 flex items-center gap-2 text-slate-600 font-bold font-pixel group shrink-0"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                BACK TO MISSIONS
              </button>
              
              {/* Task Card Container */}
              <div className="flex-1 min-h-0">
                <TaskCard 
                  task={activeTask} 
                  onUpdateTask={handleUpdateTask} 
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 border-4 border-dashed border-slate-300 bg-white/50 pixel-border">
              <span className="font-retro text-xl">Select a pixel block to begin...</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;