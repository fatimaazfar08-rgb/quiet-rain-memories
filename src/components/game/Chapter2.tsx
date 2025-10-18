import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useEffect, useState, useRef } from 'react';

export const Chapter2 = () => {
  const setDialogue = useGameStore((state) => state.setDialogue);
  const addMemory = useGameStore((state) => state.addMemory);
  const completeChapter = useGameStore((state) => state.completeChapter);
  const triggerSensoryOverload = useGameStore((state) => state.triggerSensoryOverload);
  const sensoryOverload = useGameStore((state) => state.sensoryOverload);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const collectedMemories = useGameStore((state) => state.progress.collectedMemories);

  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);

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

        <Player onInteract={handleInteract} nearbyObjects={nearbyObjects} />
        <Environment />

        <InteractiveObject
          position={[-4, 1, -5]}
          objectId="desk"
          label="Old Desk"
          onInteract={handleInteract}
          color="#B5A8E0"
          memoryId="desk-memory"
        />

        <InteractiveObject
          position={[4, 1.5, -4]}
          objectId="locker"
          label="School Locker"
          onInteract={handleInteract}
          color="#A8C5E0"
          memoryId="locker-memory"
        />

        <InteractiveObject
          position={[0, 1.2, 3]}
          objectId="note"
          label="Hidden Note"
          onInteract={handleInteract}
          color="#E0B5A8"
          memoryId="note-memory"
        />

        <InteractiveObject
          position={[-6, 1, 4]}
          objectId="classroom"
          label="Classroom Door"
          onInteract={handleInteract}
          color="#C5E0A8"
          memoryId="classroom-memory"
        />

        <InteractiveObject
          position={[6, 1, 5]}
          objectId="hallway"
          label="Hallway Corner"
          onInteract={handleInteract}
          color="#E0D4B5"
          memoryId="hallway-memory"
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
    </div>
  );
};
