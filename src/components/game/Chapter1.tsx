// // src/components/chapter1/Chapter1.tsx - ✅ COMPLETE EMOTIONAL VERSION
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Sky } from '@react-three/drei';
// import { Player } from './Player';
// import { Environment } from './Environment';
// import { InteractiveObject } from './InteractiveObject';
// import { Bully } from './Bully';
// import { NPC } from './NPC';
// import { RainEffect } from './RainEffect';
// import { useGameStore } from '@/store/gameStore';
// import { GameHUD } from '../ui/GameHUD';
// import { DialogueBox } from '../ui/DialogueBox';
// import { useSoundEffects } from '@/hooks/useSoundEffects';
// import { useEffect, useState, useRef, useCallback, useTransition } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Assets
// import leahImage from '@/assets/character-leah.png';
// import photoImage from '@/assets/object-photo.png';
// import newspaperImage from '@/assets/object-newspaper.png';
// import drawingImage from '@/assets/object-drawing.png';
// import mirrorImage from '@/assets/object-mirror.png';
// import boxImage from '@/assets/object-box.png';
// import bedroomBg from '@/assets/bg-bedroom.png';

// export const Chapter1 = () => {
//   const {
//     setDialogue,
//     addMemory,
//     completeChapter,
//     setCurrentChapter,
//     triggerSensoryOverload,
//     triggerPanicAttack,
//     sensoryOverload,
//     isDead,
//     playerPosition,
//     setPlayerPosition,
//     progress: { collectedMemories },
//     resetDeath,
//   } = useGameStore();
  
//   const navigate = useNavigate();
//   const { playSound } = useSoundEffects(); // ✅ NOW SAFE!

//   // 💔 EMOTIONAL TRANSITION STATES
//   const [isTransitioning, startTransition] = useTransition();
//   const [showTransitionOverlay, setShowTransitionOverlay] = useState(false);
//   const [transitionPhase, setTransitionPhase] = useState<'none' | 'aligning' | 'realization' | 'forward'>('none');
//   const [memoryFragments, setMemoryFragments] = useState(0);

//   // Local states
//   const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);
//   const [hasShownIntro, setHasShownIntro] = useState(false);
//   const [hasCompletedChapter, setHasCompletedChapter] = useState(false);

//   const chapterMemories = [
//     'photo-rowan', 'newspaper-article', 'childhood-drawing', 
//     'mirror-reflection', 'rowans-box'
//   ];

//   const objectPositions = useRef([
//     { id: 'photo', pos: [-4, 1.6, -5] },
//     { id: 'newspaper', pos: [-2, 1.6, -5] },
//     { id: 'drawing', pos: [3, 1, 3] },
//     { id: 'mirror', pos: [-8, 2, 5] },
//     { id: 'box', pos: [5, 1, -7] },
//   ]);

//   // 🏠 CHAPTER INIT
//   useEffect(() => {
//     setPlayerPosition([0, 1, 0]);
//     setCurrentChapter(1);
//     resetDeath();
//   }, [setPlayerPosition, setCurrentChapter, resetDeath]);

//   // Track nearby objects
//   useEffect(() => {
//     const nearby = objectPositions.current.map((obj) => {
//       const distance = Math.sqrt(
//         Math.pow(playerPosition[0] - obj.pos[0], 2) +
//         Math.pow(playerPosition[2] - obj.pos[2], 2)
//       );
//       return { id: obj.id, distance };
//     });
//     setNearbyObjects(nearby);
//   }, [playerPosition]);

//   // Intro dialogue
//   useEffect(() => {
//     if (!hasShownIntro) {
//       const timer = setTimeout(() => {
//         setDialogue({ 
//           text: `I'm back... after all these years. The house feels smaller now.`, 
//           speaker: 'player' 
//         });
//         setHasShownIntro(true);
//       }, 1000);
//       return () => {
//         clearTimeout(timer);
//         setDialogue(null);
//       };
//     }
//   }, [setDialogue, hasShownIntro]);

//   // 💔 CHECK COMPLETION
//   const checkChapterCompletion = useCallback(() => {
//     if (hasCompletedChapter || transitionPhase !== 'none') return false;
//     const collectedInChapter = chapterMemories.filter(mem => collectedMemories.includes(mem));
//     return collectedInChapter.length === chapterMemories.length;
//   }, [collectedMemories, hasCompletedChapter, transitionPhase, chapterMemories]);

