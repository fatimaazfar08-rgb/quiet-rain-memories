import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Chapter1 } from '@/components/game/Chapter1';
import { Chapter2 } from '@/components/game/Chapter2';
import { Chapter3 } from '@/components/game/Chapter3';
import { Chapter4 } from '@/components/game/Chapter4';
import { Chapter5 } from '@/components/game/Chapter5';
import { useGameStore } from '@/store/gameStore';

const ChapterComponents: Record<number, React.ComponentType> = {
  1: Chapter1,
  2: Chapter2,
  3: Chapter3,
  4: Chapter4,
  5: Chapter5,
};

export default function Game() {
  const { chapterNumber } = useParams<{ chapterNumber: string }>();
  const navigate = useNavigate();
  const setCurrentChapter = useGameStore((state) => state.setCurrentChapter);
  
  const chapter = parseInt(chapterNumber || '1', 10);

  useEffect(() => {
    setCurrentChapter(chapter);

    // Handle ESC key for menu
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirm('Return to main menu?')) {
          navigate('/');
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [chapter, navigate, setCurrentChapter]);

  const ChapterComponent = ChapterComponents[chapter];

  if (!ChapterComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Chapter {chapter} - Coming Soon
          </h2>
          <p className="text-muted-foreground mb-6">
            This chapter is still being developed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return <ChapterComponent />;
}
