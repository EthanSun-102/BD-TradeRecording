import React from 'react';
import { TurningPointPrediction } from '../types';
import { Radar, Target, AlertTriangle, Loader2, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface RadarPanelProps {
  prediction: TurningPointPrediction | undefined;
  isLoading: boolean;
  onRefresh: () => void;
}

export const RadarPanel: React.FC<RadarPanelProps> = ({ prediction, isLoading, onRefresh }) => {
  
  const getProbColor = (prob: number) => {
    if (prob >= 70) return '#10b981'; // Emerald
    if (prob >= 40) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const data = prediction ? [
    { name: 'Success', value: prediction.win_probability },
    { name: 'Fail', value: 100 - prediction.win_probability }
  ] : [];

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          Turning Point Radar
        </h2>
        <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="text-slate-500 hover:text-sky-400 transition-colors p-1 rounded hover:bg-slate-800"
            title="Consult The Oracle"
        >
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Target className="w-4 h-4"/>}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {!prediction && !isLoading && (
           <div className="h-full flex flex-col items-center justify-center text-slate-500">
               <Target className="w-8 h-8 mb-2 opacity-20" />
               <p className="text-sm mb-4">No prediction data.</p>
               <button 
                onClick={onRefresh}
                className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-600/50 rounded text-xs font-bold uppercase tracking-wide transition-colors"
               >
                   Consult The Oracle
               </button>
           </div>
        )}

        {isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-indigo-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs animate-pulse uppercase tracking-widest">Calculating Trajectory...</p>
            </div>
        )}

        {prediction && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Metrics Row */}
            <div className="flex items-center justify-between gap-4">
                {/* Donut Chart */}
                <div className="h-24 w-24 relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={40}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell key="cell-0" fill={getProbColor(prediction.win_probability)} />
                                <Cell key="cell-1" fill="#1e293b" />
                                <Label 
                                    value={`${prediction.win_probability}%`} 
                                    position="center" 
                                    fill={getProbColor(prediction.win_probability)}
                                    style={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Date Display */}
                <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Next Critical Date</p>
                    <p className="text-xl font-mono font-bold text-white">{prediction.turning_point_date}</p>
                    <p className="text-[10px] text-indigo-400 mt-1">Make or Break</p>
                </div>
            </div>

            {/* Reasoning */}
            <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Oracle's Reasoning</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                    {prediction.reasoning}
                </p>
            </div>

            {/* Risk Factors */}
            {prediction.risk_factors.length > 0 && (
                <div className="border-t border-slate-800/50 pt-4">
                    <ul className="space-y-2">
                        {prediction.risk_factors.map((factor, i) => (
                            <li key={i} className="text-xs text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                {factor}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