//   // 💔 EMOTIONAL MEMORY ALIGNMENT
//   useEffect(() => {
//     if (checkChapterCompletion()) {
//       document.body.classList.add('transition-active');
      
//       const emotionalSequence = async () => {
//         // Phase 1: Realization
//         setDialogue({ 
//           text: `All the pieces... they're coming together. It wasn't my fault... was it?`, 
//           speaker: 'player' 
//         });
//         await new Promise(r => setTimeout(r, 4000));
        
//         // Phase 2: Alignment begins
//         setTransitionPhase('aligning');
//         setMemoryFragments(1);
//         playSound('heartbeat');
        
//         const fragmentInterval = setInterval(() => {
//           setMemoryFragments(prev => {
//             if (prev < 5) {
//               playSound('memory-align');
//               return prev + 1;
//             }
//             return prev;
//           });
//         }, 800);
        
//         await new Promise(r => setTimeout(r, 4500));
//         clearInterval(fragmentInterval);
        
//         // Phase 3: Sensory overload
//         setTransitionPhase('realization');
//         setShowTransitionOverlay(true);
//         playSound('realization');
//         await new Promise(r => setTimeout(r, 4000));
        
//         // Phase 4: Forward
//         setTransitionPhase('forward');
//         await new Promise(r => setTimeout(r, 2000));
        
//         // Complete chapter
//         completeChapter(1);
//         setHasCompletedChapter(true);
//         setCurrentChapter(2);
        
//         document.body.classList.remove('transition-active');
//         startTransition(() => navigate('/chapter/2'));
//       };
      
//       emotionalSequence();
//     }
//   }, [checkChapterCompletion, completeChapter, setDialogue, setHasCompletedChapter, 
//       setCurrentChapter, navigate, startTransition, playSound, transitionPhase]);

//   // 🖱️ INTERACTION HANDLERS
//   const handleInteract = useCallback((objectId: string) => {
//     if (transitionPhase !== 'none') return;
    
//     const collected = collectedMemories;
    
//     switch (objectId) {
//       case 'photo':
//         if (!collected.includes('photo-rowan')) {
//           addMemory('photo-rowan');
//           playSound('collect');
//           setDialogue({ 
//             text: `Rowan and me... we were inseparable. What happened that day?`, 
//             speaker: 'player' 
//           });
//         }
//         break;
//       case 'newspaper':
//         if (!collected.includes('newspaper-article')) {
//           addMemory('newspaper-article');
//           playSound('panic');
//           triggerSensoryOverload(4000);
//           setTimeout(() => {
//             setDialogue({ 
//               text: `"Boy, 12, institutionalized after tragic bridge incident"... They made me a monster.`, 
//               speaker: 'player' 
//             });
//           }, 4000);
//         }
//         break;
//       case 'drawing':
//         if (!collected.includes('childhood-drawing')) {
//           addMemory('childhood-drawing');
//           playSound('collect');
//           setDialogue({ 
//             text: `My old drawings... I used to draw the boats we'd make together.`, 
//             speaker: 'player' 
//           });
//         }
//         break;
//       case 'mirror':
//         if (!collected.includes('mirror-reflection')) {
//           addMemory('mirror-reflection');
//           playSound('collect');
//           setDialogue({ 
//             text: `I don't recognize myself anymore. Who am I without that label?`, 
//             speaker: 'player' 
//           });
//         }
//         break;
//       case 'box':
//         if (!collected.includes('rowans-box')) {
//           addMemory('rowans-box');
//           playSound('collect');
//           setDialogue({ 
//             text: `Rowan's things... Mom kept them all this time.`, 
//             speaker: 'player' 
//           });
//         }
//         break;
//     }
//   }, [collectedMemories, addMemory, playSound, triggerSensoryOverload, setDialogue, transitionPhase]);

//   const handleBullyContact = useCallback(() => {
//     if (!isDead && transitionPhase === 'none') {
//       playSound('panic');
//       triggerPanicAttack();
//       setDialogue({ 
//         text: `Too close... can't breathe... everything is spinning...`, 
//         speaker: 'player' 
//       });
//     }
//   }, [isDead, playSound, triggerPanicAttack, setDialogue, transitionPhase]);

//   const isTransitionActive = transitionPhase !== 'none';

