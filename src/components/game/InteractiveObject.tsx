import { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Box, Text, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

interface InteractiveObjectProps {
  position: [number, number, number];
  objectId: string;
  label: string;
  onInteract: (objectId: string) => void;
  color?: string;
  memoryId?: string;
  textureUrl?: string;
}

export const InteractiveObject = ({
  position,
  objectId,
  label,
  onInteract,
  color = "#A8B5E0",
  memoryId,
  textureUrl,
}: InteractiveObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isNearby, setIsNearby] = useState(false);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const collectedMemories = useGameStore((state) => state.progress.collectedMemories);
  
  const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;
  const isCollected = memoryId ? collectedMemories.includes(memoryId) : false;

  useFrame(() => {
    if (!meshRef.current) return;

    // Check distance to player
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );

    setIsNearby(distance < 3);

    // Subtle floating animation
    if (!isCollected) {
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handleClick = () => {
    if (isNearby && !isCollected) {
      onInteract(objectId);
    }
  };

  return (
    <group position={position}>
      {texture ? (
        <Plane
          ref={meshRef}
          args={[2, 2]}
          onClick={handleClick}
          onPointerEnter={() => document.body.style.cursor = isNearby ? 'pointer' : 'default'}
          onPointerLeave={() => document.body.style.cursor = 'default'}
        >
          <meshStandardMaterial
            map={texture}
            transparent
            opacity={isCollected ? 0.3 : 1}
            emissive={isNearby && !isCollected ? color : "#000000"}
            emissiveIntensity={isNearby && !isCollected ? 0.3 : 0}
            side={THREE.DoubleSide}
          />
        </Plane>
      ) : (
        <Box
          ref={meshRef}
          args={[1.2, 1.2, 1.2]}
          onClick={handleClick}
          onPointerEnter={() => document.body.style.cursor = isNearby ? 'pointer' : 'default'}
          onPointerLeave={() => document.body.style.cursor = 'default'}
        >
          <meshStandardMaterial
            color={isCollected ? "#4A5568" : color}
            emissive={isNearby && !isCollected ? color : "#000000"}
            emissiveIntensity={isNearby && !isCollected ? 0.5 : 0}
            opacity={isCollected ? 0.3 : 1}
            transparent
          />
        </Box>
      )}
      
      {isNearby && !isCollected && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {label}
          {'\n'}Press E
        </Text>
      )}
    </group>
  );
};
