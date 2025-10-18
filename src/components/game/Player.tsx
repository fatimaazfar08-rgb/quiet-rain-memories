import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

interface PlayerProps {
  onInteract?: (objectId: string) => void;
}

export const Player = ({ onInteract }: PlayerProps) => {
  const playerRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const isPaused = useGameStore((state) => state.isPaused);
  
  const moveSpeed = 5;
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    e: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = true;
      }
      if (key === 'e' && onInteract) {
        // Trigger interaction
        onInteract('nearest-object');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteract]);

  useFrame((state, delta) => {
    if (!playerRef.current || isPaused) return;

    // Calculate movement direction
    const direction = new THREE.Vector3();
    
    if (keys.current.w) direction.z -= 1;
    if (keys.current.s) direction.z += 1;
    if (keys.current.a) direction.x -= 1;
    if (keys.current.d) direction.x += 1;

    if (direction.length() > 0) {
      direction.normalize();
      velocityRef.current.lerp(direction.multiplyScalar(moveSpeed), 0.1);
    } else {
      velocityRef.current.lerp(new THREE.Vector3(), 0.1);
    }

    // Apply movement
    playerRef.current.position.x += velocityRef.current.x * delta;
    playerRef.current.position.z += velocityRef.current.z * delta;

    // Keep player grounded
    playerRef.current.position.y = 1;

    // Update store
    setPlayerPosition([
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z,
    ]);

    // Camera follows player
    state.camera.position.x = playerRef.current.position.x;
    state.camera.position.z = playerRef.current.position.z + 10;
    state.camera.position.y = 8;
    state.camera.lookAt(playerRef.current.position);
  });

  return (
    <Sphere ref={playerRef} args={[0.5, 16, 16]} position={[0, 1, 0]}>
      <meshStandardMaterial color="#8B9FDE" emissive="#4A5F9D" emissiveIntensity={0.3} />
    </Sphere>
  );
};
