import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Text, Box, Plane } from '@react-three/drei';
import { RainEffect } from './RainEffect';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect, useState, useTransition } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import bullyImage from '@/assets/character-bully.png';
import eliImage from '@/assets/character-eli.png';
import cemeteryBg from '@/assets/bg-cemetery.png';
import { EndingScreen } from './EndingScreen';

export const Chapter5 = () => {
  const {
    setDialogue,
    setCurrentChapter,
    completeChapter,
    setAnxietyLevel,
    sensoryOverload,
    isDead,
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
  const [showEnding, setShowEnding] = useState(false);
  const [dialogueComplete, setDialogueComplete] = useState(false);

  const bullyTexture = useLoader(THREE.TextureLoader, bullyImage);
  const eliTexture = useLoader(THREE.TextureLoader, eliImage);
  const bgTexture = useLoader(THREE.TextureLoader, cemeteryBg);

  // 💔 CHAPTER INIT
  useEffect(() => {
    setCurrentChapter(5);
    setAnxietyLevel(100);
    resetDeath();
  }, [setCurrentChapter, setAnxietyLevel, resetDeath]);

  // 💔 DIALOGUE AND TRANSITION SEQUENCE
  useEffect(() => {
    const dialogues = [
      { delay: 1000, text: " I'm here, Rowan. At your grave. After all these years.", speaker: 'Eli' },
      { delay: 5000, text: " Bully 1: 'Eli... we need to talk to you.'", speaker: 'Bully 1' },
      { delay: 8000, text: " Bully 2: 'We've carried this guilt for so long. We're so sorry.'", speaker: 'Bully 2' },
      { delay: 12000, text: " Bully 3: 'That day... we were just kids. But what we did was wrong.'", speaker: 'Bully 3' },
      { delay: 16000, text: " Eli: 'You made me believe I was a monster. That Rowan's death was my fault.'", speaker: 'Eli' },
      { delay: 20000, text: " Bully 1: 'We know. We were scared. We let you take the blame. We're sorry.'", speaker: 'Bully 1' },
      { delay: 24000, text: " Eli: 'I've spent years hating myself. But... it wasn't my fault. It was an accident.'", speaker: 'Eli' },
      { delay: 28000, text: " Eli: 'Rowan... you tried to protect me. I understand now. Thank you.'", speaker: 'Eli' },
      { delay: 32000, text: " Eli: 'I forgive you all. And... I forgive myself.'", speaker: 'Eli' },
    ];

    const timers: NodeJS.Timeout[] = [];

    dialogues.forEach(({ delay, text, speaker }) => {
      const timer = setTimeout(() => {
        playSound('dialogue');
        setDialogue({ text, speaker });
      }, delay);
      timers.push(timer);
    });

    // Trigger transition after dialogues
    const transitionTimer = setTimeout(() => {
      if (!hasTriggeredTransition) {
        setHasTriggeredTransition(true);
        console.log('💔 FINAL CLOSURE - EMOTIONAL RESOLUTION');
        
        document.body.classList.add('transition-active');
        
        const emotionalSequence = async () => {
          // Phase 1: Final reflection
          setDialogue({
            text: `Here, at the end... I see it all so clearly now.`,
            speaker: 'Eli',
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
              text: `I carried this guilt for too long. It's time to let go.`,
              speaker: 'Eli',
            });
          }, 1000);
          
          await new Promise((resolve) => setTimeout(resolve, 4000));
          
          // Phase 4: Moving forward
          setTransitionPhase('forward');
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          // Complete & transition
          completeChapter(5);
          setShowEnding(true);
          setDialogueComplete(true);
          
          document.body.classList.remove('transition-active');
          console.log('🌟 MOVING TO ENDING - PEACE ACHIEVED');
          startTransition(() => {
            navigate('/ending');
          });
        };
        
        emotionalSequence();
      }
    }, 36000);

    timers.push(transitionTimer);

    return () => {
      timers.forEach(clearTimeout);
      setDialogue(null);
    };
  }, [setDialogue, playSound, completeChapter, setShowEnding, setDialogueComplete, 
      navigate, startTransition, hasTriggeredTransition]);

  // 💔 EMOTIONAL TRANSITION OVERLAY
  const renderEmotionalOverlay = () => {
    if (!showTransitionOverlay && transitionPhase === 'none') return null;
    
    const cinematicMemories = ['forgiveness', 'closure', 'peace', 'understanding', 'release'];
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-rose-900/30 to-purple-900/20 animate-pulse-slow"></div>
        <div className="absolute inset-0 grid grid-cols-5 gap-4 p-8 pointer-events-none">
          {cinematicMemories.map((memory, index) => (
            <div 
              key={memory}
              className={`w-16 h-16 rounded-lg border-2 transition-all duration-700 flex items-center justify-center text-sm font-medium ${
                transitionPhase === 'aligning' && memoryFragments >= (index + 1)
                  ? 'bg-white/10 border-white/50 scale-110 animate-memory-align text-white shadow-lg shadow-white/20'
                  : 'bg-white/5 border-white/10 scale-75 opacity-30'
              }`}
            >
              {memory}
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
              <p className="text-sm opacity-75 font-light">The final truths come together...</p>
            </div>
          )}
          {transitionPhase === 'realization' && (
            <div className="animate-fade-in-up">
              <div className="text-6xl mb-6">⚡</div>
              <h2 className="text-3xl font-light mb-4 tracking-wide">FINAL CLOSURE</h2>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">
                Forgiveness begins here... for them, and for myself...
              </p>
              <div className="w-32 h-32 border-2 border-white/30 rounded-full mx-auto mb-6 animate-pulse-slow"></div>
            </div>
          )}
          {transitionPhase === 'forward' && (
            <div className="animate-fade-in-up">
              <div className="text-5xl mb-6">➤</div>
              <div className="text-3xl font-semibold mb-4">ENDING</div>
              <div className="text-xl font-light mb-6">The Quiet Rain Falls</div>
              <p className="text-sm opacity-75 font-light">
                To peace... where the heart finds rest
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Respawn on 'R' key press during death screen
  useEffect(() => {
    if (!isDead || transitionPhase !== 'none') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        resetDeath();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDead, transitionPhase, resetDeath]);

  return (
    <div className="w-full h-screen relative">
      {renderEmotionalOverlay()}
      <Canvas 
        shadows 
        camera={{ position: [0, 5, 15], fov: 60 }}
        className={`${sensoryOverload ? 'sensory-overload' : ''} ${
          isTransitioning ? 'opacity-10 pointer-events-none' : ''
        } transition-all duration-1000`}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.4} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 3, 0]} intensity={0.6} color="#9B8DC3" />
        <Sky 
          distance={450000} 
          sunPosition={[0, 1, 0]} 
          inclination={0.7} 
          azimuth={0.1} 
        />
        <RainEffect />
        <Plane 
          args={[100, 100]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0, 0]} 
          receiveShadow
        >
          <meshStandardMaterial 
            map={bgTexture} 
            transparent 
            opacity={0.8}
          />
        </Plane>
        <group position={[0, 0, 0]}>
          <Box args={[2, 3, 0.3]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
          </Box>
          <Text 
            position={[0, 2, 0.2]} 
            fontSize={0.3} 
            color="#ffffff" 
            anchorX="center"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            Rowan
          </Text>
        </group>
        <group position={[0, 1, 3]}>
          <Plane args={[2, 3]}>
            <meshStandardMaterial 
              map={eliTexture} 
              transparent 
              alphaTest={0.5} 
              side={THREE.DoubleSide}
            />
          </Plane>
        </group>
        <group position={[-4, 1, 1]}>
          <Plane args={[2, 3]}>
            <meshStandardMaterial 
              map={bullyTexture} 
              transparent 
              alphaTest={0.5} 
              side={THREE.DoubleSide}
            />
          </Plane>
        </group>
        <group position={[4, 1, 1]}>
          <Plane args={[2, 3]}>
            <meshStandardMaterial 
              map={bullyTexture} 
              transparent 
              alphaTest={0.5} 
              side={THREE.DoubleSide}
            />
          </Plane>
        </group>
        <group position={[0, 1, -2]}>
          <Plane args={[2, 3]}>
            <meshStandardMaterial 
              map={bullyTexture} 
              transparent 
              alphaTest={0.5} 
              side={THREE.DoubleSide}
            />
          </Plane>
        </group>
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3.5}
        />
      </Canvas>
      
      <GameHUD
        chapter={5}
        chapterTitle="The Quiet Rain"
        nearbyObjects={nearbyObjects}
        isTransitioning={isTransitioning}
      />
      <DialogueBox />
      
      {isDead && transitionPhase === 'none' && (
        <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-destructive-foreground mb-4 animate-pulse">Panic Attack</h2>
            <p className="text-xl text-destructive-foreground mb-4">Restarting... (Press R to Respawn)</p>
            <button
              onClick={() => resetDeath()}
              className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Respawn
            </button>
          </div>
        </div>
      )}
      
      {showEnding && transitionPhase === 'none' && <EndingScreen />}
    </div>
  );
};