import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const RainEffect = () => {
  const rainRef = useRef<THREE.Points>(null);
  
  const rainCount = 1000;
  const rainGeo = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(rainCount * 3);
  const rainVelocities = new Float32Array(rainCount);

  for (let i = 0; i < rainCount; i++) {
    rainPositions[i * 3] = Math.random() * 40 - 20;
    rainPositions[i * 3 + 1] = Math.random() * 20 + 5;
    rainPositions[i * 3 + 2] = Math.random() * 40 - 20;
    rainVelocities[i] = Math.random() * 0.1 + 0.1;
  }

  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

  useFrame(() => {
    if (!rainRef.current) return;
    
    const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < rainCount; i++) {
      positions[i * 3 + 1] -= rainVelocities[i];
      
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 25;
        positions[i * 3] = Math.random() * 40 - 20;
        positions[i * 3 + 2] = Math.random() * 40 - 20;
      }
    }
    
    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={rainRef} geometry={rainGeo}>
      <pointsMaterial
        color="#6B9BD1"
        size={0.1}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};
