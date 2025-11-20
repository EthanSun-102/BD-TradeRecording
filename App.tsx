import React, { useState, useEffect, useCallback } from 'react';
import { DealList } from './components/DealList';
import { ClientDashboard } from './components/ClientDashboard';
import { Deal, Interaction, InteractionType, TurningPointPrediction } from './types';
import { MOCK_DEALS, MOCK_INTERACTIONS } from './constants';
import { getCriticalReflection, predictTurningPoint } from './services/geminiService';

const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(MOCK_DEALS[0].id);
  const [interactions, setInteractions] = useState<Interaction[]>(MOCK_INTERACTIONS);
  const [isAnalyzingLog, setIsAnalyzingLog] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  // Derived state
  const selectedDeal = deals.find(d => d.id === selectedDealId);
  const dealInteractions = interactions.filter(i => i.dealId === selectedDealId);

  // Handler: Add new log and trigger "Toxic Mentor"
  const handleAddLog = async (content: string, type: InteractionType) => {
    if (!selectedDealId || !selectedDeal) return;

    setIsAnalyzingLog(true);

    // 1. Create base interaction
    const newLog: Interaction = {
      id: Date.now().toString(),
      dealId: selectedDealId,
      date: new Date().toISOString().split('T')[0],
      type,
      content,
      createdAt: Date.now(),
    };

    // Optimistic update for UI
    setInteractions(prev => [...prev, newLog]);

    // 2. Call Gemini for critical feedback
    const feedback = await getCriticalReflection(
        content, 
        type, 
        {
            clientName: selectedDeal.clientName,
            stage: selectedDeal.stage,
            value: selectedDeal.value
        }
    );

    // 3. Update log with feedback
    setInteractions(prev => 
      prev.map(log => log.id === newLog.id ? { ...log, aiFeedback: feedback } : log)
    );

    setIsAnalyzingLog(false);
    
    // 4. Auto-update prediction if there's enough data
    handleRefreshPrediction(selectedDealId);
  };

  // Handler: Run "Turning Point" prediction
  const handleRefreshPrediction = useCallback(async (dealId?: string) => {
    const targetId = dealId || selectedDealId;
    if (!targetId) return;

    const targetDeal = deals.find(d => d.id === targetId);
    const history = interactions.filter(i => i.dealId === targetId);

    if (!targetDeal) return;

    setIsPredicting(true);
    const prediction = await predictTurningPoint(targetDeal, history);
    
    setDeals(prev => prev.map(d => 
      d.id === targetId ? { ...d, prediction } : d
    ));
    setIsPredicting(false);
  }, [deals, interactions, selectedDealId]);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar - Navigation */}
      <div className="hidden md:block">
        <DealList 
            deals={deals} 
            selectedDealId={selectedDealId} 
            onSelectDeal={setSelectedDealId} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {selectedDeal ? (
          <ClientDashboard 
            deal={selectedDeal}
            interactions={dealInteractions}
            onAddLog={handleAddLog}
            onRefreshPrediction={() => handleRefreshPrediction()}
            isAnalyzing={isAnalyzingLog}
            isPredicting={isPredicting}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600 bg-slate-950">
            <p>Select a deal from the sidebar to start piloting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
