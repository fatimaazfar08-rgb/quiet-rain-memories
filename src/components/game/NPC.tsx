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

export const NPC = ({ id, name, position, textureUrl, dialogues, playerPosition, onInteract }: NPCProps) => {
  const npcRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  const [isNearby, setIsNearby] = useState(false);

  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );
    setIsNearby(distance < 3);
  }, [playerPosition, position]);

  // Handle mouse click
  const handleClick = () => {
    if (isNearby) onInteract(id, dialogues);
  };

  // Handle keyboard "E"
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
      <Plane args={[2, 3]}>
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.5}
          side={THREE.DoubleSide}
        />
      </Plane>

      {/* Name label */}
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

      {/* Show prompt only when nearby */}
      {isNearby && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.25}
          color="#4CAF50"
          anchorX="center"
          anchorY="middle"
        >
          Press E to Talk
        </Text>
      )}

      {/* Ground ring for visual cue */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3, 32]} />
        <meshBasicMaterial color={isNearby ? '#00ff00' : '#44ff44'} transparent opacity={0.25} />
      </mesh>
    </group>
  );
};
