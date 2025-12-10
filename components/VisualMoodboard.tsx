import React from 'react';
import { GameConcept } from '../types';

interface VisualMoodboardProps {
  concept: GameConcept | null;
}

const VisualMoodboard: React.FC<VisualMoodboardProps> = ({ concept }) => {
  if (!concept) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <div className="text-6xl mb-4 animate-bounce-slow">🎨</div>
        <h2 className="text-2xl font-bold text-gray-400">Сначала создайте концепт</h2>
        <p className="text-gray-400">Нам нужна тема для мудборда.</p>
      </div>
    );
  }

  // Pre-defined "casual friendly" color palettes that rotate based on title length
  // to give variety without complex logic
  const palettes = [
    ['#FFD166', '#06D6A0', '#118AB2', '#EF476F'],
    ['#8EECF5', '#90DBF4', '#A3C4F3', '#CFBAF0'],
    ['#FF99C8', '#FCF6BD', '#D0F4DE', '#A9DEF9'],
  ];
  
  const selectedPalette = palettes[concept.title.length % palettes.length];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-0">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-800 mb-4">
          Визуальный <span className="text-brand-pink">Вайб</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          На основе <strong>{concept.title}</strong>, вот предложенное визуальное направление с фокусом на казуальный стиль.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Color Palette Card */}
        <div className="md:col-span-1 bg-white rounded-3xl shadow-xl p-6 border border-gray-100 flex flex-col h-full">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Гармония цвета</h3>
          <div className="flex-1 flex flex-col gap-4">
            {selectedPalette.map((color, i) => (
              <div key={i} className="flex-1 rounded-2xl flex items-center px-4 shadow-sm" style={{ backgroundColor: color }}>
                <span className="bg-white/90 px-2 py-1 rounded text-xs font-mono font-bold uppercase text-gray-800">
                  {color}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Высокий контраст, дружелюбные тона, призванные снизить нагрузку на глаза во время долгой игры.
          </p>
        </div>

        {/* Mockup Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-xl p-8 border border-white flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#8B5CF6" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-17.9,88.4,-2.9C86.7,12.1,80.6,26.5,71.6,38.6C62.5,50.7,50.5,60.5,37.3,66.8C24.1,73.1,9.7,75.9,-3.3,81.6C-16.3,87.3,-27.9,95.8,-39.6,94.3C-51.3,92.8,-63.1,81.3,-71.8,67.8C-80.5,54.3,-86.1,38.8,-88.4,22.8C-90.7,6.8,-89.7,-9.7,-82.9,-23.4C-76.1,-37.1,-63.5,-48,-50.7,-55.8C-37.9,-63.6,-24.9,-68.3,-11.2,-69.3C2.5,-70.3,15,-67.6,30.5,-83.6L44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-8 relative z-10">Концепт интерфейса</h3>
          
          <div className="flex-1 flex justify-center items-center relative z-10">
            {/* Phone Mockup Frame */}
            <div className="w-64 h-96 bg-white border-8 border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col">
              {/* Header */}
              <div className="h-12 bg-gray-100 flex items-center justify-between px-4 border-b">
                 <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                 <div className="w-16 h-4 rounded-full bg-gray-200"></div>
                 <div className="w-6 h-6 rounded-full bg-brand-yellow"></div>
              </div>
              
              {/* Game Area Placeholder */}
              <div className="flex-1 bg-gray-50 p-4 grid grid-cols-3 gap-2 place-content-center">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-xl shadow-sm transform transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: selectedPalette[i % selectedPalette.length],
                      borderRadius: i % 2 === 0 ? '50%' : '20%' 
                    }}
                  ></div>
                ))}
              </div>

              {/* Bottom Nav */}
              <div className="h-16 bg-white border-t flex justify-around items-center px-4">
                 <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/20"></div>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 -mt-6 rounded-full bg-brand-pink shadow-lg border-4 border-white"></div>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-brand-teal/20"></div>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 relative z-10">
             <p className="font-semibold text-gray-700">Логика дизайна:</p>
             <p className="text-sm text-gray-600 mt-1">{concept.visualStyle}</p>
          </div>
        </div>
      </div>
      
      {/* Texture/Shapes Row */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Округлые', desc: 'Дружелюбные формы' },
           { label: 'Мягкие', desc: 'Тени и глубина' },
           { label: 'Жирный', desc: 'Шрифт' },
           { label: 'Микро', desc: 'Взаимодействия' }
         ].map((item, idx) => (
           <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm text-center border border-gray-50">
             <h4 className="font-bold text-gray-800">{item.label}</h4>
             <p className="text-xs text-gray-400 uppercase tracking-wide">{item.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default VisualMoodboard;
