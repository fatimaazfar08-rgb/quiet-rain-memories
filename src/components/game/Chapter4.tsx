import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useEffect, useState, useRef } from 'react';

export const Chapter4 = () => {
  const setDialogue = useGameStore((state) => state.setDialogue);
  const addMemory = useGameStore((state) => state.addMemory);
  const completeChapter = useGameStore((state) => state.completeChapter);
  const triggerSensoryOverload = useGameStore((state) => state.triggerSensoryOverload);
  const sensoryOverload = useGameStore((state) => state.sensoryOverload);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const collectedMemories = useGameStore((state) => state.progress.collectedMemories);

  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);

  const chapterMemories = ['bridge-start', 'bridge-middle', 'bridge-truth', 'bridge-water', 'bridge-end'];

  const objectPositions = useRef([
    { id: 'entrance', pos: [-6, 1, -3] },
    { id: 'railing', pos: [-2, 1, 0] },
    { id: 'center', pos: [0, 1, 2] },
    { id: 'watermark', pos: [2, 1, 1] },
    { id: 'far-end', pos: [6, 1, -1] },
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
      setDialogue("The bridge... I haven't been here since that day.");
    }, 1000);

    return () => {
      setDialogue(null);
    };
  }, [setDialogue]);

  useEffect(() => {
    const collectedInChapter = chapterMemories.filter(mem => collectedMemories.includes(mem));
    if (collectedInChapter.length === chapterMemories.length) {
      setTimeout(() => {
        setDialogue("Now I understand. It wasn't my fault. It was never my fault.");
        completeChapter(4);
      }, 2000);
    }
  }, [collectedMemories, completeChapter, setDialogue]);

  const handleInteract = (objectId: string) => {
    const currentCollected = useGameStore.getState().progress.collectedMemories;

    switch (objectId) {
      case 'entrance':
        if (!currentCollected.includes('bridge-start')) {
          addMemory('bridge-start');
          setDialogue("We came here to launch the boat we made together.");
        }
        break;

      case 'railing':
        if (!currentCollected.includes('bridge-middle')) {
          addMemory('bridge-middle');
          triggerSensoryOverload(2000);
          setTimeout(() => {
            setDialogue("Rowan leaned over to see it float away...");
          }, 2000);
        }
        break;

      case 'center':
        if (!currentCollected.includes('bridge-truth')) {
          addMemory('bridge-truth');
          triggerSensoryOverload(4000);
          setTimeout(() => {
            setDialogue("They slipped. I tried to grab them. I tried so hard. But I couldn't reach...");
          }, 4000);
        }
        break;

      case 'watermark':
        if (!currentCollected.includes('bridge-water')) {
          addMemory('bridge-water');
          setDialogue("The water was so cold. They told me it was quick. But was it?");
        }
        break;

      case 'far-end':
        if (!currentCollected.includes('bridge-end')) {
          addMemory('bridge-end');
          setDialogue("I've blamed myself for years. But it was an accident. Just an accident.");
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

        <Player onInteract={handleInteract} nearbyObjects={nearbyObjects} />
        <Environment />

        <InteractiveObject
          position={[-6, 1, -3]}
          objectId="entrance"
          label="Bridge Entrance"
          onInteract={handleInteract}
          color="#A8D8E0"
          memoryId="bridge-start"
        />

        <InteractiveObject
          position={[-2, 1, 0]}
          objectId="railing"
          label="Old Railing"
          onInteract={handleInteract}
          color="#E0C8A8"
          memoryId="bridge-middle"
        />

        <InteractiveObject
          position={[0, 1, 2]}
          objectId="center"
          label="Center Point"
          onInteract={handleInteract}
          color="#D8A8E0"
          memoryId="bridge-truth"
        />

        <InteractiveObject
          position={[2, 1, 1]}
          objectId="watermark"
          label="Water Below"
          onInteract={handleInteract}
          color="#A8C8E0"
          memoryId="bridge-water"
        />

        <InteractiveObject
          position={[6, 1, -1]}
          objectId="far-end"
          label="Bridge End"
          onInteract={handleInteract}
          color="#C8E0A8"
          memoryId="bridge-end"
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      <GameHUD chapter={4} chapterTitle="The Bridge" nearbyObjects={nearbyObjects} />
      <DialogueBox />
    </div>
  );
};
