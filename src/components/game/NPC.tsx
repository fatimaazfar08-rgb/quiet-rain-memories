import { useRef, useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { Plane, Text } from '@react-three/drei';
import * as THREE from 'three';

interface NPCProps {
  id: string;
  name: string;
  position: [number, number, number];
  textureUrl: string;
  dialogues: string[];
  playerPosition: [number, number, number];
  onInteract: (npcId: string, dialogues: string[]) => void;
}

export const NPC = ({
  id,
  name,
  position,
  textureUrl,
  dialogues,
  playerPosition,
  onInteract,
}: NPCProps) => {
  const npcRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  const [isNearby, setIsNearby] = useState(false);

  // update proximity based on player distance
  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );
    setIsNearby(distance < 3);
  }, [playerPosition, position]);

  // handle click interaction
  const handleClick = () => {
    if (isNearby) onInteract(id, dialogues);
  };

  // handle E key press for interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNearby && e.key.toLowerCase() === 'e') {
        onInteract(id, dialogues);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNearby, id, dialogues, onInteract]);

  return (
    <group ref={npcRef} position={position} onClick={handleClick}>
      {/* npc sprite */}
      <Plane args={[2, 3]}>
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.5}
          side={THREE.DoubleSide}
          emissive={isNearby ? new THREE.Color('#88ff88') : new THREE.Color('#000000')}
          emissiveIntensity={isNearby ? 0.4 : 0}
        />
      </Plane>

      {/* name label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {name}
      </Text>

      {/* nearby prompt */}
      {isNearby && (
        <Text
          position={[0, 2.6, 0]}
          fontSize={0.25}
          color="#4CAF50"
          anchorX="center"
          anchorY="middle"
        >
          Press E to Talk
        </Text>
      )}

      {/* soft ground ring highlight */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.9, 32]} />
        <meshBasicMaterial
          color={isNearby ? '#00ff00' : '#44ff44'}
          transparent
          opacity={isNearby ? 0.4 : 0.2}
        />
      </mesh>
    </group>
  );
};
