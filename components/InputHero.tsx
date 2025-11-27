import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Terminal } from 'lucide-react';

interface InputHeroProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export const InputHero: React.FC<InputHeroProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [loadingLog, setLoadingLog] = useState<string[]>([]);

  useEffect(() => {
    if (isLoading) {
      const logs = [
        "Analyzing user brainwaves...",
        "Heating up kernels...",
        "Unbundling complex logic...",
        "Sprinkling creative salt...",
        "Rebundling into reality...",
        "Compiling pixel perfect plans...",
        "Almost ready to pop..."
      ];
      let i = 0;
      setLoadingLog([]);
      const interval = setInterval(() => {
        setLoadingLog(prev => [...prev.slice(-3), logs[i % logs.length]]);
        i++;
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingLog([]);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onSubmit(idea);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-pixel-pattern relative overflow-hidden">
      
      {/* Decorative Floating Pixels */}
      <div className="absolute top-20 left-20 w-8 h-8 bg-yellow-400 pixel-border pixel-shadow animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-40 right-20 w-12 h-12 bg-purple-400 pixel-border pixel-shadow animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 right-1/4 w-6 h-6 bg-blue-400 pixel-border pixel-shadow animate-float" style={{ animationDelay: '0.5s' }} />

      <div className={`z-10 max-w-2xl w-full text-center space-y-8 transition-all duration-500 ${isLoading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <div className="space-y-4">
           <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-slate-900 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest pixel-shadow-sm font-pixel">
              Project Popcorn
            </span>
           </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight font-pixel">
            POP YOUR IDEAS<br/>
            <span className="text-purple-600">INTO ACTION</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto font-retro">
            Unbundle your thoughts. Rebundle your reality. Turn abstract ideas into pixel-perfect plans with AI + Humans + Tools.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto group">
          <div className="relative flex items-center bg-white p-2 pixel-border pixel-shadow hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transition-all duration-200">
            <div className="pl-4 text-slate-900">
              <Sparkles className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="I want to start a pixel art game studio..."
              className="w-full bg-transparent border-none p-4 text-lg font-retro text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !idea.trim()}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-6 py-3 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-l-2 border-slate-900"
            >
                <span className="font-pixel text-sm">POP!</span>
                <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-4 text-sm font-retro font-medium text-slate-600">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500" /> Powered by Gemini 2.5 Flash
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500" /> 4K Image Generation
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500" /> Instant Breakdown
          </span>
        </div>
      </div>

      {/* Popcorn Loading Animation Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-white/90 backdrop-blur-sm">
          
          {/* Popcorn Animation */}
          <div className="relative mb-6">
             <div className="w-24 h-24 flex items-center justify-center">
               <div className="popcorn-kernel w-12 h-12 bg-yellow-400 pixel-border pixel-shadow" />
             </div>
             {/* Pop particles */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="particle p1 w-2 h-2 bg-yellow-300 absolute top-1/2 left-1/2" />
                <div className="particle p2 w-2 h-2 bg-red-400 absolute top-1/2 left-1/2" />
                <div className="particle p3 w-2 h-2 bg-orange-400 absolute top-1/2 left-1/2" />
                <div className="particle p4 w-2 h-2 bg-yellow-500 absolute top-1/2 left-1/2" />
             </div>
          </div>

          {/* LARGE LOADING TEXT */}
          <h2 className="text-3xl font-bold text-slate-900 font-pixel mb-8 tracking-widest animate-pulse flex items-center gap-2">
             UNBUNDLING<span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '0.1s'}}>.</span><span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span>
          </h2>

          {/* Retro Terminal Log */}
          <div className="w-80 bg-slate-900 p-4 pixel-border pixel-shadow shadow-[8px_8px_0px_0px_rgba(30,41,59,0.5)]">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-700 pb-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-xs font-pixel text-green-400">GEMINI_KERNEL_V2.5</span>
            </div>
            <div className="font-mono text-xs text-green-400 space-y-1 h-20 overflow-hidden flex flex-col justify-end">
              {loadingLog.map((log, idx) => (
                <div key={idx} className="animate-pulse">&gt; {log}</div>
              ))}
              <div className="animate-bounce">_</div>
            </div>
          </div>

          <style>{`
            @keyframes shake {
              0% { transform: rotate(0deg) scale(1); background-color: #facc15; }
              25% { transform: rotate(5deg) scale(1.1); background-color: #facc15; }
              50% { transform: rotate(-5deg) scale(1.2); background-color: #fb923c; } /* Turning orange (hot) */
              75% { transform: rotate(5deg) scale(1.3); background-color: #f87171; } /* Turning red (very hot) */
              90% { transform: rotate(0deg) scale(0.5); opacity: 1; }
              100% { transform: scale(2); background-color: #fef08a; border-radius: 50%; opacity: 0; } /* POP! */
            }
            
            .popcorn-kernel {
              animation: shake 1.5s ease-in-out infinite;
            }

            @keyframes fly {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
            }

            .particle {
              opacity: 0;
              animation: fly 1.5s ease-out infinite;
            }
            .p1 { --tx: -40px; --ty: -40px; animation-delay: 1.4s; }
            .p2 { --tx: 40px; --ty: -50px; animation-delay: 1.4s; }
            .p3 { --tx: -30px; --ty: 30px; animation-delay: 1.4s; }
            .p4 { --tx: 50px; --ty: 20px; animation-delay: 1.4s; }
          `}</style>
        </div>
      )}
    </div>
  );
};