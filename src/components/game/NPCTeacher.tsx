import { useRef, useState } from 'react';
import { Plane, Text } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface NPCTeacherProps {
  id: string;
  name: string;
  position: [number, number, number];
  textureUrl: string;
  dialogues: string[];
  playerPosition: [number, number, number];
  onInteract: (npcId: string, dialogues: string[]) => void;
}

export const NPCTeacher = ({
  id,
  name,
  position,
  textureUrl,
  dialogues,
  playerPosition,
  onInteract,
}: NPCTeacherProps) => {
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  const [isNearby, setIsNearby] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const distance = Math.sqrt(
    Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
  );

  const nearby = distance < 3;

  if (nearby !== isNearby) {
    setIsNearby(nearby);
  }

  return (
    <group position={position}>
      <Plane args={[2, 3]} ref={meshRef}>
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.5}
          side={THREE.DoubleSide}
        />
      </Plane>

      {isNearby && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="#4CAF50"
          anchorX="center"
          anchorY="middle"
        >
          {name} - Press E
        </Text>
      )}
    </group>
  );
};
