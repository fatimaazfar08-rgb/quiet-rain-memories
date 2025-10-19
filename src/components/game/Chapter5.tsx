import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Text, Box, Plane } from '@react-three/drei';
import { RainEffect } from './RainEffect';
import { useGameStore } from '@/store/gameStore';
import { GameHUD } from '../ui/GameHUD';
import { DialogueBox } from '../ui/DialogueBox';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import bullyImage from '@/assets/character-bully.png';
import eliImage from '@/assets/character-eli.png';
import cemeteryBg from '@/assets/bg-cemetery.png';
import { EndingScreen } from './EndingScreen';

export const Chapter5 = () => {
  const setDialogue = useGameStore((state) => state.setDialogue);
  const { playSound } = useSoundEffects();
  const [nearbyObjects, setNearbyObjects] = useState<Array<{ id: string; distance: number }>>([]);
  const [showEnding, setShowEnding] = useState(false);

  const bullyTexture = useLoader(THREE.TextureLoader, bullyImage);
  const eliTexture = useLoader(THREE.TextureLoader, eliImage);
  const bgTexture = useLoader(THREE.TextureLoader, cemeteryBg);

  useEffect(() => {
    const dialogues = [
      { delay: 1000, text: "I'm here, Rowan. At your grave. After all these years." },
      { delay: 5000, text: "Bully 1: 'Eli... we need to talk to you.'" },
      { delay: 8000, text: "Bully 2: 'We've carried this guilt for so long. We're so sorry.'" },
      { delay: 12000, text: "Bully 3: 'That day... we were just kids. But what we did was wrong.'" },
      { delay: 16000, text: "Eli: 'You made me believe I was a monster. That Rowan's death was my fault.'" },
      { delay: 20000, text: "Bully 1: 'We know. We were scared. We let you take the blame. We're sorry.'" },
      { delay: 24000, text: "Eli: 'I've spent years hating myself. But... it wasn't my fault. It was an accident.'" },
      { delay: 28000, text: "Eli: 'Rowan... you tried to protect me. I understand now. Thank you.'" },
      { delay: 32000, text: "Eli: 'I forgive you all. And... I forgive myself.'" },
    ];

    const timers = dialogues.map(({ delay, text }) =>
      setTimeout(() => {
        playSound('dialogue');
        setDialogue(text);
      }, delay)
    );

    setTimeout(() => {
      setShowEnding(true);
    }, 36000);

    return () => timers.forEach(clearTimeout);
  }, [setDialogue, playSound]);

  return (
    <div className="w-full h-screen relative">
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={0.4} castShadow />
        <pointLight position={[0, 3, 0]} intensity={0.6} color="#9B8DC3" />
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.7} azimuth={0.1} />
        <RainEffect />
        
        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <meshStandardMaterial map={bgTexture} />
        </Plane>

        <group position={[0, 0, 0]}>
          <Box args={[2, 3, 0.3]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
          </Box>
          <Text position={[0, 2, 0.2]} fontSize={0.3} color="#ffffff" anchorX="center">Rowan</Text>
        </group>

        <group position={[0, 1, 3]}>
          <Plane args={[2, 3]}><meshStandardMaterial map={eliTexture} transparent alphaTest={0.5} side={THREE.DoubleSide} /></Plane>
        </group>

        <group position={[-4, 1, 1]}>
          <Plane args={[2, 3]}><meshStandardMaterial map={bullyTexture} transparent alphaTest={0.5} side={THREE.DoubleSide} /></Plane>
        </group>
        <group position={[4, 1, 1]}>
          <Plane args={[2, 3]}><meshStandardMaterial map={bullyTexture} transparent alphaTest={0.5} side={THREE.DoubleSide} /></Plane>
        </group>
        <group position={[0, 1, -2]}>
          <Plane args={[2, 3]}><meshStandardMaterial map={bullyTexture} transparent alphaTest={0.5} side={THREE.DoubleSide} /></Plane>
        </group>

        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
      </Canvas>

      <GameHUD chapter={5} chapterTitle="The Quiet Rain" nearbyObjects={nearbyObjects} />
      <DialogueBox />

      {showEnding && <EndingScreen />}
    </div>
  );
};
