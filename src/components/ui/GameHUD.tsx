// // import { useGameStore } from '@/store/gameStore';
// // import { Button } from '@/components/ui/button';
// // import { Progress } from '@/components/ui/progress';
// // import { Menu, Book } from 'lucide-react';

// // interface GameHUDProps {
// //   chapter: number;
// //   chapterTitle: string;
// //   nearbyObjects?: Array<{ id: string; distance: number }>;
// // }

// // export const GameHUD = ({ chapter, chapterTitle, nearbyObjects = [] }: GameHUDProps) => {
// //   const { progress, setMenuOpen, setPaused } = useGameStore();

// //   const chapterMemoryKeys: Record<number, string[]> = {
// //   1: ['photo-rowan', 'newspaper-article', 'childhood-drawing', 'mirror-reflection', 'rowans-box'],
// //   2: ['desk-memory', 'locker-memory', 'note-memory', 'classroom-memory', 'hallway-memory'], // ✅ Added
// //   3: ['sketch1', 'sketch2', 'sketch3', 'sketch4', 'sketch5'],
// //   4: ['bridge-start', 'bridge-middle', 'bridge-truth', 'bridge-water', 'bridge-end'],
// //   5: [],
// // };

// //   const currentChapterMemories = chapterMemoryKeys[chapter] || [];
// //   const collectedMemories = (progress?.collectedMemories ?? []).filter((mem) =>
// //     currentChapterMemories.includes(mem)
// //   ).length;
// //   const totalMemories = currentChapterMemories.length;

// //   const canInteract = nearbyObjects.some((obj) => obj.distance < 3);

// //   const handleMenuClick = () => {
// //     setPaused(true);
// //     setMenuOpen(true);
// //   };

// //   return (
// //     <div className="absolute inset-0 pointer-events-none">
// //       {/* Top Bar */}
// //       <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
// //         <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
// //           <p className="text-sm text-muted-foreground">Chapter {chapter}</p>
// //           <h2 className="text-lg font-semibold text-foreground">{chapterTitle}</h2>
// //         </div>

// //         <Button
// //           variant="secondary"
// //           size="icon"
// //           onClick={handleMenuClick}
// //           className="rounded-lg"
// //         >
// //           <Menu className="w-5 h-5" />
// //         </Button>
// //       </div>

// //       {/* Bottom Bar */}
// //       <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
// //         <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 max-w-md mx-auto">
// //           <div className="flex items-center gap-3 mb-2">
// //             <Book className="w-5 h-5 text-accent" />
// //             <span className="text-sm font-medium text-foreground">
// //               Score: {collectedMemories}/{totalMemories}
// //             </span>
// //           </div>
// //           <Progress value={totalMemories > 0 ? (collectedMemories / totalMemories) * 100 : 0} className="h-2" />
// //         </div>

// //         {/* Controls Hint */}
// //         <div className="mt-4 text-center text-sm text-muted-foreground">
// //           <p>WASD to move • E to interact • ESC for menu</p>
// //         </div>

// //         {/* Interaction Prompt */}
// //         {canInteract && (
// //           <div className="mt-2 text-center animate-pulse">
// //             <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary rounded-lg px-4 py-2">
// //               <span className="text-primary font-bold text-lg">Press E</span>
// //               <span className="text-primary-foreground">to interact</span>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // GameHUD.tsx - COMPLETE VERSION WITH isTransitioning SUPPORT
// import { useGameStore } from '@/store/gameStore';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { Menu, Book } from 'lucide-react';

// interface GameHUDProps {
//   chapter: number;
//   chapterTitle: string;
//   nearbyObjects?: Array<{ id: string; distance: number }>;
//   isTransitioning?: boolean;  // ✅ ADDED - Blocks HUD during transition
// }

// export const GameHUD = ({ 
//   chapter, 
//   chapterTitle, 
//   nearbyObjects = [], 
//   isTransitioning = false  // ✅ DEFAULT FALSE
// }: GameHUDProps) => {
//   const { progress, setMenuOpen, setPaused } = useGameStore();

//   // ✅ BLOCK ALL INTERACTIONS DURING TRANSITION
//   const canInteract = !isTransitioning && nearbyObjects.some((obj) => obj.distance < 3);

//   const chapterMemoryKeys: Record<number, string[]> = {
//     1: ['photo-rowan', 'newspaper-article', 'childhood-drawing', 'mirror-reflection', 'rowans-box'],
//     2: ['desk-memory', 'locker-memory', 'note-memory', 'classroom-memory', 'hallway-memory'],
//     3: ['sketch1', 'sketch2', 'sketch3', 'sketch4', 'sketch5'],
//     4: ['bridge-start', 'bridge-middle', 'bridge-truth', 'bridge-water', 'bridge-end'],
//     5: [],
//   };

//   const currentChapterMemories = chapterMemoryKeys[chapter] || [];
//   const collectedMemories = (progress?.collectedMemories ?? []).filter((mem) =>
//     currentChapterMemories.includes(mem)
//   ).length;
//   const totalMemories = currentChapterMemories.length;

