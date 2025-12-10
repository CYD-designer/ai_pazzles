import React, { useState } from 'react';
import { generateGameConcept } from '../services/gemini';
import { GameConcept } from '../types';

interface ConceptGeneratorProps {
  onConceptGenerated: (concept: GameConcept) => void;
  existingConcept: GameConcept | null;
}

const ConceptGenerator: React.FC<ConceptGeneratorProps> = ({ onConceptGenerated, existingConcept }) => {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!theme.trim()) return;
    setLoading(true);
    setError('');
    try {
      const concept = await generateGameConcept(theme);
      onConceptGenerated(concept);
    } catch (e) {
      setError('Ой! Не удалось придумать идею. Попробуйте снова.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["Подводная пекарня", "Сонные коты", "Неоновая геометрия", "Уборка в лесу"];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-0 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-800 mb-4">
          Придумай <span className="text-brand-purple">Яркую</span> Идею
        </h2>
        <p className="text-gray-600 text-lg">
          Введите тему, чтобы сгенерировать полный концепт казуальной головоломки.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
          О чем будет игра?
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="например, уборка на книжной полке, кормление облаков..."
            className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 text-xl focus:border-brand-purple focus:ring-0 outline-none transition-all placeholder-gray-300"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !theme}
            className={`px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg transform transition-all active:scale-95
              ${loading || !theme 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-brand-purple to-brand-pink hover:shadow-brand-pink/30 hover:-translate-y-1'
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Мечтаем...
              </span>
            ) : (
              'Создать магию ✨'
            )}
          </button>
        </div>
        
        {/* Quick suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-400 self-center mr-2">Попробуйте:</span>
          {suggestions.map(s => (
            <button 
              key={s} 
              onClick={() => setTheme(s)}
              className="text-sm px-3 py-1 rounded-full bg-brand-bg text-gray-600 hover:bg-brand-purple hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
      </div>

      {existingConcept && (
        <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
          <div className="bg-brand-purple text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 bg-brand-pink opacity-20 rounded-full blur-3xl"></div>
            
            <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">Название</h3>
            <h1 className="text-4xl font-display font-bold mb-2">{existingConcept.title}</h1>
            <p className="text-xl italic opacity-90 mb-6">"{existingConcept.tagline}"</p>
            
            <div className="h-px bg-white/20 my-6"></div>
            
            <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-2">Фактор веселья</h3>
            <p className="leading-relaxed">{existingConcept.funFactor}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-yellow/10 rounded-lg text-brand-yellow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Механика</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{existingConcept.coreMechanic}</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-pink/10 rounded-lg text-brand-pink">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Визуальный стиль</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{existingConcept.visualStyle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptGenerator;
