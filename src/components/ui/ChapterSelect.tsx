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
      <div className="flex-shrink-0 p-8 border-b"> {/* Fixed header */}
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Chapter Select</h1>
              <p className="text-muted-foreground">
                Continue your journey through Eli&apos;s memories
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8"> {/* Scrollable content */}
        <div className="max-w-6xl mx-auto">
          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {chapters.map((chapter) => {
              const unlocked = isChapterUnlocked(chapter.number);
              const completed = isChapterCompleted(chapter.number);

              return (
                <Card
                  key={chapter.number}
                  className={`p-6 transition-all duration-300 ${
                    unlocked
                      ? 'cursor-pointer hover:scale-105 hover:shadow-[0_0_30px_rgba(107,143,181,0.3)] border-primary/30'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => handleChapterClick(chapter.number)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {chapter.number}
                        </span>
                      </div>
                      {completed && (
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                          <Check className="w-5 h-5 text-accent-foreground" />
                        </div>
                      )}
                      {!unlocked && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {unlocked ? chapter.description : 'Complete previous chapters to unlock'}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Progress Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {(progress?.completedChapters ?? []).length}
                </p>
                <p className="text-sm text-muted-foreground">Chapters Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">
                  {(progress?.collectedMemories ?? []).length}
                </p>
                <p className="text-sm text-muted-foreground">Memories Collected</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-hope">
                  {Object.keys(progress?.storyFlags ?? {}).length}
                </p>
                <p className="text-sm text-muted-foreground">Story Events</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-water">
                  {Math.round(((progress?.completedChapters ?? []).length / 5) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};