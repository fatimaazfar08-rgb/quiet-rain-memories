import { useRef, useEffect } from 'react';
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
  const isNearRef = useRef(false);

  useEffect(() => {
    if (!npcRef.current) return;

    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );

    isNearRef.current = distance < 3;
  }, [playerPosition, position]);

  const handleClick = () => {
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );

    if (distance < 3) {
      onInteract(id, dialogues);
    }
  };

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

      {/* Interaction zone */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3, 32]} />
        <meshBasicMaterial color="#44ff44" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};
