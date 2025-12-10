export interface LevelData {
  id: number;
  theme: string;
  colors: string[];
  funFact: string;
  gridSize: number;
}

export interface Tile {
  id: number; // The correct position index
  currentPos: number; // The current position index
}

export interface Transaction {
  id: string;
  type: 'EARN' | 'SPEND' | 'PURCHASE';
  amount: number;
  description: string;
  date: Date;
}

export enum GameState {
  INTRO = 'INTRO',         // Screen 1: Welcome
  ABOUT = 'ABOUT',         // Screen 2: Description
  TERMS = 'TERMS',         // Screen 3: Agreement
  SUBSCRIPTION = 'SUBSCRIPTION', // Screen 4: Premium
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  WON = 'WON',
  SHOP = 'SHOP',
  LEADERBOARD = 'LEADERBOARD',
  TRANSACTIONS = 'TRANSACTIONS' // New view for transparency
}

// These are kept for legacy compatibility if needed, but primarily we use GameState now
export enum ViewState {
  HOME = 'HOME',
  CONCEPT = 'CONCEPT',
  VISUALS = 'VISUALS',
  MARKETING = 'MARKETING'
}

export interface GameConcept {
  title: string;
  tagline: string;
  funFactor: string;
  coreMechanic: string;
  visualStyle: string;
}

export interface MarketingData {
  headline: string;
  socialPost: string;
  targetAudience: string;
  monetizationStrategy: string;
}
