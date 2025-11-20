import React from 'react';
import { Interaction, InteractionType } from '../types';
import { Mail, MessageSquare, Phone, Users, Bot, AlertCircle, Zap } from 'lucide-react';

interface InteractionLogProps {
  interactions: Interaction[];
}

const getIcon = (type: InteractionType) => {
  switch (type) {
    case InteractionType.EMAIL: return <Mail className="w-4 h-4" />;
    case InteractionType.MEETING: return <Users className="w-4 h-4" />;
    case InteractionType.CALL: return <Phone className="w-4 h-4" />;
    case InteractionType.WECHAT: return <MessageSquare className="w-4 h-4" />;
    default: return <MessageSquare className="w-4 h-4" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  if (score >= 5) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  return 'text-red-500 bg-red-500/10 border-red-500/20';
};

export const InteractionLog: React.FC<InteractionLogProps> = ({ interactions }) => {
  // Sort by date descending
  const sorted = [...interactions].sort((a, b) => b.createdAt - a.createdAt);

  if (interactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p>No interactions recorded.</p>
        <p className="text-sm">Start logging to activate the Pilot.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pl-2 ml-1 border-l border-slate-800">
      {sorted.map((log) => (
        <div key={log.id} className="relative animate-fade-in group">
          {/* Dot on timeline */}
          <div className="absolute -left-[13px] top-1 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-900 group-hover:bg-sky-500 transition-colors"></div>
          
          <div className="flex flex-col gap-3 pl-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wide font-semibold">
              <span className="text-sky-500">{log.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {getIcon(log.type)} {log.type}
              </span>
            </div>
            
            {/* User Content */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800 text-slate-300 text-sm leading-relaxed shadow-sm group-hover:border-slate-700 transition-colors">
              {log.content}
            </div>

            {/* Historical AI Feedback (Small inline summary) */}
            {/* Note: Detailed feedback is now in the Right Panel, but we keep a record here for history */}
            {log.aiFeedback && (
              <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                 <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getScoreColor(log.aiFeedback.critical_score)}`}>
                    Score: {log.aiFeedback.critical_score}
                 </div>
                 <div className="text-[10px] text-slate-500 truncate max-w-md">
                    Mistake: {log.aiFeedback.mistakes[0]}
                 </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
