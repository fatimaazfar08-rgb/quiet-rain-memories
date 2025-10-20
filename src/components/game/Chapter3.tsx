import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { Bully } from './Bully';
import { RainEffect } from './RainEffect';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect, useState, useRef, useCallback, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import bedroomBg from '@/assets/bg-bedroom.png';
import drawingImage from '@/assets/object-drawing.png';

export const Chapter3 = () => {
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

  const chapterMemories = ['sketch1', 'sketch2', 'sketch3', 'sketch4', 'sketch5'];

  const objectPositions = useRef([
    { id: 'sketchbook1', pos: [-3, 1, -4] },
    { id: 'sketchbook2', pos: [3, 1, -3] },
    { id: 'sketchbook3', pos: [0, 1, 2] },
    { id: 'sketchbook4', pos: [-5, 1, 3] },
    { id: 'sketchbook5', pos: [5, 1, 4] },
  ]);

  // 💔 CHAPTER INIT
  useEffect(() => {
    setPlayerPosition([0, 1, 0]);
    setCurrentChapter(3);
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
        text: "Rowan's sketchbook... I never knew about this. There are drawings everywhere.",
        speaker: "Alex",
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
    
    console.log('💔 Chapter 3 Memory Alignment:', {
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
          text: `These drawings... they tell a story I never understood. Was I too blind to see?`,
          speaker: 'Alex',
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
            text: `Rowan's pain... it was all here. I need to find the truth.`,
            speaker: 'Alex',
          });
        }, 1000);
        
        await new Promise((resolve) => setTimeout(resolve, 4000));
        
        // Phase 4: Moving forward
        setTransitionPhase('forward');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Complete & transition
        completeChapter(3);
        setHasCompletedChapter(true);
        setCurrentChapter(4);
        
        document.body.classList.remove('transition-active');
        console.log('🌟 MOVING TO CHAPTER 4 - SEARCHING FOR TRUTH');
        startTransition(() => {
          navigate('/chapter/4');
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
      case 'sketchbook1':
        if (!currentCollected.includes('sketch1')) {
          addMemory('sketch1');
          playSound('collect');
          setDialogue({ text: "A drawing of the two of us... smiling.", speaker: "Alex" });
        }
        break;
      case 'sketchbook2':
        if (!currentCollected.includes('sketch2')) {
          addMemory('sketch2');
          playSound('collect');
          setDialogue({ text: "The bridge... drawn over and over again.", speaker: "Alex" });
        }
        break;
      case 'sketchbook3':
        if (!currentCollected.includes('sketch3')) {
          addMemory('sketch3');
          playSound('panic');
          triggerSensoryOverload(3000);
          setTimeout(() => {
            setDialogue({
              text: "Rowan drew their fears... I never noticed how scared they were.",
              speaker: "Alex",
            });
          }, 3000);
        }
        break;
      case 'sketchbook4':
        if (!currentCollected.includes('sketch4')) {
          addMemory('sketch4');
          playSound('collect');
          setDialogue({ text: "A self-portrait. Rowan looked so lonely in their own eyes.", speaker: "Alex" });
        }
        break;
      case 'sketchbook5':
        if (!currentCollected.includes('sketch5')) {
          addMemory('sketch5');
          playSound('collect');
          setDialogue({ text: "The last page... it's blank except for one word: 'Sorry.'", speaker: "Alex" });
        }
        break;
    }
  }, [addMemory, playSound, triggerSensoryOverload, setDialogue, collectedMemories, transitionPhase]);

  // Handle bully collision
  const handleBullyContact = useCallback(() => {
    if (!isDead && transitionPhase === 'none') {
      playSound('panic');
      triggerPanicAttack();
      setDialogue({ text: "Not again... I can't breathe... too much...", speaker: "Alex" });
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
              {memory.split('-')[0] || memory}
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
              <div className="text-3xl font-semibold mb-4">CHAPTER 4</div>
              <div className="text-xl font-light mb-6">Beyond the Sketchbook</div>
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
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.45} color="#9B8DC3" />
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.55}
          azimuth={0.2}
        />
        <RainEffect />
        <Player
          onInteract={handleInteract}
          nearbyObjects={nearbyObjects}
          isTransitioning={isTransitionActive}
        />
        <Environment theme="home" backgroundImage={bedroomBg} />
        <Bully
          id="bully1"
          initialPosition={[7, 1, -7]}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
        />
        <Bully
          id="bully2"
          initialPosition={[-8, 1, 6]}
          onPlayerContact={handleBullyContact}
          playerPosition={playerPosition}
        />
        <InteractiveObject
          position={[-3, 1, -4]}
          objectId="sketchbook1"
          label="Sketch Page"
          onInteract={handleInteract}
          color="#C8A8E0"
          memoryId="sketch1"
          textureUrl={drawingImage}
        />
        <InteractiveObject
          position={[3, 1, -3]}
          objectId="sketchbook2"
          label="Bridge Drawing"
          onInteract={handleInteract}
          color="#A8B8E0"
          memoryId="sketch2"
          textureUrl={drawingImage}
        />
        <InteractiveObject
          position={[0, 1, 2]}
          objectId="sketchbook3"
          label="Dark Sketch"
          onInteract={handleInteract}
          color="#E0A8B8"
          memoryId="sketch3"
          textureUrl={drawingImage}
        />
        <InteractiveObject
          position={[-5, 1, 3]}
          objectId="sketchbook4"
          label="Self Portrait"
          onInteract={handleInteract}
          color="#B8E0A8"
          memoryId="sketch4"
          textureUrl={drawingImage}
        />
        <InteractiveObject
          position={[5, 1, 4]}
          objectId="sketchbook5"
          label="Last Page"
          onInteract={handleInteract}
          color="#E0C8A8"
          memoryId="sketch5"
          textureUrl={drawingImage}
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
        chapter={3}
        chapterTitle="The Sketchbook"
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