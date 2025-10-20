import { Button } from './button';
import { Card } from './card';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, ArrowLeft } from 'lucide-react';

interface ChapterInfo {
  number: number;
  title: string;
  description: string;
}

const chapters: ChapterInfo[] = [
  {
    number: 1,
    title: 'Homecoming',
    description: 'Return to the house where everything began. Explore memories and face the past.',
  },
  {
    number: 2,
    title: 'Echoes in the Halls',
    description: 'Revisit the old school building and piece together fragments of the truth.',
  },
  {
    number: 3,
    title: 'The Sketchbook',
    description: "Discover Rowan's hidden drawings and uncover what really happened.",
  },
  {
    number: 4,
    title: 'The Bridge',
    description: 'Confront the past at the place where everything changed.',
  },
  {
    number: 5,
    title: 'The Quiet Rain',
    description: 'Find peace and closure. Let go of the weight you have been carrying.',
  },
];

export const ChapterSelect = () => {
  const navigate = useNavigate();
  const { progress, setCurrentChapter } = useGameStore();

  const handleChapterClick = (chapterNumber: number) => {
    const completedChapters = progress?.completedChapters ?? [];
    const isUnlocked = chapterNumber === 1 || completedChapters.includes(chapterNumber - 1);
    
    if (isUnlocked) {
      setCurrentChapter(chapterNumber);
      navigate('/chapter/' + chapterNumber);
    }
  };

  const isChapterUnlocked = (chapterNumber: number) => {
    const completedChapters = progress?.completedChapters ?? [];
    return chapterNumber === 1 || completedChapters.includes(chapterNumber - 1);
  };

  const isChapterCompleted = (chapterNumber: number) => {
    const completedChapters = progress?.completedChapters ?? [];
    return completedChapters.includes(chapterNumber);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      {/* Fixed header - no scroll */}
      <header className="flex-shrink-0 px-8 py-6 border-b bg-background/80 backdrop-blur-sm"> {/* Slight blur for depth */}
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-1">Chapter Select</h1>
            <p className="text-muted-foreground text-sm">Continue your journey through Eli&apos;s memories</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto px-8 py-6"> {/* Reduced py for more space */}
        <div className="max-w-6xl mx-auto">
          {/* Chapters Grid - compact gap on small screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"> {/* Responsive gap */}
            {chapters.map((chapter) => {
              const unlocked = isChapterUnlocked(chapter.number);
              const completed = isChapterCompleted(chapter.number);

              return (
                <Card
                  key={chapter.number}
                  className={`p-4 md:p-6 transition-all duration-300 h-fit ${ /* Compact on small screens */
                    unlocked
                      ? 'cursor-pointer hover:scale-105 hover:shadow-[0_0_30px_rgba(107,143,181,0.3)] border-primary/30'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => handleChapterClick(chapter.number)}
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl md:text-2xl font-bold text-primary">
                          {chapter.number}
                        </span>
                      </div>
                      {completed && (
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 md:w-5 md:h-5 text-accent-foreground" />
                        </div>
                      )}
                      {!unlocked && (
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Lock className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1 md:mb-2">
                    {chapter.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {unlocked ? chapter.description : 'Complete previous chapters to unlock'}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Progress Summary - always visible on scroll */}
          <Card className="p-4 md:p-6 sticky bottom-6 md:bottom-auto bg-background/90 backdrop-blur-sm"> {/* Slight stick + blur for visibility */}
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {(progress?.completedChapters ?? []).length}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Chapters Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">
                  {(progress?.collectedMemories ?? []).length}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Memories Collected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-hope">
                  {Object.keys(progress?.storyFlags ?? {}).length}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Story Events</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-water">
                  {Math.round(((progress?.completedChapters ?? []).length / 5) * 100)}%
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};