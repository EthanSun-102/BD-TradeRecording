import React, { useState } from 'react';
import { InteractionType } from '../types';
import { Send, Sparkles } from 'lucide-react';

interface AddLogFormProps {
  onSubmit: (content: string, type: InteractionType) => Promise<void>;
  isAnalyzing: boolean;
}

export const AddLogForm: React.FC<AddLogFormProps> = ({ onSubmit, isAnalyzing }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<InteractionType>(InteractionType.MEETING);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit(content, type);
    setContent('');
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-6">
      <h3 className="text-slate-400 text-sm font-semibold mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-sky-500" />
        New Entry & Analyze
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          {Object.values(InteractionType).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                type === t
                  ? 'bg-sky-600 border-sky-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste meeting notes, email content, or chat summary here..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 h-24 resize-none"
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={!content.trim() || isAnalyzing}
            className={`absolute bottom-3 right-3 p-2 rounded-md flex items-center gap-2 text-xs font-bold transition-colors ${
              !content.trim() || isAnalyzing
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/20'
            }`}
          >
            {isAnalyzing ? (
              <>Analyzing...</>
            ) : (
              <>
                LOG & REVIEW <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