//   // 💔 EMOTIONAL OVERLAY
//   const renderEmotionalOverlay = () => {
//     if (!showTransitionOverlay && transitionPhase === 'none') return null;
    
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 overflow-hidden">
//         {/* Pulsing background */}
//         <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-rose-900/30 to-purple-900/20 animate-pulse-slow"></div>
        
//         {/* Memory fragments */}
//         <div className="absolute inset-0 grid grid-cols-5 gap-4 p-8 pointer-events-none">
//           {chapterMemories.map((memory, index) => (
//             <div 
//               key={memory}
//               className={`w-16 h-16 rounded-lg border-2 transition-all duration-700 flex items-center justify-center text-sm font-medium ${
//                 transitionPhase === 'aligning' && memoryFragments >= (index + 1)
//                   ? 'bg-white/10 border-white/50 scale-110 animate-memory-align text-white shadow-lg shadow-white/20'
//                   : 'bg-white/5 border-white/10 scale-75 opacity-30'
//               }`}
//             >
//               {memory.split('-')[0]}
//             </div>
//           ))}
//         </div>
        
//         {/* Center content */}
//         <div className="relative z-10 text-center text-white max-w-2xl mx-8">
//           {transitionPhase === 'aligning' && (
//             <div>
//               <div className="text-4xl mb-6 animate-heartbeat">💔</div>
//               <div className="text-2xl font-light mb-4 tracking-wide">Memories Aligning...</div>
//               <div className="flex justify-center gap-2 mb-6">
//                 <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
//                 <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
//                 <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
//               </div>
//               <p className="text-sm opacity-75 font-light">The truth begins to surface...</p>
//             </div>
//           )}
          
//           {transitionPhase === 'realization' && (
//             <div className="animate-fade-in-up">
//               <div className="text-6xl mb-6">⚡</div>
//               <h2 className="text-3xl font-light mb-4 tracking-wide">SENSORY OVERLOAD</h2>
//               <p className="text-lg opacity-90 mb-6 leading-relaxed">
//                 It wasn't intentional... the world became too much...
//               </p>
//               <div className="w-32 h-32 border-2 border-white/30 rounded-full mx-auto mb-6 animate-pulse-slow"></div>
//             </div>
//           )}
          
//           {transitionPhase === 'forward' && (
//             <div className="animate-fade-in-up">
//               <div className="text-5xl mb-6">➤</div>
//               <div className="text-3xl font-semibold mb-4">CHAPTER 2</div>
//               <div className="text-xl font-light mb-6">Echoes in the Halls</div>
//               <p className="text-sm opacity-75 font-light">To the school... where it all began</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full h-screen relative">
//       {/* 💔 EMOTIONAL OVERLAY */}
//       {renderEmotionalOverlay()}
      
//       <Canvas
//         shadows
//         camera={{ position: [0, 8, 10], fov: 60 }}
//         className={`${sensoryOverload ? 'sensory-overload' : ''} ${
//           isTransitionActive ? 'opacity-10 pointer-events-none' : ''
//         } transition-all duration-1000`}
//       >
//         <ambientLight intensity={0.3} />
//         <directionalLight 
//           position={[5, 10, 5]} 
//           intensity={0.5} 
//           castShadow 
//           shadow-mapSize-width={2048} 
//           shadow-mapSize-height={2048} 
//         />
//         <pointLight position={[-5, 3, -5]} intensity={0.5} color="#6B8FB5" />
//         <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.6} azimuth={0.25} />
//         <RainEffect />
        
//         <Player 
//           onInteract={handleInteract} 
//           nearbyObjects={nearbyObjects} 
//           isTransitioning={isTransitionActive} 
//         />
//         <Environment theme="home" backgroundImage={bedroomBg} />
        
//         {/* Bullies */}
//         <Bully 
//           id="bully1" 
//           initialPosition={[5, 1, -5]} 
//           onPlayerContact={handleBullyContact} 
//           playerPosition={playerPosition} 
//         />
//         <Bully 
//           id="bully2" 
//           initialPosition={[-7, 1, 3]} 
//           onPlayerContact={handleBullyContact} 
//           playerPosition={playerPosition} 
//         />
        
