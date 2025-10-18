import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useEffect, useState, useRef } from 'react';

export const Chapter3 = () => {
  const setDialogue = useGameStore((state) => state.setDialogue);
  const addMemory = useGameStore((state) => state.addMemory);
  const completeChapter = useGameStore((state) => state.completeChapter);
  const triggerSensoryOverload = useGameStore((state) => state.triggerSensoryOverload);
  const sensoryOverload = useGameStore((state) => state.sensoryOverload);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const collectedMemories = useGameStore((state) => state.progress.collectedMemories);

  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);

  const chapterMemories = ['sketch1', 'sketch2', 'sketch3', 'sketch4', 'sketch5'];

  const objectPositions = useRef([
    { id: 'sketchbook1', pos: [-3, 1, -4] },
    { id: 'sketchbook2', pos: [3, 1, -3] },
    { id: 'sketchbook3', pos: [0, 1, 2] },
    { id: 'sketchbook4', pos: [-5, 1, 3] },
    { id: 'sketchbook5', pos: [5, 1, 4] },
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
      setDialogue("Rowan's sketchbook... I never knew about this. There are drawings everywhere.");
    }, 1000);

    return () => {
      setDialogue(null);
    };
  }, [setDialogue]);

  useEffect(() => {
    const collectedInChapter = chapterMemories.filter(mem => collectedMemories.includes(mem));
    if (collectedInChapter.length === chapterMemories.length) {
      setTimeout(() => {
        setDialogue("These drawings... they tell a story I never understood.");
        completeChapter(3);
      }, 2000);
    }
  }, [collectedMemories, completeChapter, setDialogue]);

  const handleInteract = (objectId: string) => {
    const currentCollected = useGameStore.getState().progress.collectedMemories;

    switch (objectId) {
      case 'sketchbook1':
        if (!currentCollected.includes('sketch1')) {
          addMemory('sketch1');
          setDialogue("A drawing of the two of us... smiling.");
        }
        break;

      case 'sketchbook2':
        if (!currentCollected.includes('sketch2')) {
          addMemory('sketch2');
          setDialogue("The bridge... drawn over and over again.");
        }
        break;

      case 'sketchbook3':
        if (!currentCollected.includes('sketch3')) {
          addMemory('sketch3');
          triggerSensoryOverload(3000);
          setTimeout(() => {
            setDialogue("Rowan drew their fears... I never noticed how scared they were.");
          }, 3000);
        }
        break;

      case 'sketchbook4':
        if (!currentCollected.includes('sketch4')) {
          addMemory('sketch4');
          setDialogue("A self-portrait. Rowan looked so lonely in their own eyes.");
        }
        break;

      case 'sketchbook5':
        if (!currentCollected.includes('sketch5')) {
          addMemory('sketch5');
          setDialogue("The last page... it's blank except for one word: 'Sorry.'");
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

        <Player onInteract={handleInteract} nearbyObjects={nearbyObjects} />
        <Environment />

        <InteractiveObject
          position={[-3, 1, -4]}
          objectId="sketchbook1"
          label="Sketch Page"
          onInteract={handleInteract}
          color="#C8A8E0"
          memoryId="sketch1"
        />

        <InteractiveObject
          position={[3, 1, -3]}
          objectId="sketchbook2"
          label="Bridge Drawing"
          onInteract={handleInteract}
          color="#A8B8E0"
          memoryId="sketch2"
        />

        <InteractiveObject
          position={[0, 1, 2]}
          objectId="sketchbook3"
          label="Dark Sketch"
          onInteract={handleInteract}
          color="#E0A8B8"
          memoryId="sketch3"
        />

        <InteractiveObject
          position={[-5, 1, 3]}
          objectId="sketchbook4"
          label="Self Portrait"
          onInteract={handleInteract}
          color="#B8E0A8"
          memoryId="sketch4"
        />

        <InteractiveObject
          position={[5, 1, 4]}
          objectId="sketchbook5"
          label="Last Page"
          onInteract={handleInteract}
          color="#E0C8A8"
          memoryId="sketch5"
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      <GameHUD chapter={3} chapterTitle="The Sketchbook" nearbyObjects={nearbyObjects} />
      <DialogueBox />
    </div>
  );
};
