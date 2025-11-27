
import React, { useState, useEffect } from 'react';
import { Task, ExecutorType, ASPECT_RATIOS, IMAGE_SIZES, ImageGenerationConfig } from '../types';
import { Bot, User, Wrench, Play, Copy, Loader2, Image as ImageIcon, Type, Sparkles, Terminal } from 'lucide-react';
import { executeAITextTask, executeAIImageTask } from '../services/geminiService';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateTask }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [imageConfig, setImageConfig] = useState<ImageGenerationConfig>({
    aspectRatio: '1:1',
    imageSize: '1K'
  });

  // Reset local state when task changes
  useEffect(() => {
    setMode('text');
    setIsExecuting(false);
  }, [task.id]);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      if (mode === 'image') {
        const imageUrl = await executeAIImageTask(task.actionable_content, imageConfig);
        onUpdateTask(task.id, { 
          status: 'completed', 
          result: imageUrl,
          resultType: 'image'
        });
      } else {
        const textResult = await executeAITextTask(task.actionable_content);
        onUpdateTask(task.id, { 
          status: 'completed', 
          result: textResult,
          resultType: 'text'
        });
      }
    } catch (error) {
      console.error("Execution failed", error);
      alert("Something went wrong while executing the task. Please try again.");
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderExecutorHeader = () => {
    switch (task.executor_type) {
      case ExecutorType.AI:
        return (
          <div className="flex items-center gap-3 text-purple-900 mb-4">
            <div className="p-2 bg-purple-200 border-2 border-purple-900 pixel-shadow-sm"><Bot className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-pixel uppercase">AI Intelligence</h3>
              <p className="text-sm text-slate-500 font-retro">Gemini 3 Pro + Image Preview</p>
            </div>
          </div>
        );
      case ExecutorType.HUMAN:
        return (
           <div className="flex items-center gap-3 text-orange-900 mb-4">
            <div className="p-2 bg-orange-200 border-2 border-orange-900 pixel-shadow-sm"><User className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-pixel uppercase">Human Execution</h3>
              <p className="text-sm text-slate-500 font-retro">Requires physical presence</p>
            </div>
          </div>
        );
      case ExecutorType.TOOL:
        return (
           <div className="flex items-center gap-3 text-blue-900 mb-4">
            <div className="p-2 bg-blue-200 border-2 border-blue-900 pixel-shadow-sm"><Wrench className="w-6 h-6" /></div>
             <div>
              <h3 className="font-bold text-sm text-slate-900 font-pixel uppercase">SaaS Tool</h3>
              <p className="text-sm text-slate-500 font-retro">Standardized software process</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white pixel-border pixel-shadow h-full flex flex-col overflow-hidden relative">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-slate-900 z-10" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-slate-900 z-10" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-900 z-10" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-900 z-10" />

      {/* Header */}
      <div className="p-4 md:p-6 border-b-2 border-slate-900 bg-slate-50">
        {renderExecutorHeader()}
        <h2 className="text-xl font-bold text-slate-900 mb-2 font-pixel leading-tight">{task.task_name}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        
        {/* The "Actionable Content" Block */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-pixel">
              {task.executor_type === ExecutorType.AI ? 'Prompt Strategy' : 
               task.executor_type === ExecutorType.HUMAN ? 'Your Action List' : 'Tool Recommendation'}
            </label>
            <button 
              onClick={() => copyToClipboard(task.actionable_content)}
              className="text-slate-400 hover:text-slate-900 transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-slate-100 p-4 text-slate-700 text-sm font-mono border-2 border-slate-300 relative">
            <Terminal className="w-4 h-4 absolute top-2 right-2 text-slate-300" />
            {task.actionable_content}
          </div>
        </div>

        {/* Execution Controls (Only for AI) */}
        {task.executor_type === ExecutorType.AI && (
          <div className="space-y-4 pt-4 border-t-2 border-dashed border-slate-200">
            <div className="flex items-center gap-2 mb-2">
               <label className="text-xs font-bold text-purple-600 uppercase tracking-widest font-pixel">Gemini Studio</label>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 border-2 border-slate-300 w-fit">
              <button 
                onClick={() => setMode('text')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold font-pixel transition-all ${mode === 'text' ? 'bg-white text-slate-900 border-2 border-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Type className="w-4 h-4" /> Text
              </button>
              <button 
                onClick={() => setMode('image')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold font-pixel transition-all ${mode === 'image' ? 'bg-purple-100 text-purple-900 border-2 border-purple-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ImageIcon className="w-4 h-4" /> Image
              </button>
            </div>

            {/* Image Config Controls */}
            {mode === 'image' && (
              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 border-2 border-purple-200">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-purple-900 font-pixel">Ratio</label>
                  <select 
                    value={imageConfig.aspectRatio}
                    onChange={(e) => setImageConfig(prev => ({...prev, aspectRatio: e.target.value as any}))}
                    className="w-full bg-white border-2 border-purple-900 px-3 py-2 text-sm font-retro focus:outline-none shadow-[4px_4px_0px_0px_rgba(88,28,135,0.2)]"
                  >
                    {ASPECT_RATIOS.map(ratio => (
                      <option key={ratio} value={ratio}>{ratio}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-purple-900 font-pixel">Size</label>
                   <select 
                    value={imageConfig.imageSize}
                    onChange={(e) => setImageConfig(prev => ({...prev, imageSize: e.target.value as any}))}
                    className="w-full bg-white border-2 border-purple-900 px-3 py-2 text-sm font-retro focus:outline-none shadow-[4px_4px_0px_0px_rgba(88,28,135,0.2)]"
                  >
                    {IMAGE_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button 
              onClick={handleExecute}
              disabled={isExecuting}
              className={`
                w-full flex items-center justify-center gap-2 py-4 font-bold text-white transition-all pixel-btn border-2 border-black pixel-shadow
                ${mode === 'image' 
                  ? 'bg-purple-600 hover:bg-purple-500' 
                  : 'bg-slate-900 hover:bg-slate-800'
                }
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {isExecuting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span className="font-pixel text-xs">{isExecuting ? 'PROCESSING...' : mode === 'image' ? 'GENERATE PIXELS' : 'RUN PROMPT'}</span>
            </button>
          </div>
        )}

        {/* Results Area */}
        {task.result && (
          <div className="pt-6 border-t-2 border-dashed border-slate-200 animate-pixel-drop">
             <label className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2 font-pixel">
              <Sparkles className="w-3 h-3" /> Result
            </label>
            
            {task.resultType === 'image' ? (
              <div className="relative group border-4 border-slate-900 bg-slate-100 p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <img src={task.result} alt="Generated Result" className="w-full h-auto object-contain max-h-[500px]" />
                <a 
                  href={task.result} 
                  download="project-popcorn-generated.png"
                  className="absolute bottom-4 right-4 bg-white text-slate-900 px-4 py-2 text-xs font-bold border-2 border-black pixel-shadow hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-pixel"
                >
                  DOWNLOAD
                </a>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-slate-900 bg-green-50 p-4 border-2 border-green-800 font-retro shadow-[4px_4px_0px_0px_rgba(22,101,52,0.3)]">
                 <p className="whitespace-pre-wrap">{task.result}</p>
              </div>
            )}
          </div>
        )}

        {/* Manual/Tool Placeholder */}
        {task.executor_type !== ExecutorType.AI && !task.result && (
           <div className="pt-6 border-t-2 border-dashed border-slate-200 text-center py-10">
              <p className="text-slate-400 text-base font-retro mb-4">This task requires physical execution.</p>
              <button 
                onClick={() => onUpdateTask(task.id, { status: 'completed', result: "Marked as done by user." })}
                className="text-slate-900 font-bold hover:underline text-xs font-pixel"
              >
                MARK AS COMPLETED
              </button>
           </div>
        )}
      </div>
    </div>
  );
};