//         {/* NPC Leah */}
//         <NPC
//           id="leah"
//           name="Leah"
//           position={[-8, 1, -8]}
//           textureUrl={leahImage}
//           dialogues={[
//             `Eli? Is that really you? It's been such a long time...`,
//             `I never believed the things people said about you. What happened back then was an accident.`,
//             `I still have some of Rowan's things. They're in the school—maybe they'll help you remember.`,
//             `Be careful around those guys. They're still causing trouble, just like before.`,
//           ]}
//           playerPosition={playerPosition}
//           onInteract={(npcId, dialogues) => {
//             if (transitionPhase === 'none') playSound('dialogue');
//           }}
//         />

//         {/* Interactive Objects */}
//         <InteractiveObject 
//           position={[-4, 1.6, -5]} 
//           objectId="photo" 
//           label="Photo Frame" 
//           onInteract={handleInteract} 
//           color="#A8B5E0" 
//           memoryId="photo-rowan" 
//           textureUrl={photoImage} 
//         />
//         <InteractiveObject 
//           position={[-2, 1.6, -5]} 
//           objectId="newspaper" 
//           label="Old Newspaper" 
//           onInteract={handleInteract} 
//           color="#E0A8A8" 
//           memoryId="newspaper-article" 
//           textureUrl={newspaperImage} 
//         />
//         <InteractiveObject 
//           position={[3, 1, 3]} 
//           objectId="drawing" 
//           label="Childhood Drawing" 
//           onInteract={handleInteract} 
//           color="#D4A8E0" 
//           memoryId="childhood-drawing" 
//           textureUrl={drawingImage} 
//         />
//         <InteractiveObject 
//           position={[-8, 2, 5]} 
//           objectId="mirror" 
//           label="Mirror" 
//           onInteract={handleInteract} 
//           color="#A8D4E0" 
//           memoryId="mirror-reflection" 
//           textureUrl={mirrorImage} 
//         />
//         <InteractiveObject 
//           position={[5, 1, -7]} 
//           objectId="box" 
//           label="Cardboard Box" 
//           onInteract={handleInteract} 
//           color="#E0D4A8" 
//           memoryId="rowans-box" 
//           textureUrl={boxImage} 
//         />
        
//         <OrbitControls 
//           enablePan={false} 
//           enableZoom={false} 
//           enableRotate={false} 
//           maxPolarAngle={Math.PI / 2} 
//           minPolarAngle={Math.PI / 3} 
//         />
//       </Canvas>

//       <GameHUD 
//         chapter={1} 
//         chapterTitle="Homecoming" 
//         nearbyObjects={nearbyObjects} 
//         isTransitioning={isTransitionActive} 
//       />
//       <DialogueBox />
      
//       {/* Panic Attack Screen */}
//       {isDead && !isTransitionActive && (
//         <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center z-50">
//           <div className="text-center">
//             <h2 className="text-4xl font-bold text-destructive-foreground mb-4 animate-pulse">
//               Panic Attack
//             </h2>
//             <p className="text-xl text-destructive-foreground mb-4">Restarting...</p>
//             <button
//               onClick={() => resetDeath()}
//               className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
//             >
//               Respawn
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { Bully } from './Bully';
import { NPC } from './NPC';
import { RainEffect } from './RainEffect';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect, useState, useRef, useCallback, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';

// Assets
import leahImage from '@/assets/character-leah.png';
import photoImage from '@/assets/object-photo.png';
import newspaperImage from '@/assets/object-newspaper.png';
import drawingImage from '@/assets/object-drawing.png';
import mirrorImage from '@/assets/object-mirror.png';
import boxImage from '@/assets/object-box.png';
import bedroomBg from '@/assets/bg-bedroom.png';

