import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const Chapter5 = () => {
  const navigate = useNavigate();
  const setDialogue = useGameStore((state) => state.setDialogue);
  const addMemory = useGameStore((state) => state.addMemory);
  const completeChapter = useGameStore((state) => state.completeChapter);
  const sensoryOverload = useGameStore((state) => state.sensoryOverload);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const collectedMemories = useGameStore((state) => state.progress.collectedMemories);

  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);

  const chapterMemories = ['acceptance', 'forgiveness', 'healing', 'hope', 'peace'];

  const objectPositions = useRef([
    { id: 'letter', pos: [0, 1, -4] },
    { id: 'tree', pos: [-4, 1, 2] },
    { id: 'bench', pos: [4, 1, 2] },
    { id: 'flower', pos: [0, 1, 4] },
    { id: 'sky', pos: [0, 1, 0] },
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
      setDialogue("The quiet rain falls softly. I can finally breathe.");
    }, 1000);

    return () => {
      setDialogue(null);
    };
  }, [setDialogue]);

  useEffect(() => {
    const collectedInChapter = chapterMemories.filter(mem => collectedMemories.includes(mem));
    if (collectedInChapter.length === chapterMemories.length) {
      setTimeout(() => {
        setDialogue("Thank you, Rowan. I'm ready to let go now. I'm ready to heal.");
        completeChapter(5);
        setTimeout(() => {
          navigate('/');
        }, 4000);
      }, 2000);
    }
  }, [collectedMemories, completeChapter, setDialogue, navigate]);

  const handleInteract = (objectId: string) => {
    const currentCollected = useGameStore.getState().progress.collectedMemories;

    switch (objectId) {
      case 'letter':
        if (!currentCollected.includes('acceptance')) {
          addMemory('acceptance');
          setDialogue("A letter I wrote but never sent. 'Dear Rowan, I'm learning to accept what happened.'");
        }
        break;

      case 'tree':
        if (!currentCollected.includes('forgiveness')) {
          addMemory('forgiveness');
          setDialogue("The tree we used to climb. I forgive myself. I forgive us both.");
        }
        break;

      case 'bench':
        if (!currentCollected.includes('healing')) {
          addMemory('healing');
          setDialogue("Sitting here, I realize healing isn't forgetting. It's remembering without pain.");
        }
        break;

      case 'flower':
        if (!currentCollected.includes('hope')) {
          addMemory('hope');
          setDialogue("New flowers blooming where we once played. Life continues. Hope remains.");
        }
        break;

      case 'sky':
        if (!currentCollected.includes('peace')) {
          addMemory('peace');
          setDialogue("Looking up at the quiet rain, I finally feel peace. Rowan would want me to live.");
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
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.7}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#9BB5D3" />
        <pointLight position={[5, 3, 5]} intensity={0.5} color="#B5D3E0" />

        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.5}
          azimuth={0.25}
        />

        <Player onInteract={handleInteract} nearbyObjects={nearbyObjects} />
        <Environment />

        <InteractiveObject
          position={[0, 1, -4]}
          objectId="letter"
          label="Unsent Letter"
          onInteract={handleInteract}
          color="#D8E0F0"
          memoryId="acceptance"
        />

        <InteractiveObject
          position={[-4, 1, 2]}
          objectId="tree"
          label="Memory Tree"
          onInteract={handleInteract}
          color="#C8E0D8"
          memoryId="forgiveness"
        />

        <InteractiveObject
          position={[4, 1, 2]}
          objectId="bench"
          label="Peaceful Bench"
          onInteract={handleInteract}
          color="#E0D8C8"
          memoryId="healing"
        />

        <InteractiveObject
          position={[0, 1, 4]}
          objectId="flower"
          label="New Blooms"
          onInteract={handleInteract}
          color="#F0D8E0"
          memoryId="hope"
        />

        <InteractiveObject
          position={[0, 1, 0]}
          objectId="sky"
          label="Quiet Rain"
          onInteract={handleInteract}
          color="#D8F0E0"
          memoryId="peace"
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      <GameHUD chapter={5} chapterTitle="The Quiet Rain" nearbyObjects={nearbyObjects} />
      <DialogueBox />
    </div>
  );
};
