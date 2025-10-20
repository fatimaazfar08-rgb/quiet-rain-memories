import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { Bully } from './Bully';
import { RainEffect } from './RainEffect';
import { WaterSurface } from './WaterSurface';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect, useState, useRef, useCallback, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import bridgeBg from '@/assets/bridge_entrance.jpg';
import photoImage from '@/assets/object-photo.png';
import mirrorImage from '@/assets/object-mirror.png';
import drawingImage from '@/assets/object-drawing.png';

export const Chapter4 = () => {
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
  const [hasCompletedChapter, setHasCompletedChapter] = useState(false);

  const chapterMemories = ['bridge-start', 'bridge-middle', 'bridge-truth', 'bridge-water', 'bridge-end'];

  const objectPositions = useRef([
    { id: 'entrance', pos: [-6, 1, -3] },
    { id: 'railing', pos: [-2, 1, 0] },
    { id: 'center', pos: [0, 1, 2] },
    { id: 'watermark', pos: [2, 1, 1] },
    { id: 'far-end', pos: [6, 1, -1] },
  ]);

  // 💔 CHAPTER INIT
  useEffect(() => {
    setPlayerPosition([0, 1, 0]);
    setCurrentChapter(4);
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
    const timeout = setTimeout(() => {
      setDialogue({
        text: "The bridge... I haven't been here since that day.",
        speaker: 'player',
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      setDialogue(null);
    };
  }, [setDialogue]);

  // 💔 MEMORY ALIGNMENT CHECK
  const checkChapterCompletion = useCallback(() => {
    if (hasCompletedChapter || transitionPhase !== 'none' || hasTriggeredTransition) return false;

    const collectedInChapter = chapterMemories.filter((mem) => collectedMemories.includes(mem));
    
    console.log('💔 Chapter 4 Memory Alignment:', {
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
          text: `Every step on this bridge... it's all coming back. That day, the water...`,
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
            text: `It was an accident. I couldn't save Rowan, but it wasn't my fault.`,
            speaker: 'player',
          });
        }, 1000);
        
        await new Promise((resolve) => setTimeout(resolve, 4000));
        
        // Phase 4: Moving forward
        setTransitionPhase('forward');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Complete & transition
        completeChapter(4);
        setHasCompletedChapter(true);
        setCurrentChapter(5);
        
        document.body.classList.remove('transition-active');
        console.log('🌟 MOVING TO CHAPTER 5 - FINAL CLOSURE');
        startTransition(() => {
          navigate('/chapter/5');
        });
      };
      
      emotionalSequence();
    }
  }, [checkChapterCompletion, completeChapter, setDialogue, setHasCompletedChapter, 
      setCurrentChapter, navigate, startTransition, playSound]);

  // Handle object interaction
  const handleInteract = useCallback((objectId: string) => {
    if (transitionPhase !== 'none') return;

    const currentCollected = collectedMemories;
    switch (objectId) {
      case 'entrance':
        if (!currentCollected.includes('bridge-start')) {
          addMemory('bridge-start');
          playSound('collect');
          setDialogue({
            text: "We came here to launch the boat we made together.",
            speaker: 'player',
          });
        }
        break;
      case 'railing':
        if (!currentCollected.includes('bridge-middle')) {
          addMemory('bridge-middle');
          playSound('panic');
          triggerSensoryOverload(2000);
          setTimeout(() => {
            setDialogue({
              text: "Rowan leaned over to see it float away...",
              speaker: 'player',
            });
          }, 2000);
        }
        break;
      case 'center':
        if (!currentCollected.includes('bridge-truth')) {
          addMemory('bridge-truth');
          playSound('panic');
          triggerSensoryOverload(4000);
          setTimeout(() => {
            setDialogue({
              text: "They slipped. I tried to grab them. I tried so hard. But I couldn't reach...",
              speaker: 'player',
            });
          }, 4000);
        }
        break;
      case 'watermark':
        if (!currentCollected.includes('bridge-water')) {
          addMemory('bridge-water');
          playSound('collect');
          setDialogue({
            text: "The water was so cold. They told me it was quick. But was it?",
            speaker: 'player',
          });
        }
        break;
      case 'far-end':
        if (!currentCollected.includes('bridge-end')) {
          addMemory('bridge-end');
          playSound('collect');
          setDialogue({
            text: "I've blamed myself for years. But it was an accident. Just an accident.",
            speaker: 'player',
          });
        }
        break;
    }
  }, [addMemory, playSound, triggerSensoryOverload, setDialogue, collectedMemories, transitionPhase]);

  // Handle bully collision
  const handleBullyContact = useCallback(() => {
    if (!isDead && transitionPhase === 'none') {
      playSound('panic');
      triggerPanicAttack();
      setDialogue({
        text: "They're here... the ones who chased us... no, no, no...",
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
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-rose-900/30 to-purple-900/20 animate-pulse-slow"></div>
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
              <p className="text-sm opacity-75 font-light">The bridge’s truth unfolds...</p>
            </div>
          )}
          {transitionPhase === 'realization' && (
            <div className="animate-fade-in-up">
              <div className="text-6xl mb-6">⚡</div>
              <h2 className="text-3xl font-light mb-4 tracking-wide">SENSORY OVERLOAD</h2>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">
                The moment replays... but now I see it clearly...
              </p>
              <div className="w-32 h-32 border-2 border-white/30 rounded-full mx-auto mb-6 animate-pulse-slow"></div>
            </div>
          )}
          {transitionPhase === 'forward' && (
            <div className="animate-fade-in-up">
              <div className="text-5xl mb-6">➤</div>
              <div className="text-3xl font-semibold mb-4">CHAPTER 5</div>
              <div className="text-xl font-light mb-6">The Quiet Rain</div>
              <p className="text-sm opacity-75 font-light">
                To closure... where peace awaits
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen relative">
      {renderEmotionalOverlay()}
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 60 }}
        className={`${sensoryOverload ? 'sensory-overload' : ''} ${
          isTransitionActive ? 'opacity-10 pointer-events-none' : ''
        } transition-all duration-1000`}
      >
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.45}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.4} color="#7B8DC3" />
        <pointLight position={[5, 2, 5]} intensity={0.3} color="#6B9DB5" />
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.65}
          azimuth={0.15}
        />
        <RainEffect />
        <WaterSurface />
        <Player
          onInteract={handleInteract}
          nearbyObjects={nearbyObjects}
          isTransitioning={isTransitionActive}
        />
        <Environment theme="bridge" backgroundImage={bridgeBg} />
        <Bully
          id="bully1"
          initialPosition={[8, 1, -4]}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
        />
        <Bully
          id="bully2"
          initialPosition={[-7, 1, 5]}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
        />
        <Bully
          id="bully3"
          initialPosition={[6, 1, 6]}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
        />
        <InteractiveObject
          position={[-6, 1, -3]}
          objectId="entrance"
          label="Bridge Entrance"
          onInteract={handleInteract}
          color="#A8D8E0"
          memoryId="bridge-start"
          textureUrl={photoImage}
        />
        <InteractiveObject
          position={[-2, 1, 0]}
          objectId="railing"
          label="Old Railing"
          onInteract={handleInteract}
          color="#E0C8A8"
          memoryId="bridge-middle"
          textureUrl={drawingImage}
        />
        <InteractiveObject
          position={[0, 1, 2]}
          objectId="center"
          label="Center Point"
          onInteract={handleInteract}
          color="#D8A8E0"
          memoryId="bridge-truth"
          textureUrl={mirrorImage}
        />
        <InteractiveObject
          position={[2, 1, 1]}
          objectId="watermark"
          label="Water Below"
          onInteract={handleInteract}
          color="#A8C8E0"
          memoryId="bridge-water"
          textureUrl={mirrorImage}
        />
        <InteractiveObject
          position={[6, 1, -1]}
          objectId="far-end"
          label="Bridge End"
          onInteract={handleInteract}
          color="#C8E0A8"
          memoryId="bridge-end"
          textureUrl={photoImage}
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
        chapter={4}
        chapterTitle="The Bridge"
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