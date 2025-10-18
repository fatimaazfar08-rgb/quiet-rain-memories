import { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import characterImage from '@/assets/character-eli.png';

interface PlayerProps {
  onInteract?: (objectId: string) => void;
  nearbyObjects?: Array<{ id: string; distance: number }>;
}

export const Player = ({ onInteract, nearbyObjects = [] }: PlayerProps) => {
  const playerRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const isPaused = useGameStore((state) => state.isPaused);
  
  const texture = useLoader(THREE.TextureLoader, characterImage);
  
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
      if (key === 'e' && onInteract && nearbyObjects.length > 0) {
        // Trigger interaction with nearest object
        const nearest = nearbyObjects.sort((a, b) => a.distance - b.distance)[0];
        if (nearest && nearest.distance < 3) {
          onInteract(nearest.id);
        }
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
  }, [onInteract, nearbyObjects]);

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
    <group ref={playerRef} position={[0, 1, 0]}>
      <Plane args={[1.5, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          map={texture} 
          transparent 
          alphaTest={0.5}
          side={THREE.DoubleSide}
        />
      </Plane>
    </group>
  );
};
