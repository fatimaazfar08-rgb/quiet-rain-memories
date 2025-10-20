import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Dialogue {
  text: string;
  speaker: string;
}

interface GameState {
  dialogue: Dialogue | null;
  showDialogue: boolean;
  playerPosition: [number, number, number];
  progress: {
    collectedMemories: string[];
    completedChapters: number[];
    currentChapter: number;
    storyFlags: Record<string, boolean>;
  };
  sensoryOverload: boolean;
  isDead: boolean;
  anxietyLevel: number;
  isPaused: boolean;
  isMenuOpen: boolean;

  setDialogue: (dialogue: Dialogue | null) => void;
  addMemory: (memoryId: string) => void;
  completeChapter: (chapter: number) => void;
  setCurrentChapter: (chapter: number) => void;
  resetProgress: () => void;
  resetDeath: () => void;
  triggerSensoryOverload: (duration: number) => void;
  triggerPanicAttack: () => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  setPaused: (paused: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setAnxietyLevel: (level: number) => void;
}

const initialProgress = {
  collectedMemories: [],
  completedChapters: [],
  currentChapter: 1,
  storyFlags: {},
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      dialogue: null,
      showDialogue: false,
      playerPosition: [0, 1, 0],
      progress: initialProgress,
      sensoryOverload: false,
      isDead: false,
      anxietyLevel: 0,
      isPaused: false,
      isMenuOpen: false,

      setDialogue: (newDialogue) =>
        set({
          dialogue: newDialogue,
          showDialogue: !!newDialogue,
        }),

      addMemory: (memoryId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            collectedMemories: [...state.progress.collectedMemories, memoryId],
          },
        })),

      completeChapter: (chapter) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedChapters: [...new Set([...state.progress.completedChapters, chapter])],
          },
        })),

      setCurrentChapter: (chapter) =>
        set((state) => ({
          progress: { ...state.progress, currentChapter: chapter },
        })),

      resetProgress: () => set({ 
        progress: initialProgress,
      }),

      resetDeath: () => set({ 
        isDead: false,
        sensoryOverload: false,
        anxietyLevel: 0,
      }),

      triggerSensoryOverload: (duration) => {
        set({ sensoryOverload: true });
        setTimeout(() => set({ sensoryOverload: false }), duration);
      },

      triggerPanicAttack: () => {
        set({ 
          isDead: true,
          anxietyLevel: 100,
        });
        setTimeout(() => {
          const state = get();
          if (state.isDead) {
            set({ 
              isDead: false,
              anxietyLevel: 0,
            });
          }
        }, 5000); // Auto-respawn after 5 seconds
      },

      setPlayerPosition: (position) => set({ playerPosition: position }),
      setPaused: (paused) => set({ isPaused: paused }),
      setMenuOpen: (open) => set({ isMenuOpen: open }),
      setAnxietyLevel: (level) => set({ anxietyLevel: level }),
    }),
    { 
      name: 'game-storage',
      partialize: (state) => ({
        progress: state.progress,
        playerPosition: state.playerPosition,
      }),
    }
  )
);