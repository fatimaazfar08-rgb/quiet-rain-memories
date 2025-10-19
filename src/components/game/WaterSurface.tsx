import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import waterTexture from '@/assets/water-texture.png';

export const WaterSurface = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, waterTexture);
  
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);

  useFrame((state) => {
    if (!waterRef.current) return;
    
    const time = state.clock.elapsedTime;
    texture.offset.x = time * 0.05;
    texture.offset.y = time * 0.03;
    
    (waterRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
      0.2 + Math.sin(time * 2) * 0.1;
  });

  return (
    <Plane
      ref={waterRef}
      args={[100, 100]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        map={texture}
        color="#4A7BA7"
        emissive="#4A7BA7"
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.5}
        transparent
        opacity={0.9}
      />
    </Plane>
  );
};
