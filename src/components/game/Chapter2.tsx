import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { Bully } from './Bully';
import { NPC } from './NPC';
import { RainEffect } from './RainEffect';
import { MovingObstacle } from './MovingObstacle';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect, useState, useRef, useCallback, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';

// Assets
import leahImage from '@/assets/character-leah.png';
import schoolBg from '@/assets/bg-school.png';
import photoImage from '@/assets/object-photo.png';
import newspaperImage from '@/assets/object-newspaper.png';
import drawingImage from '@/assets/object-drawing.png';
import boxImage from '@/assets/object-box.png';
import mirrorImage from '@/assets/object-mirror.png';
import obstacleImage from '@/assets/character-bully.png';

export const Chapter2 = () => {
  // Global store and navigation
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
  const [hasTriggeredTransition, setHasTriggeredTransition] = useState(false);

  // Local states
  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);
  const [npcDialogueIndex, setNpcDialogueIndex] = useState(0);
  const [hasCompletedChapter, setHasCompletedChapter] = useState(false);

  const chapterMemories = [
    'desk-memory',
    'locker-memory',
    'note-memory',
    'classroom-memory',
    'hallway-memory',
  ];

  const objectPositions = useRef([
    { id: 'desk', pos: [-4, 1, -5] },
    { id: 'locker', pos: [4, 1.5, -4] },
    { id: 'note', pos: [0, 1.2, 3] },
    { id: 'classroom', pos: [-6, 1, 4] },
    { id: 'hallway', pos: [6, 1, 5] },
  ]);

  // Leah NPC dialogues
  const leahDialogues = [
    'Welcome back, Eli. I know this place holds difficult memories.',
    "It feels like time stopped here... everything's the same, yet not.",
    "You're not alone. The past doesn't have to define you.",
    "Thanks, Leah. I'm trying to move forward.",
    "Take your time exploring. I'll be here if you need to talk.",
  ];

  // 💔 CHAPTER INIT
  useEffect(() => {
    setPlayerPosition([0, 1, 0]);
    setCurrentChapter(2);
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
    const timer = setTimeout(() => {
      setDialogue({
        text: `The school halls... everything looks smaller now, but the memories feel larger.`,
        speaker: 'player',
      });
    }, 1000);
    return () => {
      clearTimeout(timer);
      setDialogue(null);
    };
  }, [setDialogue]);

  // 💔 MEMORY ALIGNMENT CHECK
  const checkChapterCompletion = useCallback(() => {
    if (hasCompletedChapter || transitionPhase !== 'none' || hasTriggeredTransition) return false;
    
    const collectedInChapter = chapterMemories.filter((mem) =>
      collectedMemories.includes(mem)
    );
    
    console.log('💔 Chapter 2 Memory Alignment:', {
      total: chapterMemories.length,
      aligned: collectedInChapter.length,
      complete: collectedInChapter.length === chapterMemories.length,
    });
    
    return collectedInChapter.length === chapterMemories.length;
  }, [collectedMemories, hasCompletedChapter, transitionPhase, hasTriggeredTransition]);

  // 💔 EMOTIONAL MEMORY ALIGNMENT SEQUENCE
  useEffect(() => {
    if (checkChapterCompletion()) {
      setHasTriggeredTransition(true);
      console.log('💔 MEMORIES ALIGNING - EMOTIONAL BREAKTHROUGH');
      
      document.body.classList.add('transition-active');
      
      const emotionalSequence = async () => {
        // Phase 1: Final piece found
        setDialogue({
          text: `All the pieces... they're coming together. The school, that day... what really happened?`,
          speaker: 'player',
        });
        await new Promise((resolve) => setTimeout(resolve, 4000));
        
        // Phase 2: Memories start aligning
        setTransitionPhase('aligning');
        setMemoryFragments(1);
        playSound('heartbeat');
        
        const fragmentInterval = setInterval(() => {
          setMemoryFragments((prev) => {
            if (prev < 5) {
              playSound('memory-align');
              return prev + 1;
            }
            return prev;
          });
        }, 800);
        
        await new Promise((resolve) => setTimeout(resolve, 4500));
        clearInterval(fragmentInterval);
        
        // Phase 3: Realization
        setTransitionPhase('realization');
        setShowTransitionOverlay(true);
        playSound('realization');
        
        setTimeout(() => {
          setDialogue({
            text: `It wasn't my fault... the pressure, the noise... I need to know more.`,
            speaker: 'player',
          });
        }, 1000);
        
        await new Promise((resolve) => setTimeout(resolve, 4000));
        
        // Phase 4: Moving forward
        setTransitionPhase('forward');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Complete & transition
        completeChapter(2);
        setHasCompletedChapter(true);
        setCurrentChapter(3);
        
        document.body.classList.remove('transition-active');
        console.log('🌟 MOVING TO CHAPTER 3 - SEARCHING FOR TRUTH');
        startTransition(() => {
          navigate('/chapter/3');
        });
      };
      
      emotionalSequence();
    }
  }, [checkChapterCompletion, completeChapter, setDialogue, setHasCompletedChapter, 
      setCurrentChapter, navigate, startTransition, playSound]);

  // Handle object interaction
  const handleInteract = useCallback((objectId: string) => {
    if (transitionPhase !== 'none') return;
    
    console.log('🖱️ INTERACT:', objectId, 'Current memories:', collectedMemories);
    
    const collected = collectedMemories;
    switch (objectId) {
      case 'desk':
        if (!collected.includes('desk-memory')) {
          console.log('✅ ADDING desk-memory');
          addMemory('desk-memory');
          playSound('collect');
          setDialogue({
            text: `This was my desk. I carved our initials under here.`,
            speaker: 'player',
          });
        }
        break;
      case 'locker':
        if (!collected.includes('locker-memory')) {
          console.log('✅ ADDING locker-memory');
          addMemory('locker-memory');
          playSound('collect');
          setDialogue({
            text: `The locker we shared. So many secrets hidden inside.`,
            speaker: 'player',
          });
        }
        break;
      case 'note':
        if (!collected.includes('note-memory')) {
          console.log('✅ ADDING note-memory');
          addMemory('note-memory');
          playSound('collect');
          triggerSensoryOverload(3000);
          setTimeout(() => {
            setDialogue({
              text: `A note from Rowan... I never got to read it that day.`,
              speaker: 'player',
            });
          }, 3000);
        }
        break;
      case 'classroom':
        if (!collected.includes('classroom-memory')) {
          console.log('✅ ADDING classroom-memory');
          addMemory('classroom-memory');
          playSound('collect');
          setDialogue({
            text: `We sat together, always in the back corner.`,
            speaker: 'player',
          });
        }
        break;
      case 'hallway':
        if (!collected.includes('hallway-memory')) {
          console.log('✅ ADDING hallway-memory');
          addMemory('hallway-memory');
          playSound('collect');
          setDialogue({
            text: `This is where everything started to fall apart.`,
            speaker: 'player',
          });
        }
        break;
    }
  }, [collectedMemories, addMemory, playSound, triggerSensoryOverload, setDialogue, transitionPhase]);

  // Handle NPC interaction
  const handleNPCInteract = useCallback((npcId: string, dialogues: string[]) => {
    if (transitionPhase !== 'none' || npcId !== 'leah') return;
    
    playSound('dialogue');
    const currentIndex = npcDialogueIndex % dialogues.length;
    const currentLine = dialogues[currentIndex];
    setDialogue({
      text: currentLine,
      speaker: currentIndex % 2 === 0 ? 'leah' : 'player',
    });
    setTimeout(() => {
      setNpcDialogueIndex((prev) => prev + 1);
    }, 2500);
  }, [npcDialogueIndex, playSound, setDialogue, transitionPhase]);

  // Handle bully/obstacle collision
  const handleBullyContact = useCallback(() => {
    if (!isDead && transitionPhase === 'none') {
      playSound('panic');
      triggerPanicAttack();
      setDialogue({
        text: `Can't escape them... heart racing... everything is closing in...`,
        speaker: 'player',
      });
    }
  }, [isDead, playSound, triggerPanicAttack, setDialogue, transitionPhase]);

  const isTransitionActive = transitionPhase !== 'none';

  // 💔 EMOTIONAL TRANSITION OVERLAY
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
              <div className="text-3xl font-semibold mb-4">CHAPTER 3</div>
              <div className="text-xl font-light mb-6">Beyond the Halls</div>
              <p className="text-sm opacity-75 font-light">
                To the truth... where the answers await
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
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.6}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.4} color="#8B9DC3" />
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.5}
          azimuth={0.3}
        />
        <RainEffect />
        <Player
          onInteract={handleInteract}
          nearbyObjects={nearbyObjects}
          isTransitioning={isTransitionActive}
        />
        <Environment theme="school" backgroundImage={schoolBg} />
        <Bully
          id="bully1"
          initialPosition={[8, 1, -6]}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
        />
        <Bully
          id="bully2"
          initialPosition={[-5, 1, 7]}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
        />
        <Bully
          id="bully3"
          initialPosition={[3, 1, -8]}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
        />
        <MovingObstacle
          id="obstacle1"
          initialPosition={[-6, 1, 0]}
          path={[
            [-6, 1, 0],
            [6, 1, 0],
            [6, 1, -6],
            [-6, 1, -6],
          ]}
          speed={0.03}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
          textureUrl={obstacleImage}
        />
        <NPC
          id="leah"
          name="Leah"
          position={[-7, 1, -7]}
          textureUrl={leahImage}
          dialogues={leahDialogues}
          playerPosition={playerPosition}
          onInteract={handleNPCInteract}
        />
        <InteractiveObject
          position={[-4, 1, -5]}
          objectId="desk"
          label="Old Desk"
          onInteract={handleInteract}
          color="#B5A8E0"
          memoryId="desk-memory"
          textureUrl={drawingImage}
        />
        <InteractiveObject
          position={[4, 1.5, -4]}
          objectId="locker"
          label="School Locker"
          onInteract={handleInteract}
          color="#A8C5E0"
          memoryId="locker-memory"
          textureUrl={boxImage}
        />
        <InteractiveObject
          position={[0, 1.2, 3]}
          objectId="note"
          label="Hidden Note"
          onInteract={handleInteract}
          color="#E0B5A8"
          memoryId="note-memory"
          textureUrl={newspaperImage}
        />
        <InteractiveObject
          position={[-6, 1, 4]}
          objectId="classroom"
          label="Classroom Door"
          onInteract={handleInteract}
          color="#C5E0A8"
          memoryId="classroom-memory"
          textureUrl={photoImage}
        />
        <InteractiveObject
          position={[6, 1, 5]}
          objectId="hallway"
          label="Hallway Corner"
          onInteract={handleInteract}
          color="#E0D4B5"
          memoryId="hallway-memory"
          textureUrl={mirrorImage}
        />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      <GameHUD
        chapter={2}
        chapterTitle="Echoes in the Halls"
        nearbyObjects={nearbyObjects}
        isTransitioning={isTransitionActive}
      />
      <DialogueBox />
      
      {isDead && transitionPhase === 'none' && (
        <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-destructive-foreground mb-4 animate-pulse">
              Panic Attack
            </h2>
            <p className="text-xl text-destructive-foreground mb-4">Restarting...</p>
            <button
              onClick={() => resetDeath()}
              className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Respawn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};