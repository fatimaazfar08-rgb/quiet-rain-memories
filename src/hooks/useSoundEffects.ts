// import { useCallback, useEffect, useRef } from 'react';
// import rainSound from '@/assets/real-rain-sound-379215.mp3';

// export const useSoundEffects = () => {
//   const rainAudioRef = useRef<HTMLAudioElement | null>(null);

//   // ✅ RAIN LOOP (KEEP YOUR EXISTING CODE)
//   useEffect(() => {
//     const rainAudio = new Audio(rainSound);
//     rainAudio.loop = true;
//     rainAudio.volume = 0.6;
//     rainAudio.play().catch(() => {
//       console.warn('Rain sound will play after user interacts with the page.');
//     });
//     rainAudioRef.current = rainAudio;

//     return () => {
//       rainAudio.pause();
//       rainAudioRef.current = null;
//     };
//   }, []);

//   const playSound = useCallback((type: 'interact' | 'collect' | 'panic' | 'dialogue' | 'heartbeat' | 'memory-align' | 'realization') => {
//     const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();

//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);

//     switch (type) {
//       case 'interact':
//         oscillator.frequency.value = 440;
//         gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.2);
//         break;

//       case 'collect':
//         oscillator.frequency.value = 880;
//         gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.3);
//         break;

//       case 'panic':
//         oscillator.type = 'sawtooth';
//         oscillator.frequency.value = 100;
//         gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 1);
//         break;

//       case 'dialogue':
//         oscillator.frequency.value = 600;
//         gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.15);
//         break;

//       // 💔 NEW EMOTIONAL SOUNDS FOR CHAPTER TRANSITION
//       case 'heartbeat':
//         oscillator.type = 'sine';
//         oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
//         oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.6);
        
//         gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.6);
//         break;

//       case 'memory-align':
//         // ✨ Magical "click" sound
//         oscillator.type = 'triangle';
//         oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
//         oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.4);
        
//         gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.4);
//         break;

//       case 'realization':
//         // ⚡ Dramatic "whoosh" + flash
//         const realizationOsc = audioContext.createOscillator();
//         const realizationGain = audioContext.createGain();
        
//         realizationOsc.connect(realizationGain);
//         realizationGain.connect(audioContext.destination);
        
//         realizationOsc.type = 'sine';
//         realizationOsc.frequency.setValueAtTime(200, audioContext.currentTime);
//         realizationOsc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1.5);
        
//         realizationGain.gain.setValueAtTime(0.3, audioContext.currentTime);
//         realizationGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        
//         realizationOsc.start(audioContext.currentTime);
//         realizationOsc.stop(audioContext.currentTime + 1.5);
//         break;
//     }
//   }, []);

//   return { playSound };
// };

import { useCallback, useEffect, useRef, useState } from 'react';
import rainSound from '@/assets/real-rain-sound-379215.mp3';

export const useSoundEffects = () => {
  const rainAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false); // ✅ PREVENT SPAM BEFORE USER INTERACTION

  // ✅ SINGLE AudioContext - REUSED ACROSS ALL SOUNDS
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // ✅ RAIN LOOP (UNCHANGED, BUT LOWER VOLUME TO AVOID OVERLAP)
  useEffect(() => {
    if (!isAudioReady) return; // ✅ WAIT FOR USER INTERACTION

    const rainAudio = new Audio(rainSound);
    rainAudio.loop = true;
    rainAudio.volume = 0.3; // ✅ LOWER TO AVOID DISTORTION
    rainAudio.play().catch(() => {
      console.warn('Rain sound autoplay blocked. Will play after interaction.');
    });
    rainAudioRef.current = rainAudio;

    return () => {
      rainAudio.pause();
      rainAudioRef.current = null;
    };
  }, [isAudioReady]);

  // ✅ ENABLE AUDIO AFTER FIRST USER INTERACTION (BROWSER AUTOPLAY POLICY)
  useEffect(() => {
    const enableAudio = () => {
      setIsAudioReady(true);
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
    window.addEventListener('click', enableAudio);
    window.addEventListener('keydown', enableAudio);

    return () => {
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
  }, []);

  // ✅ FIXED: SINGLE CONTEXT + SAFE PLAY
  const playSound = useCallback((type: 'interact' | 'collect' | 'panic' | 'dialogue' | 'heartbeat' | 'memory-align' | 'realization') => {
    if (!isAudioReady) return; // ✅ BLOCK UNTIL READY

    try {
      const audioContext = getAudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case 'interact':
          oscillator.frequency.value = 440;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'collect':
          oscillator.frequency.value = 880;
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case 'panic':
          oscillator.type = 'sawtooth';
          oscillator.frequency.value = 100;
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
        case 'dialogue':
          oscillator.frequency.value = 600;
          gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'heartbeat':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.4);
          gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
        case 'memory-align':
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'realization':
          const realizationOsc = audioContext.createOscillator();
          const realizationGain = audioContext.createGain();
          realizationOsc.connect(realizationGain);
          realizationGain.connect(audioContext.destination);
          realizationOsc.type = 'sine';
          realizationOsc.frequency.setValueAtTime(200, audioContext.currentTime);
          realizationOsc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1);
          realizationGain.gain.setValueAtTime(0.1, audioContext.currentTime);
          realizationGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
          realizationOsc.start(audioContext.currentTime);
          realizationOsc.stop(audioContext.currentTime + 1);
          break;
      }
    } catch (error) {
      console.log('🔇 Audio blocked by browser');
    }
  }, [getAudioContext, isAudioReady]);

  // ✅ CLEANUP AudioContext ON UNMOUNT
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return { playSound };
};