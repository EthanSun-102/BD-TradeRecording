import React, { useEffect } from 'react';
import { Deal, Interaction, InteractionType } from '../types';
import { InteractionLog } from './InteractionLog';
import { AddLogForm } from './AddLogForm';
import { CriticPanel } from './CriticPanel';
import { RadarPanel } from './RadarPanel';
import { DollarSign, Calendar, Tag } from 'lucide-react';

interface ClientDashboardProps {
  deal: Deal;
  interactions: Interaction[];
  onAddLog: (content: string, type: InteractionType) => Promise<void>;
  onRefreshPrediction: () => void;
  isAnalyzing: boolean;
  isPredicting: boolean;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  deal,
  interactions,
  onAddLog,
  onRefreshPrediction,
  isAnalyzing,
  isPredicting
}) => {
  
  // Find the most recent interaction that actually has feedback
  const latestReviewedInteraction = [...interactions]
    .sort((a, b) => b.createdAt - a.createdAt)
    .find(i => i.aiFeedback !== undefined);

  // Auto-scroll to bottom of timeline is handled by user, but we want to ensure the layout is rigid
  
  return (
    <div className="flex h-full w-full bg-slate-950">
      
      {/* LEFT COLUMN: Timeline & Input (66% width or flex-1) */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800">
        
        {/* 1. Deal Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">{deal.clientName}</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Started {deal.startDate}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {deal.stage}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Value</div>
            <div className="text-lg font-mono font-medium text-emerald-400 flex items-center justify-end gap-1">
              <DollarSign className="w-4 h-4" />
              {deal.value.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 2. Timeline (Scrollable) */}
        <div className="flex-1 overflow-y-auto bg-slate-950 relative">
            <div className="p-6 pb-24"> {/* Padding bottom for visual space */}
                <InteractionLog interactions={interactions} />
            </div>
        </div>

        {/* 3. Input Area (Fixed Bottom) */}
        <div className="z-20">
            <AddLogForm onSubmit={onAddLog} isAnalyzing={isAnalyzing} />
        </div>
      </div>

      {/* RIGHT COLUMN: Intelligence Panel (33% width, fixed 350px-400px) */}
      <div className="w-[400px] flex flex-col border-l border-slate-800 bg-slate-900">
        
        {/* Top Right: The Critic */}
        <div className="h-1/2 min-h-[300px]">
            <CriticPanel 
                latestInteraction={latestReviewedInteraction} 
                isLoading={isAnalyzing} 
            />
        </div>

        {/* Bottom Right: The Oracle */}
        <div className="h-1/2 min-h-[300px] border-t border-slate-800">
            <RadarPanel 
                prediction={deal.prediction} 
                isLoading={isPredicting} 
                onRefresh={onRefreshPrediction} 
            />
        </div>

      </div>
    </div>
  );
};
