import { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import bullyImage from '@/assets/character-bully.png';

interface BullyProps {
  id: string;
  initialPosition: [number, number, number];
  onPlayerContact: () => void;
  playerPosition: [number, number, number];
}

export const Bully = ({ id, initialPosition, onPlayerContact, playerPosition }: BullyProps) => {
  const bullyRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, bullyImage);
  const moveDirection = useRef(new THREE.Vector3(
    Math.random() * 2 - 1,
    0,
    Math.random() * 2 - 1
  ).normalize());
  const changeDirectionTimer = useRef(0);

  useEffect(() => {
    if (bullyRef.current) {
      bullyRef.current.position.set(...initialPosition);
    }
  }, [initialPosition]);

  useFrame((state, delta) => {
    if (!bullyRef.current) return;

    // Change direction randomly every 2-4 seconds
    changeDirectionTimer.current += delta;
    if (changeDirectionTimer.current > Math.random() * 2 + 2) {
      moveDirection.current = new THREE.Vector3(
        Math.random() * 2 - 1,
        0,
        Math.random() * 2 - 1
      ).normalize();
      changeDirectionTimer.current = 0;
    }

    // Move bully
    const moveSpeed = 2;
    bullyRef.current.position.x += moveDirection.current.x * moveSpeed * delta;
    bullyRef.current.position.z += moveDirection.current.z * moveSpeed * delta;

    // Keep within bounds
    bullyRef.current.position.x = Math.max(-15, Math.min(15, bullyRef.current.position.x));
    bullyRef.current.position.z = Math.max(-15, Math.min(15, bullyRef.current.position.z));

    // Check distance to player
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - bullyRef.current.position.x, 2) +
      Math.pow(playerPosition[2] - bullyRef.current.position.z, 2)
    );

    // If player gets too close, trigger panic attack
    if (distance < 2.5) {
      onPlayerContact();
    }
  });

  return (
    <group ref={bullyRef}>
      <Plane args={[2, 3]}>
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.5}
          side={THREE.DoubleSide}
        />
      </Plane>
      {/* Warning zone visualization */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.5, 32]} />
        <meshBasicMaterial color="#ff4444" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

