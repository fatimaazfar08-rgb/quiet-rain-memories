import { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface MovingObstacleProps {
  id: string;
  initialPosition: [number, number, number];
  path: [number, number, number][];
  speed?: number;
  onPlayerContact: () => void;
  playerPosition: [number, number, number];
  textureUrl?: string; // ✅ new prop for image
}

export const MovingObstacle = ({
  id,
  initialPosition,
  path,
  speed = 0.01,
  onPlayerContact,
  playerPosition,
  textureUrl,
}: MovingObstacleProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [position, setPosition] = useState<[number, number, number]>(initialPosition);
  const [hasTriggered, setHasTriggered] = useState(false);

  // ✅ Load texture if provided
  const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

  useFrame(() => {
    if (!meshRef.current || path.length === 0) return;

    const targetPos = path[currentPathIndex];
    const [x, y, z] = position;

    const dx = targetPos[0] - x;
    const dy = targetPos[1] - y;
    const dz = targetPos[2] - z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < 0.1) {
      setCurrentPathIndex((currentPathIndex + 1) % path.length);
    } else {
      const newX = x + (dx / distance) * speed;
      const newY = y + (dy / distance) * speed;
      const newZ = z + (dz / distance) * speed;
      setPosition([newX, newY, newZ]);
      meshRef.current.position.set(newX, newY, newZ);
    }

    // ✅ Check distance to player for collision
    const distanceToPlayer = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
        Math.pow(playerPosition[2] - position[2], 2)
    );

    if (distanceToPlayer < 2 && !hasTriggered) {
      setHasTriggered(true);
      onPlayerContact();
      setTimeout(() => setHasTriggered(false), 3000);
    }

    // ✅ Optional: always face camera (billboard effect)
    meshRef.current.lookAt(0, 1, 0);
  });

  return (
    <group ref={meshRef} position={initialPosition}>
      {texture ? (
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#FF6B6B" emissive="#FF0000" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
};
