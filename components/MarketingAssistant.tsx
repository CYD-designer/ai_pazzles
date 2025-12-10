import React, { useState } from 'react';
import { generateMarketingStrategy } from '../services/gemini';
import { GameConcept, MarketingData } from '../types';

interface MarketingAssistantProps {
  concept: GameConcept | null;
}

const MarketingAssistant: React.FC<MarketingAssistantProps> = ({ concept }) => {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!concept) return;
    setLoading(true);
    try {
      const result = await generateMarketingStrategy(concept);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!concept) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <div className="text-6xl mb-4 grayscale opacity-50">📣</div>
        <h2 className="text-2xl font-bold text-gray-400">Нужен концепт</h2>
        <p className="text-gray-400">Сначала создайте концепт игры, чтобы сделать рекламу.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-0">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-800 mb-4">
          Продвигай <span className="text-brand-teal">Радость</span>
        </h2>
        <p className="text-gray-600 text-lg">
          Преврати уютный концепт в рекламную кампанию.
        </p>
      </div>

      {!data && !loading && (
        <div className="text-center py-12 bg-white rounded-3xl shadow-xl border border-gray-100">
          <p className="text-xl text-gray-600 mb-6">Готовы продавать <strong>"{concept.title}"</strong>?</p>
          <button
            onClick={handleGenerate}
            className="px-8 py-4 bg-brand-teal text-white rounded-xl font-bold text-lg shadow-lg hover:bg-teal-600 transform transition hover:-translate-y-1"
          >
            Создать стратегию 🚀
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-teal mb-4"></div>
          <p className="text-gray-500 font-medium">Готовим идеальный питч...</p>
        </div>
      )}

      {data && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          {/* Ad Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-brand-teal p-6 text-white">
              <h3 className="font-bold text-lg opacity-90">Пример рекламы</h3>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Заголовок</span>
                <h2 className="text-3xl font-display font-bold text-gray-800 mt-2 leading-tight">
                  "{data.headline}"
                </h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full"></div>
                  <span className="font-bold text-sm text-gray-700">PuzzlePop Games</span>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{data.socialPost}</p>
                <div className="mt-3 w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  [Видео геймплея]
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-l-8 border-brand-yellow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Целевая аудитория</h3>
              <p className="text-gray-600 leading-relaxed">{data.targetAudience}</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border-l-8 border-brand-pink">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Монетизация</h3>
              <p className="text-gray-600 leading-relaxed">{data.monetizationStrategy}</p>
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full py-4 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:border-brand-teal hover:text-brand-teal transition-colors"
            >
              Пересоздать стратегию ↻
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingAssistant;