//   // ✅ HANDLE MENU CLICK - BLOCKED DURING TRANSITION
//   const handleMenuClick = () => {
//     if (isTransitioning) return; // ✅ BLOCK MENU DURING TRANSITION
//     setPaused(true);
//     setMenuOpen(true);
//   };

//   // ✅ FADE OUT & DISABLE DURING TRANSITION
//   if (isTransitioning) {
//     return (
//       <div className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-0">
//         {/* FADED PLACEHOLDER - CANNOT INTERACT */}
//         <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
//           <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 opacity-20">
//             <p className="text-sm text-muted-foreground/50">Chapter {chapter}</p>
//             <h2 className="text-lg font-semibold text-foreground/50">{chapterTitle}</h2>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="absolute inset-0 pointer-events-none transition-all duration-700">
//       {/* Top Bar */}
//       <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
//         <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
//           <p className="text-sm text-muted-foreground">Chapter {chapter}</p>
//           <h2 className="text-lg font-semibold text-foreground">{chapterTitle}</h2>
//         </div>

//         <Button
//           variant="secondary"
//           size="icon"
//           onClick={handleMenuClick}
//           className="rounded-lg hover:bg-accent/80 transition-all"
//           disabled={isTransitioning} // ✅ DISABLE BUTTON
//         >
//           <Menu className="w-5 h-5" />
//         </Button>
//       </div>

//       {/* Bottom Bar */}
//       <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
//         <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 max-w-md mx-auto">
//           <div className="flex items-center gap-3 mb-2">
//             <Book className="w-5 h-5 text-accent" />
//             <span className="text-sm font-medium text-foreground">
//               Score: {collectedMemories}/{totalMemories}
//             </span>
//           </div>
//           <Progress 
//             value={totalMemories > 0 ? (collectedMemories / totalMemories) * 100 : 0} 
//             className="h-2" 
//           />
//         </div>

//         {/* Controls Hint - HIDDEN DURING TRANSITION */}
//         {!isTransitioning && (
//           <div className="mt-4 text-center text-sm text-muted-foreground">
//             <p>WASD to move • E to interact • ESC for menu</p>
//           </div>
//         )}

//         {/* Interaction Prompt - ONLY SHOWS WHEN CAN INTERACT */}
//         {canInteract && (
//           <div className="mt-2 text-center animate-pulse">
//             <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary rounded-lg px-4 py-2">
//               <span className="text-primary font-bold text-lg">Press E</span>
//               <span className="text-primary-foreground">to interact</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// src/components/ui/GameHUD.tsx - ✅ FULL VERSION WITH TRANSITION SUPPORT
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Menu, Book } from 'lucide-react';

interface GameHUDProps {
  chapter: number;
  chapterTitle: string;
  nearbyObjects?: Array<{ id: string; distance: number }>;
  isTransitioning?: boolean;
}

export const GameHUD = ({ 
  chapter, 
  chapterTitle, 
  nearbyObjects = [], 
  isTransitioning = false 
}: GameHUDProps) => {
  const { progress, setMenuOpen, setPaused } = useGameStore();

  // ✅ BLOCK INTERACTIONS DURING TRANSITION
  const canInteract = !isTransitioning && nearbyObjects.some((obj) => obj.distance < 3);

  const chapterMemoryKeys: Record<number, string[]> = {
    1: ['photo-rowan', 'newspaper-article', 'childhood-drawing', 'mirror-reflection', 'rowans-box'],
    2: ['desk-memory', 'locker-memory', 'note-memory', 'classroom-memory', 'hallway-memory'],
    3: ['sketch1', 'sketch2', 'sketch3', 'sketch4', 'sketch5'],
    4: ['bridge-start', 'bridge-middle', 'bridge-truth', 'bridge-water', 'bridge-end'],
    5: [],
  };

  const currentChapterMemories = chapterMemoryKeys[chapter] || [];
  const collectedMemories = (progress?.collectedMemories ?? []).filter((mem) =>
    currentChapterMemories.includes(mem)
  ).length;
  const totalMemories = currentChapterMemories.length;

  const handleMenuClick = () => {
    if (isTransitioning) return;
    setPaused(true);
    setMenuOpen(true);
  };

  // ✅ FADE OUT DURING TRANSITION
  if (isTransitioning) {
    return (
      <div className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-0 game-hud">
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 opacity-20">
            <p className="text-sm text-muted-foreground/50">Chapter {chapter}</p>
            <h2 className="text-lg font-semibold text-foreground/50">{chapterTitle}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none transition-all duration-700 game-hud">
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
          className="rounded-lg hover:bg-accent/80 transition-all"
          disabled={isTransitioning}
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
          <Progress 
            value={totalMemories > 0 ? (collectedMemories / totalMemories) * 100 : 0} 
            className="h-2" 
          />
        </div>

        {/* Controls - HIDDEN DURING TRANSITION */}
        {!isTransitioning && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>WASD to move • E to interact • ESC for menu</p>
          </div>
        )}

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
    </div>
  );
};