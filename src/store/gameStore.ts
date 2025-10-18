import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GameProgress {
  currentChapter: number;
  completedChapters: number[];
  collectedMemories: string[];
  anxietyLevel: number;
  storyFlags: Record<string, boolean>;
}

interface GameState {
  // Progress
  progress: GameProgress;
  
  // UI State
  isMenuOpen: boolean;
  isPaused: boolean;
  showDialogue: boolean;
  currentDialogue: string | null;
  
  // Player State
  playerPosition: [number, number, number];
  sensoryOverload: boolean;
  
  // Actions
  setCurrentChapter: (chapter: number) => void;
  completeChapter: (chapter: number) => void;
  addMemory: (memoryId: string) => void;
  setAnxietyLevel: (level: number) => void;
  setStoryFlag: (flag: string, value: boolean) => void;
  
  setMenuOpen: (open: boolean) => void;
  setPaused: (paused: boolean) => void;
  setDialogue: (text: string | null) => void;
  
  setPlayerPosition: (position: [number, number, number]) => void;
  triggerSensoryOverload: (duration?: number) => void;
  
  resetProgress: () => void;
}

const initialProgress: GameProgress = {
  currentChapter: 1,
  completedChapters: [],
  collectedMemories: [],
  anxietyLevel: 0,
  storyFlags: {},
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      progress: initialProgress,
      isMenuOpen: false,
      isPaused: false,
      showDialogue: false,
      currentDialogue: null,
      playerPosition: [0, 0, 0],
      sensoryOverload: false,
      
      // Actions
      setCurrentChapter: (chapter) =>
        set((state) => ({
          progress: { ...state.progress, currentChapter: chapter },
        })),
      
      completeChapter: (chapter) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedChapters: [...new Set([...state.progress.completedChapters, chapter])],
          },
        })),
      
      addMemory: (memoryId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            collectedMemories: [...new Set([...state.progress.collectedMemories, memoryId])],
          },
        })),
      
      setAnxietyLevel: (level) =>
        set((state) => ({
          progress: { ...state.progress, anxietyLevel: Math.max(0, Math.min(100, level)) },
        })),
      
      setStoryFlag: (flag, value) =>
        set((state) => ({
          progress: {
            ...state.progress,
            storyFlags: { ...state.progress.storyFlags, [flag]: value },
          },
        })),
      
      setMenuOpen: (open) => set({ isMenuOpen: open }),
      setPaused: (paused) => set({ isPaused: paused }),
      setDialogue: (text) => set({ currentDialogue: text, showDialogue: text !== null }),
      
      setPlayerPosition: (position) => set({ playerPosition: position }),
      
      triggerSensoryOverload: (duration = 3000) => {
        set({ sensoryOverload: true });
        setTimeout(() => set({ sensoryOverload: false }), duration);
      },
      
      resetProgress: () =>
        set({
          progress: initialProgress,
          isMenuOpen: false,
          isPaused: false,
          showDialogue: false,
          currentDialogue: null,
          playerPosition: [0, 0, 0],
          sensoryOverload: false,
        }),
    }),
    {
      name: 'quiet-rain-save',
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
