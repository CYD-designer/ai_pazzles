import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: ViewState.HOME, label: 'Главная', icon: '🏠' },
    { id: ViewState.CONCEPT, label: 'Концепт', icon: '💡' },
    { id: ViewState.VISUALS, label: 'Визуал', icon: '🎨' },
    { id: ViewState.MARKETING, label: 'Маркетинг', icon: '📢' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-white/90 backdrop-blur-md shadow-lg z-50 md:px-8 border-t md:border-b md:border-t-0 border-gray-100">
      <div className="max-w-6xl mx-auto flex justify-between md:justify-start md:gap-8 overflow-x-auto">
        {/* Logo area desktop */}
        <div className="hidden md:flex items-center py-4 pr-8">
          <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
            PuzzlePop
          </span>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center p-3 md:py-4 md:px-4 transition-all duration-200 gap-1 md:gap-2
              ${currentView === item.id 
                ? 'text-brand-purple border-t-2 md:border-t-0 md:border-b-2 border-brand-purple font-bold' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <span className="text-xl md:text-lg">{item.icon}</span>
            <span className="text-xs md:text-sm whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
