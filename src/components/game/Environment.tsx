import { Box, Plane } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface EnvironmentProps {
  theme?: 'home' | 'bridge' | 'school';
  backgroundImage?: string;
}

export const Environment = ({ theme = 'home', backgroundImage }: EnvironmentProps) => {
  const bgTexture = backgroundImage ? useLoader(THREE.TextureLoader, backgroundImage) : null;

  if (bgTexture) {
    bgTexture.wrapS = THREE.RepeatWrapping;
    bgTexture.wrapT = THREE.RepeatWrapping;
    bgTexture.repeat.set(2, 2);
  }

  return (
    <>
      {/* Ground with background texture */}
      <Plane
        args={[100, 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        {bgTexture ? (
          <meshStandardMaterial map={bgTexture} transparent opacity={0.7} />
        ) : (
          <meshStandardMaterial color="#2C3E50" roughness={0.8} />
        )}
      </Plane>

      {/* Walls creating a room */}
      <Box args={[20, 5, 0.5]} position={[0, 2.5, -10]}>
        <meshStandardMaterial color="#34495E" roughness={0.9} />
      </Box>
      
      <Box args={[20, 5, 0.5]} position={[0, 2.5, 10]}>
        <meshStandardMaterial color="#34495E" roughness={0.9} />
      </Box>
      
      <Box args={[0.5, 5, 20]} position={[-10, 2.5, 0]}>
        <meshStandardMaterial color="#34495E" roughness={0.9} />
      </Box>
      
      <Box args={[0.5, 5, 20]} position={[10, 2.5, 0]}>
        <meshStandardMaterial color="#34495E" roughness={0.9} />
      </Box>

      {/* Furniture - Old table */}
      <group position={[-4, 0, -5]}>
        <Box args={[3, 0.1, 2]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#5D4E37" roughness={0.7} />
        </Box>
        <Box args={[0.1, 1.5, 0.1]} position={[-1.4, 0.75, -0.9]}>
          <meshStandardMaterial color="#5D4E37" />
        </Box>
        <Box args={[0.1, 1.5, 0.1]} position={[1.4, 0.75, -0.9]}>
          <meshStandardMaterial color="#5D4E37" />
        </Box>
        <Box args={[0.1, 1.5, 0.1]} position={[-1.4, 0.75, 0.9]}>
          <meshStandardMaterial color="#5D4E37" />
        </Box>
        <Box args={[0.1, 1.5, 0.1]} position={[1.4, 0.75, 0.9]}>
          <meshStandardMaterial color="#5D4E37" />
        </Box>
      </group>

      {/* Old bookshelf */}
      <group position={[8, 0, -5]}>
        <Box args={[2, 4, 0.5]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#4A3728" roughness={0.8} />
        </Box>
      </group>

      {/* Window with light coming through */}
      <Box args={[2, 2, 0.1]} position={[0, 3, -9.9]}>
        <meshStandardMaterial
          color="#6B8FB5"
          emissive="#6B8FB5"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Box>
    </>
  );
};
