import { useCallback, useEffect, useRef } from 'react';

let rainAudioContext: AudioContext | null = null;
let rainGainNode: GainNode | null = null;

export const useSoundEffects = () => {
  const rainNodesRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (!rainAudioContext) {
      rainAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      rainGainNode = rainAudioContext.createGain();
      rainGainNode.connect(rainAudioContext.destination);
      rainGainNode.gain.value = 0.05;

      const createRainLayer = (freq: number, detune: number) => {
        const osc = rainAudioContext!.createOscillator();
        const filter = rainAudioContext!.createBiquadFilter();

        osc.type = 'white' in OscillatorNode.prototype ? 'white' as any : 'sawtooth';
        osc.frequency.value = freq;
        osc.detune.value = detune;

        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;

        osc.connect(filter);
        filter.connect(rainGainNode!);
        osc.start();

        return osc;
      };

      rainNodesRef.current = [
        createRainLayer(100, 0),
        createRainLayer(150, 50),
        createRainLayer(200, -30),
      ];
    }

    return () => {
      rainNodesRef.current.forEach(node => {
        try {
          node.stop();
        } catch (e) {}
      });
    };
  }, []);

  const playSound = useCallback((type: 'interact' | 'collect' | 'panic' | 'dialogue' | 'rain') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'interact':
        oscillator.frequency.value = 440;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;

      case 'collect':
        oscillator.frequency.value = 880;
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;

      case 'panic':
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 100;
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
        break;

      case 'dialogue':
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
    }
  }, []);

  return { playSound };
};
