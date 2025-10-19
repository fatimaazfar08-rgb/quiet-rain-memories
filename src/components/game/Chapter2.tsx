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
import { useEffect, useState, useRef } from 'react';
import leahImage from '@/assets/character-leah.png';
import schoolBg from '@/assets/bg-school.png';
import photoImage from '@/assets/object-photo.png';
import newspaperImage from '@/assets/object-newspaper.png';
import drawingImage from '@/assets/object-drawing.png';
import boxImage from '@/assets/object-box.png';
import mirrorImage from '@/assets/object-mirror.png';

export const Chapter2 = () => {
  const setDialogue = useGameStore((state) => state.setDialogue);
  const addMemory = useGameStore((state) => state.addMemory);
  const completeChapter = useGameStore((state) => state.completeChapter);
  const triggerSensoryOverload = useGameStore((state) => state.triggerSensoryOverload);
  const triggerPanicAttack = useGameStore((state) => state.triggerPanicAttack);
  const sensoryOverload = useGameStore((state) => state.sensoryOverload);
  const isDead = useGameStore((state) => state.isDead);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const collectedMemories = useGameStore((state) => state.progress.collectedMemories);
  const { playSound } = useSoundEffects();

  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);
  const [npcDialogueIndex, setNpcDialogueIndex] = useState(0);

  const chapterMemories = ['desk-memory', 'locker-memory', 'note-memory', 'classroom-memory', 'hallway-memory'];

  const objectPositions = useRef([
    { id: 'desk', pos: [-4, 1, -5] },
    { id: 'locker', pos: [4, 1.5, -4] },
    { id: 'note', pos: [0, 1.2, 3] },
    { id: 'classroom', pos: [-6, 1, 4] },
    { id: 'hallway', pos: [6, 1, 5] },
  ]);

  useEffect(() => {
    const nearby = objectPositions.current.map(obj => {
      const distance = Math.sqrt(
        Math.pow(playerPosition[0] - obj.pos[0], 2) +
        Math.pow(playerPosition[2] - obj.pos[2], 2)
      );
      return { id: obj.id, distance };
    });
    setNearbyObjects(nearby);
  }, [playerPosition]);

  useEffect(() => {
    setTimeout(() => {
      setDialogue("The school halls... everything looks smaller now, but the memories feel larger.");
    }, 1000);

    return () => {
      setDialogue(null);
    };
  }, [setDialogue]);

  useEffect(() => {
    const collectedInChapter = chapterMemories.filter(mem => collectedMemories.includes(mem));
    if (collectedInChapter.length === chapterMemories.length) {
      setTimeout(() => {
        setDialogue("I've seen enough here. Time to move forward.");
        completeChapter(2);
      }, 2000);
    }
  }, [collectedMemories, completeChapter, setDialogue]);

  const handleInteract = (objectId: string) => {
    const currentCollected = useGameStore.getState().progress.collectedMemories;

    switch (objectId) {
      case 'desk':
        if (!currentCollected.includes('desk-memory')) {
          addMemory('desk-memory');
          playSound('collect');
          setDialogue("This was my desk. I carved our initials under here.");
        }
        break;

      case 'locker':
        if (!currentCollected.includes('locker-memory')) {
          addMemory('locker-memory');
          setDialogue("The locker we shared. So many secrets hidden inside.");
        }
        break;

      case 'note':
        if (!currentCollected.includes('note-memory')) {
          addMemory('note-memory');
          triggerSensoryOverload(3000);
          setTimeout(() => {
            setDialogue("A note from Rowan... I never got to read it that day.");
          }, 3000);
        }
        break;

      case 'classroom':
        if (!currentCollected.includes('classroom-memory')) {
          addMemory('classroom-memory');
          setDialogue("We sat together, always in the back corner.");
        }
        break;

      case 'hallway':
        if (!currentCollected.includes('hallway-memory')) {
          addMemory('hallway-memory');
          setDialogue("This is where everything started to fall apart.");
        }
        break;
    }
  };

  const handleNPCInteract = (npcId: string, dialogues: string[]) => {
    if (npcId === 'leah') {
      playSound('dialogue');
      setDialogue(dialogues[npcDialogueIndex % dialogues.length]);
      setNpcDialogueIndex(prev => prev + 1);
    }
  };

  const handleBullyContact = () => {
    if (!isDead) {
      playSound('panic');
      triggerPanicAttack();
      setDialogue("Can't escape them... heart racing... everything is closing in...");
    }
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 60 }}
        className={sensoryOverload ? 'sensory-overload' : ''}
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
        <Player onInteract={handleInteract} nearbyObjects={nearbyObjects} />
        <Environment theme="school" backgroundImage={schoolBg} />

        {/* Bullies - More aggressive in school */}
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

        {/* NPC - Leah */}
        <NPC
          id="leah"
          name="Leah"
          position={[-10, 1, -10]}
          textureUrl={leahImage}
          dialogues={[
            "Welcome back, Eli. I know this place holds difficult memories.",
            "I found Rowan's old things in the storage room. Including their sketchbook.",
            "The other students... they've grown up, but some haven't learned kindness.",
            "Take your time exploring. I'll be here if you need to talk."
          ]}
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

      <GameHUD chapter={2} chapterTitle="Echoes in the Halls" nearbyObjects={nearbyObjects} />
      <DialogueBox />
      
      {isDead && (
        <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-destructive-foreground mb-4 animate-pulse">
              Panic Attack
            </h2>
            <p className="text-xl text-destructive-foreground">Restarting...</p>
          </div>
        </div>
      )}
    </div>
  );
};
