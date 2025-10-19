import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface MovingObstacleProps {
  id: string;
  initialPosition: [number, number, number];
  path: [number, number, number][];
  speed?: number;
  onPlayerContact: () => void;
  playerPosition: [number, number, number];
}

export const MovingObstacle = ({
  id,
  initialPosition,
  path,
  speed = 0.01,
  onPlayerContact,
  playerPosition,
}: MovingObstacleProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [position, setPosition] = useState<[number, number, number]>(initialPosition);
  const [hasTriggered, setHasTriggered] = useState(false);

  useFrame(() => {
    if (!meshRef.current || path.length === 0) return;

    const targetPos = path[currentPathIndex];
    const currentPos = position;

    const dx = targetPos[0] - currentPos[0];
    const dy = targetPos[1] - currentPos[1];
    const dz = targetPos[2] - currentPos[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < 0.1) {
      setCurrentPathIndex((currentPathIndex + 1) % path.length);
    } else {
      const newX = currentPos[0] + (dx / distance) * speed;
      const newY = currentPos[1] + (dy / distance) * speed;
      const newZ = currentPos[2] + (dz / distance) * speed;
      setPosition([newX, newY, newZ]);
      meshRef.current.position.set(newX, newY, newZ);
    }

    const distanceToPlayer = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
        Math.pow(playerPosition[2] - position[2], 2)
    );

    if (distanceToPlayer < 2 && !hasTriggered) {
      setHasTriggered(true);
      onPlayerContact();
      setTimeout(() => setHasTriggered(false), 3000);
    }
  });

  return (
    <Box ref={meshRef} args={[1, 2, 1]} position={initialPosition} castShadow>
      <meshStandardMaterial color="#FF6B6B" emissive="#FF0000" emissiveIntensity={0.3} />
    </Box>
  );
};
