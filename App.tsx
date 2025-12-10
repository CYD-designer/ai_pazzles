import React, { useState, useEffect } from 'react';
import PuzzleBoard from './components/PuzzleBoard';
import { generateLevelData } from './services/gemini';
import { LevelData, GameState, Transaction } from './types';

// Mock Leaderboard Data
const MOCK_LEADERBOARD = [
  { name: "PuzzleMaster99", score: 15400, avatar: "🦁" },
  { name: "LogicQueen", score: 12500, avatar: "🦊" },
  { name: "BrainFlex", score: 9800, avatar: "🧠" },
  { name: "SpeedSolver", score: 8200, avatar: "⚡️" },
  { name: "CasualCat", score: 5000, avatar: "🐱" },
  { name: "GlobalChamp", score: 42000, avatar: "🌍" },
  { name: "MysteryUser", score: 3000, avatar: "👻" },
  { name: "LuckyStar", score: 21000, avatar: "⭐️" },
];

type CurrencyCode = 'RUB' | 'USD';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [level, setLevel] = useState<number>(1);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [score, setScore] = useState<number>(0);
  const [pzzls, setPzzls] = useState<number>(0); 
  const [hintTrigger, setHintTrigger] = useState<number>(0);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('RUB');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Prices
  const COST_HINT = 2500;
  const COST_SKIP = 5000;
  const COST_SUB_DISCOUNT = 100000;

  // Currency Rates (per 1000 PZZLS)
  const RATES: Record<CurrencyCode, number> = {
    RUB: 50,
    USD: 1,
  };

  const CURRENCY_LABELS: Record<CurrencyCode, string> = {
    RUB: '₽',
    USD: '$',
  };

  const addTransaction = (type: 'EARN' | 'SPEND' | 'PURCHASE', amount: number, desc: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      description: desc,
      date: new Date()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const startLevel = async (lvl: number) => {
    setGameState(GameState.LOADING);
    setHintTrigger(0); // Reset hint trigger
    try {
      const data = await generateLevelData(lvl);
      setLevelData(data);
      setGameState(GameState.PLAYING);
    } catch (e) {
      console.error("Failed to load level", e);
      // Fallback simple data
      setLevelData({
        id: lvl,
        theme: "Базовый уровень",
        colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"],
        funFact: "Вы отлично справляетесь!",
        gridSize: 3
      });
      setGameState(GameState.PLAYING);
    }
  };

  const handleNextLevel = () => {
    // Increment score based on level completion
    const points = level * 100;
    const pzzlsEarned = 150 + (level * 10); 
    
    setScore(prev => prev + points);
    setPzzls(prev => prev + pzzlsEarned);
    addTransaction('EARN', pzzlsEarned, `Победа: Уровень ${level}`);
    
    setLevel(l => l + 1);
    startLevel(level + 1);
  };

  const useHint = () => {
    if (pzzls >= COST_HINT) {
      setPzzls(prev => prev - COST_HINT);
      addTransaction('SPEND', -COST_HINT, 'Покупка: Подсказка');
      setHintTrigger(prev => prev + 1);
    } else {
      alert("Недостаточно PZZLS! Посетите магазин.");
    }
  };

  const useSkip = () => {
    if (pzzls >= COST_SKIP) {
      setPzzls(prev => prev - COST_SKIP);
      addTransaction('SPEND', -COST_SKIP, 'Покупка: Пропуск уровня');
      handleNextLevel();
    } else {
      alert("Недостаточно PZZLS! Посетите магазин.");
    }
  };

  const handleBuyPzzls = (amount: number, price: number) => {
    setPurchasing(true);
    // Simulate API call to Telegram Payments
    setTimeout(() => {
      setPzzls(prev => prev + amount);
      addTransaction('PURCHASE', amount, `Покупка пакета (${price} ${CURRENCY_LABELS[selectedCurrency]})`);
      setPurchasing(false);
      alert(`Успешно куплено ${amount} PZZLS!`);
    }, 1000);
  };

  const handleBuyDiscount = () => {
    if (pzzls >= COST_SUB_DISCOUNT) {
      setPzzls(prev => prev - COST_SUB_DISCOUNT);
      addTransaction('SPEND', -COST_SUB_DISCOUNT, 'Покупка: Скидка на подписку');
      alert("Скидка 50% на подписку активирована!");
    } else {
      alert("Недостаточно PZZLS!");
    }
  };

  // --- RENDERING HELPERS ---

  const renderBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-brand-pink/20 rounded-full blur-3xl animate-bounce-slow"></div>
    </div>
  );

  // SCREEN 1: INTRO
  const renderIntro = () => (
    <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-xl animate-pop text-center border border-white">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-gradient-to-br from-brand-purple to-brand-pink rounded-2xl shadow-lg">
           <span className="text-4xl text-white">🧩</span>
        </div>
      </div>
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">AI_Puzzle</h1>
      <div className="inline-block bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded-full mb-6">12+</div>
      
      <p className="text-gray-600 mb-6 leading-relaxed text-sm">
        Добро пожаловать в AI_Puzzle!
        <br/><br/>
        Это интерактивная игра-пазл с элементами логики.
        Бот создан для развлечения и подходит для пользователей 12+ (так как есть внутренняя валюта и покупки).
      </p>
      
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-left border border-gray-100">
        <p className="font-bold text-gray-700 mb-1">Контакты разработчика:</p>
        <p className="text-gray-500">Telegram: <a href="https://t.me/ai_gameover" target="_blank" rel="noreferrer" className="text-brand-purple hover:underline">@ai_gameover</a></p>
      </div>

      <p className="text-xs text-gray-400 mb-6">
        Нажимая "Далее", вы соглашаетесь с <a href="#" className="underline">Правилами использования</a> и <a href="#" className="underline">Политикой конфиденциальности</a> (GitHub Pages).
      </p>

      <button
        onClick={() => setGameState(GameState.ABOUT)}
        className="w-full py-4 bg-brand-purple text-white text-lg font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all"
      >
        Далее
      </button>
    </div>
  );

  // SCREEN 2: ABOUT
  const renderAbout = () => (
    <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-xl animate-pop border border-white">
      <h2 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">О боте</h2>
      
      <div className="space-y-6 text-sm text-gray-600">
        <p>
          <strong className="text-gray-800">AI_Puzzle</strong> — это пазл-бот, где вы проходите уровни, решаете задачи и повышаете свой рейтинг.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
          <p className="font-bold text-blue-800 mb-1">Цель бота:</p>
          <p>Предоставить увлекательную игру без вредоносного функционала.</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400">
          <p className="font-bold text-yellow-800 mb-1">Рейтинг:</p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
             <li>Каждый игрок получает очки за пройденные уровни</li>
             <li>Рейтинг показывает глобальный топ среди всех игроков</li>
          </ul>
        </div>

        <p className="text-xs text-gray-400 italic">
          Примечание: Название содержит «AI», но бот не использует ИИ для анализа игроков.
        </p>
      </div>

      <button
        onClick={() => setGameState(GameState.TERMS)}
        className="w-full mt-8 py-4 bg-brand-purple text-white text-lg font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all"
      >
        Далее
      </button>
    </div>
  );

  // SCREEN 3: TERMS
  const renderTerms = () => (
    <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-xl animate-pop border border-white">
      <h2 className="text-2xl font-display font-bold text-gray-800 mb-4 text-center">Соглашение</h2>
      
      <div className="h-64 overflow-y-auto pr-2 mb-6 text-sm text-gray-600 space-y-3 custom-scrollbar">
        <p>Используя <strong>AI_Puzzle</strong>, вы подтверждаете, что:</p>
        <ul className="list-disc pl-5 space-y-2 marker:text-brand-purple">
          <li>Бот предназначен только для развлечения.</li>
          <li>Функционал безопасен.</li>
          <li>Вы принимаете правила использования.</li>
          <li>Ваши данные (ID, рейтинг, покупки) обрабатываются для работы бота.</li>
          <li>Данные не передаются третьим лицам.</li>
          <li>Оформляемые подписки и покупки PZZLS прозрачны и отменяемы в любой момент.</li>
        </ul>
        <p className="text-xs mt-4">
          Подробности в <a href="#" className="text-brand-purple underline">Политике конфиденциальности</a>.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setGameState(GameState.INTRO)}
          className="flex-1 py-3 bg-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-300 transition-all"
        >
          Не согласен
        </button>
        <button
          onClick={() => setGameState(GameState.SUBSCRIPTION)}
          className="flex-1 py-3 bg-brand-purple text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all"
        >
          Согласен
        </button>
      </div>
    </div>
  );

  // SCREEN 4: SUBSCRIPTION
  const renderSubscription = () => (
    <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-xl animate-pop border border-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      
      <h2 className="text-2xl font-display font-bold text-brand-purple mb-2 text-center">AI_Puzzle+</h2>
      <p className="text-center text-gray-500 mb-6 text-sm">Премиум возможности</p>

      <ul className="space-y-3 mb-8">
        {[
          'Доступ к премиум-уровням',
          'Дополнительные подсказки',
          'Отключение рекламы',
          'Бонусные PZZLS ежедневно'
        ].map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
            {item}
          </li>
        ))}
      </ul>

      <div className="bg-brand-bg rounded-xl p-4 mb-6 text-center">
        <p className="text-2xl font-bold text-gray-800">299 ₽ <span className="text-sm font-normal text-gray-500">/ мес</span></p>
        <p className="text-xs text-gray-400 mt-1">Автопродление • Отмена в любой момент</p>
      </div>

      <button
        onClick={() => startLevel(1)}
        className="w-full py-4 bg-gradient-to-r from-brand-yellow to-brand-teal text-white text-lg font-bold rounded-xl shadow-lg hover:opacity-90 transition-all mb-3 relative overflow-hidden group"
      >
        <span className="relative z-10">Оформить подписку</span>
        <div className="absolute inset-0 bg-white opacity-20 group-hover:animate-pulse"></div>
      </button>

      <button
        onClick={() => startLevel(1)}
        className="w-full py-3 text-gray-400 text-sm hover:text-gray-600 transition-colors"
      >
        Играть бесплатно с рекламой
      </button>
      
      <p className="text-[10px] text-gray-400 text-center mt-4 leading-tight">
        Оплата проводится через официальные платёжные сервисы Telegram. Мы не храним данные ваших карт.
      </p>
    </div>
  );

  // SHOP SCREEN
  const renderShop = () => {
    // Pack Definitions
    const packs = [
      { id: 1, pzzls: 1000, mult: 1, popular: false },
      { id: 2, pzzls: 5000, mult: 5, popular: true },
      { id: 3, pzzls: 10000, mult: 10, popular: false },
    ];

    const getPrice = (multiplier: number) => {
      const base = RATES[selectedCurrency];
      const val = base * multiplier;
      // Format logic
      if (selectedCurrency === 'RUB') return Math.floor(val);
      return val.toFixed(2);
    };

    return (
      <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-[2rem] p-6 shadow-xl animate-pop border border-white h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setGameState(GameState.PLAYING)} className="text-2xl p-2 hover:bg-gray-100 rounded-full">←</button>
          <h2 className="text-xl font-display font-bold text-gray-800">Магазин PZZLS</h2>
          <button onClick={() => setGameState(GameState.TRANSACTIONS)} className="text-xl p-2 hover:bg-gray-100 rounded-full" title="История">📜</button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-brand-purple to-brand-pink text-white p-5 rounded-2xl mb-6 flex justify-between items-center shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs opacity-90 uppercase font-bold tracking-wider">Ваш баланс</p>
            <p className="text-3xl font-display font-bold mt-1">{pzzls.toLocaleString()}</p>
            <p className="text-sm opacity-80">PZZLS</p>
          </div>
          <div className="text-6xl absolute right-2 bottom-[-10px] opacity-30">💎</div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-1 pb-4">
          
          {/* Section: Spend */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 px-1">Потратить PZZLS</h3>
            <div className="grid grid-cols-1 gap-3">
              <div 
                onClick={useSkip} 
                className="bg-white border border-gray-100 p-3 rounded-xl flex justify-between items-center shadow-sm cursor-pointer hover:border-brand-pink transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-brand-pink/10 p-2 rounded-lg text-xl">⏭️</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Пропуск уровня</p>
                    <p className="text-xs text-gray-400">Переход дальше</p>
                  </div>
                </div>
                <span className="font-bold text-brand-pink">{COST_SKIP.toLocaleString()} 💎</span>
              </div>

              <div 
                onClick={handleBuyDiscount} 
                className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 rounded-xl flex justify-between items-center shadow-sm cursor-pointer text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg text-xl">🏷️</div>
                  <div>
                    <p className="font-bold text-sm">Скидка на подписку</p>
                    <p className="text-xs opacity-70">-50% на Premium</p>
                  </div>
                </div>
                <span className="font-bold text-white opacity-90">{COST_SUB_DISCOUNT.toLocaleString()} 💎</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100"/>

          {/* Section: Buy */}
          <div>
            <div className="flex justify-between items-end mb-3 px-1">
              <h3 className="text-sm font-bold text-gray-500 uppercase">Купить PZZLS</h3>
              
              {/* Currency Selector */}
              <select 
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                className="bg-gray-100 border-none text-xs font-bold rounded-lg py-1 px-2 cursor-pointer focus:ring-0 text-gray-600"
              >
                <option value="RUB">RUB (₽)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div className="space-y-3">
             {packs.map((pack) => {
               const price = getPrice(pack.mult);
               return (
                 <div key={pack.id} className={`bg-white border-2 ${pack.popular ? 'border-brand-teal' : 'border-gray-100'} p-4 rounded-xl flex justify-between items-center shadow-sm relative overflow-hidden`}>
                   {pack.popular && <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-purple to-brand-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>}
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-xl">💎</div>
                     <div>
                       <p className="font-bold text-gray-800">{pack.pzzls.toLocaleString()} PZZLS</p>
                       <p className="text-[10px] text-gray-400">Мгновенное начисление</p>
                     </div>
                   </div>
                   <button 
                      disabled={purchasing}
                      onClick={() => handleBuyPzzls(pack.pzzls, Number(price))}
                      className="bg-brand-teal text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm shadow-md active:scale-95"
                   >
                     {price} {CURRENCY_LABELS[selectedCurrency]}
                   </button>
                 </div>
               );
             })}
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-4 leading-snug">
              Покупки защищены. Нажимая кнопку, вы подтверждаете оплату выбранным способом.
              <br/>
              Возможность возврата средств ограничена правилами платформы.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // TRANSACTIONS SCREEN
  const renderTransactions = () => (
    <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-[2rem] p-6 shadow-xl animate-pop border border-white h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setGameState(GameState.SHOP)} className="text-2xl p-2 hover:bg-gray-100 rounded-full">←</button>
        <h2 className="text-xl font-display font-bold text-gray-800">История</h2>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-2">🧾</p>
            <p>История пуста</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{tx.date.toLocaleTimeString()} {tx.date.toLocaleDateString()}</p>
                  <p className="font-bold text-gray-700 text-sm">{tx.description}</p>
                </div>
                <div className={`font-mono font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // LEADERBOARD SCREEN
  const renderLeaderboard = () => {
    // Add current user to list
    const leaderboardData = MOCK_LEADERBOARD.map(p => ({ ...p, isMe: false }));
    const allPlayers = [...leaderboardData, { name: "Вы", score: score, avatar: "👤", isMe: true }];
    // Sort descending
    allPlayers.sort((a, b) => b.score - a.score);
    // Take Top 100 visual (slice)
    const topPlayers = allPlayers.slice(0, 100);

    return (
      <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-[2rem] p-6 shadow-xl animate-pop border border-white h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setGameState(GameState.PLAYING)} className="text-2xl p-2 hover:bg-gray-100 rounded-full">←</button>
          <h2 className="text-2xl font-display font-bold text-gray-800">Топ Игроков</h2>
          <div className="w-8"></div>
        </div>
        
        <div className="bg-brand-bg rounded-xl p-3 mb-4 text-center">
            <p className="text-xs text-gray-500">Глобальный рейтинг (Сезон 2026)</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
          {topPlayers.map((player, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 p-3 rounded-xl border ${player.isMe ? 'bg-brand-purple/10 border-brand-purple' : 'bg-white border-gray-50'}`}
            >
              <div className={`font-display font-bold w-6 text-center ${idx < 3 ? 'text-brand-yellow text-xl' : 'text-gray-400'}`}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-sm border border-gray-200">
                {player.avatar}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${player.isMe ? 'text-brand-purple' : 'text-gray-800'}`}>
                  {player.name} {player.isMe && '(Вы)'}
                </p>
              </div>
              <div className="font-mono font-bold text-gray-600 text-sm">
                {player.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative bg-brand-bg min-h-screen p-4 overflow-hidden">
      {renderBackground()}

      {gameState === GameState.INTRO && renderIntro()}
      {gameState === GameState.ABOUT && renderAbout()}
      {gameState === GameState.TERMS && renderTerms()}
      {gameState === GameState.SUBSCRIPTION && renderSubscription()}
      {gameState === GameState.SHOP && renderShop()}
      {gameState === GameState.TRANSACTIONS && renderTransactions()}
      {gameState === GameState.LEADERBOARD && renderLeaderboard()}

      {/* LOADING SCREEN */}
      {gameState === GameState.LOADING && (
        <div className="text-center z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-display font-bold text-gray-600 animate-pulse">
            Загрузка уровня {level}...
          </h2>
          <p className="text-gray-400 mt-2">ИИ генерирует задачу</p>
        </div>
      )}

      {/* GAMEPLAY SCREEN */}
      {gameState === GameState.PLAYING && levelData && (
        <div className="w-full max-w-xl px-4 flex flex-col h-full md:h-auto py-6 animate-pop relative z-10">
          {/* Header */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex justify-between items-center">
             <div onClick={() => setGameState(GameState.LEADERBOARD)} className="cursor-pointer">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Рейтинг</p>
                <div className="flex items-center gap-1">
                  <span className="text-lg">🏆</span>
                  <p className="text-xl font-display font-bold text-brand-purple">{score}</p>
                </div>
             </div>
             
             <div className="flex flex-col items-center">
                <h2 className="text-lg font-bold text-gray-800">Уровень {level}</h2>
             </div>

             <div onClick={() => setGameState(GameState.SHOP)} className="cursor-pointer text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Баланс</p>
                <div className="flex items-center justify-end gap-1">
                  <p className="text-xl font-bold text-brand-teal">{pzzls}</p>
                  <span className="text-sm">💎</span>
                </div>
             </div>
          </div>

          <div className="text-center mb-2">
             <p className="text-gray-500 text-sm font-medium">{levelData.theme}</p>
          </div>

          {/* Board */}
          <PuzzleBoard 
            level={levelData} 
            onWin={() => setGameState(GameState.WON)} 
            hintTrigger={hintTrigger}
          />

          {/* Power Ups */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={useHint}
              className="bg-white border-2 border-brand-yellow/20 p-3 rounded-xl flex flex-col items-center hover:bg-brand-yellow/5 active:scale-95 transition-all shadow-sm group"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">💡</span>
              <span className="font-bold text-gray-800 text-sm">Подсказка</span>
              <span className="text-xs text-brand-yellow font-bold mt-1">{COST_HINT.toLocaleString()} 💎</span>
            </button>
            <button 
              onClick={useSkip}
              className="bg-white border-2 border-brand-pink/20 p-3 rounded-xl flex flex-col items-center hover:bg-brand-pink/5 active:scale-95 transition-all shadow-sm group"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⏭️</span>
              <span className="font-bold text-gray-800 text-sm">Пропуск</span>
              <span className="text-xs text-brand-pink font-bold mt-1">{COST_SKIP.toLocaleString()} 💎</span>
            </button>
          </div>
          
          <button 
             onClick={() => setGameState(GameState.SHOP)}
             className="mt-4 text-center text-xs text-brand-purple font-bold hover:underline"
          >
            Магазин PZZLS
          </button>
        </div>
      )}

      {/* WIN MODAL */}
      {gameState === GameState.WON && levelData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-purple/20 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl max-w-md w-full text-center border-4 border-white transform animate-pop">
            <div className="text-6xl mb-6 animate-bounce">🏆</div>
            <h2 className="text-4xl font-display font-bold text-brand-purple mb-2">Победа!</h2>
            <div className="flex justify-center gap-4 mb-6">
               <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-600 font-bold text-sm">+ {level * 100} Очков</span>
               <span className="px-3 py-1 bg-brand-teal/10 rounded-lg text-brand-teal font-bold text-sm">+ {150 + (level * 10)} 💎</span>
            </div>
            
            <div className="bg-brand-bg rounded-2xl p-6 mb-8 text-left relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-brand-yellow"></div>
               <p className="text-xs font-bold text-brand-yellow uppercase mb-2">Факт уровня</p>
               <p className="text-gray-700 font-medium leading-relaxed">
                 {levelData.funFact}
               </p>
            </div>

            <button
              onClick={handleNextLevel}
              className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Следующий уровень →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
