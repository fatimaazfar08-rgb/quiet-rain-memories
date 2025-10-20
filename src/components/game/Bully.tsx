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
  const contactCooldown = useRef(0); // Prevent spam

  useEffect(() => {
    if (bullyRef.current) {
      bullyRef.current.position.set(...initialPosition);
    }
  }, [initialPosition]);

  useFrame((state, delta) => {
    if (!bullyRef.current) return;

    // Cooldown for contact
    contactCooldown.current -= delta;
    if (contactCooldown.current > 0) return;

    // Change direction randomly every 3-5 seconds (slower for bedroom)
    changeDirectionTimer.current += delta;
    if (changeDirectionTimer.current > 3 + Math.random() * 2) {
      moveDirection.current = new THREE.Vector3(
        Math.random() * 2 - 1,
        0,
        Math.random() * 2 - 1
      ).normalize();
      changeDirectionTimer.current = 0;
    }

    // Move bully (slower speed for bedroom)
    const moveSpeed = 1.5; // Reduced from 2
    bullyRef.current.position.x += moveDirection.current.x * moveSpeed * delta;
    bullyRef.current.position.z += moveDirection.current.z * moveSpeed * delta;

    // Keep within bedroom bounds
    bullyRef.current.position.x = Math.max(-12, Math.min(12, bullyRef.current.position.x));
    bullyRef.current.position.z = Math.max(-12, Math.min(12, bullyRef.current.position.z));

    // Check distance to player
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - bullyRef.current.position.x, 2) +
      Math.pow(playerPosition[2] - bullyRef.current.position.z, 2)
    );

    // If player gets too close, trigger panic attack
    if (distance < 2.5) {
      onPlayerContact();
      contactCooldown.current = 2; // 2 second cooldown
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
      {/* Warning zone visualization - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.3, 2.5, 32]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
};