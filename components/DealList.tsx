import React from 'react';
import { Deal, DealStage } from '../types';
import { Briefcase, DollarSign, ChevronRight } from 'lucide-react';

interface DealListProps {
  deals: Deal[];
  selectedDealId: string | null;
  onSelectDeal: (dealId: string) => void;
}

export const DealList: React.FC<DealListProps> = ({ deals, selectedDealId, onSelectDeal }) => {
  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 w-80">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-sky-500 flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          BD Pilot
        </h1>
        <p className="text-xs text-slate-500 mt-1">Deal Trajectory Control</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {deals.map((deal) => (
          <button
            key={deal.id}
            onClick={() => onSelectDeal(deal.id)}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 group ${
              selectedDealId === deal.id
                ? 'bg-slate-800 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-slate-200 truncate">{deal.clientName}</span>
              {selectedDealId === deal.id && <ChevronRight className="w-4 h-4 text-sky-500" />}
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
               <DollarSign className="w-3 h-3" />
               {deal.value.toLocaleString()}
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                deal.stage === DealStage.CLOSED_WON ? 'bg-emerald-500/10 text-emerald-400' :
                deal.stage === DealStage.CLOSED_LOST ? 'bg-red-500/10 text-red-400' :
                'bg-sky-500/10 text-sky-400'
              }`}>
                {deal.stage}
              </span>
              <span className="text-[10px] text-slate-600">{deal.lastActivity}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <button className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-sm font-medium transition-colors">
          + New Deal
        </button>
      </div>
    </div>
  );
};
