import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Menu, Book } from 'lucide-react';

interface GameHUDProps {
  chapter: number;
  chapterTitle: string;
  nearbyObjects?: Array<{ id: string; distance: number }>;
}

export const GameHUD = ({ chapter, chapterTitle, nearbyObjects = [] }: GameHUDProps) => {
  const { progress, setMenuOpen, setPaused } = useGameStore();

  const chapterMemoryKeys: Record<number, string[]> = {
    1: ['photo-rowan', 'newspaper-article', 'childhood-drawing', 'mirror-reflection', 'rowans-box'],
    2: ['desk-memory', 'locker-memory', 'note-memory', 'classroom-memory', 'hallway-memory'],
    3: ['sketch1', 'sketch2', 'sketch3', 'sketch4', 'sketch5'],
    4: ['bridge-start', 'bridge-middle', 'bridge-truth', 'bridge-water', 'bridge-end'],
    5: [],
  };

  const currentChapterMemories = chapterMemoryKeys[chapter] || [];
  const collectedMemories = progress.collectedMemories.filter(mem =>
    currentChapterMemories.includes(mem)
  ).length;
  const totalMemories = currentChapterMemories.length;
  
  const canInteract = nearbyObjects.some(obj => obj.distance < 3);

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
              Score: {collectedMemories}/{totalMemories}
            </span>
          </div>
          <Progress value={totalMemories > 0 ? (collectedMemories / totalMemories) * 100 : 0} className="h-2" />
        </div>

        {/* Controls Hint */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>WASD to move • E to interact • ESC for menu</p>
        </div>
        
        {/* Interaction Prompt */}
        {canInteract && (
          <div className="mt-2 text-center animate-pulse">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary rounded-lg px-4 py-2">
              <span className="text-primary font-bold text-lg">Press E</span>
              <span className="text-primary-foreground">to interact</span>
            </div>
          </div>
        )}
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
