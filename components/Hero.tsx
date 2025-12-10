import React from 'react';

const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-brand-yellow rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-slow"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-purple rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-brand-pink rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>

      <div className="relative z-10 max-w-3xl">
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white shadow-sm border border-gray-100">
          <span className="text-sm font-bold text-brand-purple tracking-wider uppercase">Игровая студия с ИИ</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 leading-tight mb-6">
          Создай новый <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-yellow">
            Хит в мире пазлов
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Создавайте дружелюбные, яркие и увлекательные концепты головоломок за секунды. 
          Идеально для брейншторма механик, визуального стиля и маркетинговых идей для казуальной аудитории.
        </p>
        
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white transition-all duration-200 bg-brand-purple font-display rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple hover:bg-brand-purple/90 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          Начать
          <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>

        <div className="mt-12 grid grid-cols-3 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🧠</span>
            <span className="text-sm font-bold">Тренировка мозга</span>
          </div>
          <div className="flex flex-col items-center">
             <span className="text-2xl mb-2">✨</span>
            <span className="text-sm font-bold">Релакс</span>
          </div>
          <div className="flex flex-col items-center">
             <span className="text-2xl mb-2">🌈</span>
            <span className="text-sm font-bold">Визуальная радость</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