export const Chapter1 = () => {
  const {
    setDialogue,
    addMemory,
    completeChapter,
    setCurrentChapter,
    triggerSensoryOverload,
    triggerPanicAttack,
    sensoryOverload,
    isDead,
    playerPosition,
    setPlayerPosition,
    progress: { collectedMemories },
    resetDeath,
  } = useGameStore();
  
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();

  // 💔 EMOTIONAL TRANSITION STATES
  const [isTransitioning, startTransition] = useTransition();
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'none' | 'aligning' | 'realization' | 'forward'>('none');
  const [memoryFragments, setMemoryFragments] = useState(0);
  const [hasTriggeredTransition, setHasTriggeredTransition] = useState(false); // ✅ NEW: PREVENTS REPEATED TRANSITIONS

  // Local states
  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);
  const [npcDialogueIndices, setNpcDialogueIndices] = useState<{ [id: string]: number }>({});
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [hasCompletedChapter, setHasCompletedChapter] = useState(false);

  const chapterMemories = [
    'photo-rowan',
    'newspaper-article',
    'childhood-drawing',
    'mirror-reflection',
    'rowans-box',
  ];

  const objectPositions = useRef([
    { id: 'photo', pos: [-4, 1.6, -5] },
    { id: 'newspaper', pos: [-2, 1.6, -5] },
    { id: 'drawing', pos: [3, 1, 3] },
    { id: 'mirror', pos: [-8, 2, 5] },
    { id: 'box', pos: [5, 1, -7] },
  ]);

  // 💔 CHAPTER INIT
  useEffect(() => {
    setPlayerPosition([0, 1, 0]);
    setCurrentChapter(1);
    resetDeath();
  }, [setPlayerPosition, setCurrentChapter, resetDeath]);

  // Track nearby objects
  useEffect(() => {
    const nearby = objectPositions.current.map((obj) => {
      const distance = Math.sqrt(
        Math.pow(playerPosition[0] - obj.pos[0], 2) +
        Math.pow(playerPosition[2] - obj.pos[2], 2)
      );
      return { id: obj.id, distance };
    });
    setNearbyObjects(nearby);
  }, [playerPosition]);

  // Intro dialogue
  useEffect(() => {
    if (!hasShownIntro) {
      const timer = setTimeout(() => {
        setDialogue({ 
          text: `I'm back... after all these years. The house feels smaller now.`, 
          speaker: 'player' 
        });
        setHasShownIntro(true);
      }, 1000);
      return () => {
        clearTimeout(timer);
        setDialogue(null);
      };
    }
  }, [setDialogue, hasShownIntro]);

  // 💔 MEMORY ALIGNMENT CHECK
  const checkChapterCompletion = useCallback(() => {
    if (hasCompletedChapter || transitionPhase !== 'none' || hasTriggeredTransition) return false;
    
    const collectedInChapter = chapterMemories.filter((mem) =>
      collectedMemories.includes(mem)
    );
    
    const isComplete = collectedInChapter.length === chapterMemories.length;
    console.log('💔 Chapter 1 Memory Alignment:', {
      total: chapterMemories.length,
      aligned: collectedInChapter.length,
      complete: isComplete
    });
    
    return isComplete;
  }, [collectedMemories, hasCompletedChapter, transitionPhase, hasTriggeredTransition]);

  // 💔 EMOTIONAL MEMORY ALIGNMENT SEQUENCE (SINGLE EXECUTION)
  useEffect(() => {
    if (checkChapterCompletion()) {
      setHasTriggeredTransition(true); // ✅ PREVENT RE-RUNS
      console.log('💔 MEMORIES ALIGNING - EMOTIONAL BREAKTHROUGH');
      
      document.body.classList.add('transition-active');
      
      const emotionalSequence = async () => {
        // Phase 1: Final piece found
        setDialogue({ 
          text: `All the pieces... they're coming together. It wasn't my fault... was it?`, 
          speaker: 'player' 
        });
        
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Phase 2: Memories start aligning
        setTransitionPhase('aligning');
        setMemoryFragments(1);
        playSound('heartbeat');
        
        // Animate memory fragments aligning
        const fragmentInterval = setInterval(() => {
          setMemoryFragments(prev => {
            if (prev < 5) {
              playSound('memory-align');
              return prev + 1;
            }
            return prev;
          });
        }, 800);
        
        await new Promise(resolve => setTimeout(resolve, 4500));
        clearInterval(fragmentInterval);
        
        // Phase 3: Realization
        setTransitionPhase('realization');
        setShowTransitionOverlay(true);
        playSound('realization');
        
        setTimeout(() => {
          setDialogue({
            text: `I can see it now... the overload... the accident... I need to understand what really happened.`,
            speaker: 'player'
          });
        }, 1000);
        
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Phase 4: Moving forward
        setTransitionPhase('forward');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Complete & transition
        completeChapter(1);
        setHasCompletedChapter(true);
        setCurrentChapter(2);
        
        document.body.classList.remove('transition-active');
        console.log('💔 MOVING TO SCHOOL - SEARCHING FOR TRUTH');
        startTransition(() => {
          navigate('/chapter/2');
        });
      };
      
      emotionalSequence();
    }
  }, [checkChapterCompletion, completeChapter, setDialogue, setHasCompletedChapter, 
      setCurrentChapter, navigate, startTransition, playSound]);

  // 🖱️ Handle interactions
  const handleInteract = useCallback((objectId: string) => {
    if (transitionPhase !== 'none') return;
    
    const collected = collectedMemories;
    switch (objectId) {
      case 'photo':
        if (!collected.includes('photo-rowan')) {
          addMemory('photo-rowan');
          playSound('collect');
          setDialogue({ text: `Rowan and me... we were inseparable. What happened that day?`, speaker: 'player' });
        }
        break;
      case 'newspaper':
        if (!collected.includes('newspaper-article')) {
          addMemory('newspaper-article');
          playSound('panic');
          triggerSensoryOverload(4000);
          setTimeout(() => {
            setDialogue({ text: `"Boy, 12, institutionalized after tragic bridge incident"... They made me a monster.`, speaker: 'player' });
          }, 4000);
        }
        break;
      case 'drawing':
        if (!collected.includes('childhood-drawing')) {
          addMemory('childhood-drawing');
          playSound('collect');
          setDialogue({ text: `My old drawings... I used to draw the boats we'd make together.`, speaker: 'player' });
        }
        break;
      case 'mirror':
        if (!collected.includes('mirror-reflection')) {
          addMemory('mirror-reflection');
          playSound('collect');
          setDialogue({ text: `I don't recognize myself anymore. Who am I without that label?`, speaker: 'player' });
        }
        break;
      case 'box':
        if (!collected.includes('rowans-box')) {
          addMemory('rowans-box');
          playSound('collect');
          setDialogue({ text: `Rowan's things... Mom kept them all this time.`, speaker: 'player' });
        }
        break;
    }
  }, [collectedMemories, addMemory, playSound, triggerSensoryOverload, setDialogue, transitionPhase]);

  // Handle NPC interaction
  const handleNPCInteract = useCallback((npcId: string, dialogues: string[]) => {
    if (transitionPhase !== 'none') return;
    
    playSound('dialogue');
    setNpcDialogueIndices((prev) => {
      const currentIndex = prev[npcId] ?? 0;
      let nextIndex = currentIndex;
      if (npcId === 'leah') {
        nextIndex = Math.min(currentIndex + 1, dialogues.length - 1);
      } else {
        nextIndex = (currentIndex + 1) % dialogues.length;
      }
      setDialogue({ text: dialogues[currentIndex], speaker: npcId });
      return { ...prev, [npcId]: nextIndex };
    });
  }, [playSound, setDialogue, transitionPhase]);

  // Handle bully collision
  const handleBullyContact = useCallback(() => {
    if (!isDead && transitionPhase === 'none') {
      playSound('panic');
      triggerPanicAttack();
      setDialogue({ text: `Too close... can't breathe... everything is spinning...`, speaker: 'player' });
    }
  }, [isDead, playSound, triggerPanicAttack, setDialogue, transitionPhase]);

  const isTransitionActive = transitionPhase !== 'none';

  // 💔 EMOTIONAL TRANSITION OVERLAY (UNCHANGED FROM YOUR CODE)
  const renderEmotionalOverlay = () => {
    if (!showTransitionOverlay && transitionPhase === 'none') return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 overflow-hidden">
        {/* Pulsing heartbeat background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-rose-900/30 to-purple-900/20 animate-pulse-slow"></div>
        
        {/* Memory fragments grid */}
        <div className="absolute inset-0 grid grid-cols-5 gap-4 p-8 pointer-events-none">
          {chapterMemories.map((memory, index) => (
            <div 
              key={memory}
              className={`w-16 h-16 rounded-lg border-2 transition-all duration-700 flex items-center justify-center text-sm font-medium ${
                transitionPhase === 'aligning' && memoryFragments >= (index + 1)
                  ? 'bg-white/10 border-white/50 scale-110 animate-memory-align text-white shadow-lg shadow-white/20'
                  : 'bg-white/5 border-white/10 scale-75 opacity-30'
              }`}
            >
              {memory.split('-')[0]}
            </div>
          ))}
        </div>
        
        {/* Center emotional content */}
        <div className="relative z-10 text-center text-white max-w-2xl mx-8">
          {transitionPhase === 'aligning' && (
            <div>
              <div className="text-4xl mb-6 animate-heartbeat">💔</div>
              <div className="text-2xl font-light mb-4 tracking-wide">
                Memories Aligning...
              </div>
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <p className="text-sm opacity-75 font-light">The truth begins to surface...</p>
            </div>
          )}
          
          {transitionPhase === 'realization' && (
            <div className="animate-fade-in-up">
              <div className="text-6xl mb-6">⚡</div>
              <h2 className="text-3xl font-light mb-4 tracking-wide">SENSORY OVERLOAD</h2>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">
                It wasn't intentional... the world became too much...
              </p>
              <div className="w-32 h-32 border-2 border-white/30 rounded-full mx-auto mb-6 animate-pulse-slow"></div>
            </div>
          )}
          
          {transitionPhase === 'forward' && (
            <div className="animate-fade-in-up">
              <div className="text-5xl mb-6">➤</div>
              <div className="text-3xl font-semibold mb-4">CHAPTER 2</div>
              <div className="text-xl font-light mb-6">Echoes in the Halls</div>
              <p className="text-sm opacity-75 font-light">
                To the school... where it all began
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen relative">
      {/* 💔 EMOTIONAL MEMORY OVERLAY */}
      {renderEmotionalOverlay()}
      
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 60 }}
        className={`${sensoryOverload ? 'sensory-overload' : ''} ${
          isTransitionActive ? 'opacity-10 pointer-events-none' : ''
        } transition-all duration-1000`}
      >
        {/* Canvas content stays the same */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#6B8FB5" />
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.6} azimuth={0.25} />
        <RainEffect />
        <Player onInteract={handleInteract} nearbyObjects={nearbyObjects} isTransitioning={isTransitionActive} />
        <Environment theme="home" backgroundImage={bedroomBg} />
        <Bully id="bully1" initialPosition={[5, 1, -5]} onPlayerContact={handleBullyContact} playerPosition={playerPosition} />
        <Bully id="bully2" initialPosition={[-7, 1, 3]} onPlayerContact={handleBullyContact} playerPosition={playerPosition} />
        <NPC
          id="leah"
          name="Leah"
          position={[-8, 1, -8]}
          textureUrl={leahImage}
          dialogues={[
            `Eli? Is that really you? It's been such a long time...`,
            `I never believed the things people said about you. What happened back then was an accident.`,
            `I still have some of Rowan's things. They're in the school—maybe they'll help you remember.`,
            `Be careful around those guys. They're still causing trouble, just like before.`,
          ]}
          playerPosition={playerPosition}
          onInteract={handleNPCInteract}
        />
        <InteractiveObject position={[-4, 1.6, -5]} objectId="photo" label="Photo Frame" onInteract={handleInteract} color="#A8B5E0" memoryId="photo-rowan" textureUrl={photoImage} />
        <InteractiveObject position={[-2, 1.6, -5]} objectId="newspaper" label="Old Newspaper" onInteract={handleInteract} color="#E0A8A8" memoryId="newspaper-article" textureUrl={newspaperImage} />
        <InteractiveObject position={[3, 1, 3]} objectId="drawing" label="Childhood Drawing" onInteract={handleInteract} color="#D4A8E0" memoryId="childhood-drawing" textureUrl={drawingImage} />
        <InteractiveObject position={[-8, 2, 5]} objectId="mirror" label="Mirror" onInteract={handleInteract} color="#A8D4E0" memoryId="mirror-reflection" textureUrl={mirrorImage} />
        <InteractiveObject position={[5, 1, -7]} objectId="box" label="Cardboard Box" onInteract={handleInteract} color="#E0D4A8" memoryId="rowans-box" textureUrl={boxImage} />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>

      <GameHUD chapter={1} chapterTitle="Homecoming" nearbyObjects={nearbyObjects} isTransitioning={isTransitionActive} />
      <DialogueBox />
      {isDead && transitionPhase === 'none' && (
        <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-destructive-foreground mb-4 animate-pulse">Panic Attack</h2>
            <p className="text-xl text-destructive-foreground mb-4">Restarting...</p>
            <button onClick={() => resetDeath()} className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">Respawn</button>
          </div>
        </div>
      )}
    </div>
  );
};