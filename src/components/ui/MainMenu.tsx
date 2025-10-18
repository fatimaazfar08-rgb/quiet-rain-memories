import { Button } from './button';
import { useGameStore } from '@/store/gameStore';
import { Play, Book, Settings, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MainMenu = () => {
  const navigate = useNavigate();
  const { progress, setCurrentChapter, resetProgress } = useGameStore();
  const hasProgress = progress.completedChapters.length > 0 || progress.collectedMemories.length > 0;

  const handleNewGame = () => {
    if (hasProgress) {
      if (confirm('This will erase your current progress. Continue?')) {
        resetProgress();
        setCurrentChapter(1);
        navigate('/chapter/1');
      }
    } else {
      setCurrentChapter(1);
      navigate('/chapter/1');
    }
  };

  const handleContinue = () => {
    navigate(`/chapter/${progress.currentChapter}`);
  };

  const handleChapterSelect = () => {
    navigate('/chapters');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/10" />
      
      {/* Rain effect overlay */}
      <div className="absolute inset-0 rain-effect opacity-30" />

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Title */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-7xl font-bold text-foreground mb-4 tracking-tight">
            The Quiet Rain
          </h1>
          <p className="text-xl text-muted-foreground italic">
            A story of memory, misunderstanding, and finding peace
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {hasProgress && (
            <Button
              size="lg"
              onClick={handleContinue}
              className="w-full text-lg py-6 bg-primary hover:bg-primary-glow shadow-[0_0_20px_rgba(107,143,181,0.3)]"
            >
              <Play className="w-5 h-5 mr-2" />
              Continue
            </Button>
          )}

          <Button
            size="lg"
            variant="secondary"
            onClick={handleNewGame}
            className="w-full text-lg py-6"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            New Game
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleChapterSelect}
            className="w-full text-lg py-6"
          >
            <Book className="w-5 h-5 mr-2" />
            Chapter Select
          </Button>

          <Button
            size="lg"
            variant="ghost"
            onClick={() => {}}
            className="w-full text-lg py-6"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </div>

        {/* Credits */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p>Use WASD to move • E to interact • ESC for menu</p>
          <p className="mt-2 text-xs opacity-70">
            A narrative game about understanding and acceptance
          </p>
        </div>
      </div>
    </div>
  );
};
