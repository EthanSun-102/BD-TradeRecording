import React from 'react';
import { Interaction, AiReflection } from '../types';
import { Bot, AlertTriangle, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

interface CriticPanelProps {
  latestInteraction: Interaction | undefined;
  isLoading: boolean;
}

export const CriticPanel: React.FC<CriticPanelProps> = ({ latestInteraction, isLoading }) => {
  const feedback = latestInteraction?.aiFeedback;

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-900 text-slate-500 border-b border-slate-800">
        <Bot className="w-8 h-8 animate-bounce mb-2 text-slate-600" />
        <p className="text-xs uppercase tracking-wider animate-pulse">The Critic is judging you...</p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-900 text-slate-600 border-b border-slate-800">
        <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
        <p className="text-sm">No recent critique available.</p>
        <p className="text-xs mt-1 opacity-50">Log an interaction to get roasted.</p>
      </div>
    );
  }

  const scoreColor = feedback.critical_score < 5 ? 'text-red-500' : feedback.critical_score < 8 ? 'text-amber-500' : 'text-emerald-500';
  const borderColor = feedback.critical_score < 5 ? 'border-red-500/30' : feedback.critical_score < 8 ? 'border-amber-500/30' : 'border-emerald-500/30';

  return (
    <div className="h-full flex flex-col bg-slate-900 border-b border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
          <Bot className="w-4 h-4 text-red-500" />
          Latest Critique
        </h2>
        <div className={`text-lg font-mono font-bold ${scoreColor}`}>
          {feedback.critical_score}/10
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Mistakes Section - The "Toxic" Highlight */}
        <div className={`bg-red-950/10 border ${borderColor} rounded-lg p-4`}>
          <h3 className="text-xs font-bold text-red-400 uppercase mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            Critical Errors
          </h3>
          <ul className="space-y-2">
            {feedback.mistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                <span className="leading-relaxed">{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Immediate Action */}
        <div>
          <h3 className="text-xs font-bold text-sky-500 uppercase mb-2 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Corrective Action
          </h3>
          <div className="flex items-start gap-3 bg-slate-800/50 p-3 rounded border border-slate-700">
            <ArrowRight className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {feedback.immediate_action}
            </p>
          </div>
        </div>

        {/* Context Note */}
        <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-800/50">
          Based on interaction from {latestInteraction?.date}
        </div>
      </div>
    </div>
  );
};
