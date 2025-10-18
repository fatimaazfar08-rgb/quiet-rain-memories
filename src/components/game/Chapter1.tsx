import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Player } from './Player';
import { Environment } from './Environment';
import { InteractiveObject } from './InteractiveObject';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useEffect, useState, useRef } from 'react';

import photoImage from '@/assets/object-photo.png';
import newspaperImage from '@/assets/object-newspaper.png';
import drawingImage from '@/assets/object-drawing.png';
import mirrorImage from '@/assets/object-mirror.png';
import boxImage from '@/assets/object-box.png';

export const Chapter1 = () => {
  const setDialogue = useGameStore((state) => state.setDialogue);
  const addMemory = useGameStore((state) => state.addMemory);
  const triggerSensoryOverload = useGameStore((state) => state.triggerSensoryOverload);
  const sensoryOverload = useGameStore((state) => state.sensoryOverload);
  const playerPosition = useGameStore((state) => state.playerPosition);
  
  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);
  
  const objectPositions = useRef([
    { id: 'photo', pos: [-4, 1.6, -5] },
    { id: 'newspaper', pos: [-2, 1.6, -5] },
    { id: 'drawing', pos: [3, 1, 3] },
    { id: 'mirror', pos: [-8, 2, 5] },
    { id: 'box', pos: [5, 1, -7] },
  ]);

  // Track nearby objects for E key interaction
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
    // Welcome message
    setTimeout(() => {
      setDialogue("I'm back... after all these years. The house feels smaller now.");
    }, 1000);

    return () => {
      setDialogue(null);
    };
  }, [setDialogue]);

  const handleInteract = (objectId: string) => {
    switch (objectId) {
      case 'photo':
        addMemory('photo-rowan');
        setDialogue("Rowan and me... we were inseparable. What happened that day?");
        break;
      
      case 'newspaper':
        addMemory('newspaper-article');
        triggerSensoryOverload(4000);
        setTimeout(() => {
          setDialogue('"Boy, 12, institutionalized after tragic bridge incident"... They made me a monster.');
        }, 4000);
        break;
      
      case 'drawing':
        addMemory('childhood-drawing');
        setDialogue("My old drawings... I used to draw the boats we'd make together.");
        break;
      
      case 'mirror':
        setDialogue("I don't recognize myself anymore. Who am I without that label?");
        break;
      
      case 'box':
        addMemory('rowans-box');
        setDialogue("Rowan's things... Mom kept them all this time.");
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
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#6B8FB5" />

        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.6}
          azimuth={0.25}
        />

        {/* Game Objects */}
        <Player onInteract={handleInteract} nearbyObjects={nearbyObjects} />
        <Environment />

        {/* Interactive Objects */}
        <InteractiveObject
          position={[-4, 1.6, -5]}
          objectId="photo"
          label="Photo Frame"
          onInteract={handleInteract}
          color="#A8B5E0"
          memoryId="photo-rowan"
          textureUrl={photoImage}
        />

        <InteractiveObject
          position={[-2, 1.6, -5]}
          objectId="newspaper"
          label="Old Newspaper"
          onInteract={handleInteract}
          color="#E0A8A8"
          memoryId="newspaper-article"
          textureUrl={newspaperImage}
        />

        <InteractiveObject
          position={[3, 1, 3]}
          objectId="drawing"
          label="Childhood Drawing"
          onInteract={handleInteract}
          color="#D4A8E0"
          memoryId="childhood-drawing"
          textureUrl={drawingImage}
        />

        <InteractiveObject
          position={[-8, 2, 5]}
          objectId="mirror"
          label="Mirror"
          onInteract={handleInteract}
          color="#A8D4E0"
          textureUrl={mirrorImage}
        />

        <InteractiveObject
          position={[5, 1, -7]}
          objectId="box"
          label="Cardboard Box"
          onInteract={handleInteract}
          color="#E0D4A8"
          memoryId="rowans-box"
          textureUrl={boxImage}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      <GameHUD chapter={1} chapterTitle="Homecoming" nearbyObjects={nearbyObjects} />
      <DialogueBox />
    </div>
  );
};
