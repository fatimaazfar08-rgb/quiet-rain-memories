import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Menu, Book } from 'lucide-react';

interface GameHUDProps {
  chapter: number;
  chapterTitle: string;
}

export const GameHUD = ({ chapter, chapterTitle }: GameHUDProps) => {
  const { progress, setMenuOpen, setPaused } = useGameStore();
  const collectedMemories = progress.collectedMemories.length;
  const totalMemories = 5; // Chapter 1 has 5 collectible memories

  const handleMenuClick = () => {
    setPaused(true);
    setMenuOpen(true);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
          <p className="text-sm text-muted-foreground">Chapter {chapter}</p>
          <h2 className="text-lg font-semibold text-foreground">{chapterTitle}</h2>
        </div>

        <Button
          variant="secondary"
          size="icon"
          onClick={handleMenuClick}
          className="rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Book className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Memories: {collectedMemories}/{totalMemories}
            </span>
          </div>
          <Progress value={(collectedMemories / totalMemories) * 100} className="h-2" />
        </div>

        {/* Controls Hint */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>WASD to move • E to interact • ESC for menu</p>
        </div>
      </div>

      {/* Anxiety Level Indicator */}
      {progress.anxietyLevel > 30 && (
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 pointer-events-auto">
          <div className="bg-destructive/20 border border-destructive rounded-lg p-3">
            <p className="text-xs text-destructive-foreground mb-2">Anxiety</p>
            <Progress
              value={progress.anxietyLevel}
              className="h-20 w-4 [&>div]:bg-destructive rotate-180"
            />
          </div>
        </div>
      )}
    </div>
  );
};
