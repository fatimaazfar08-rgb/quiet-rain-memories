import { useEffect, useState, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from './button';

export const DialogueBox = () => {
  const { showDialogue, dialogue, setDialogue } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cachedTransformedText = useRef<string>('');

  // Transform text for 'player' (Eli) or 'Eli': reverse word order (no letter reversal) for jumbled memories
  const getTransformedText = useCallback((originalText: string, speaker: string): string => {
    const normalizedSpeaker = speaker.toLowerCase().trim(); // Case-insensitive
    console.log('Speaker received (normalized):', normalizedSpeaker); // Debug: exact speaker value
    console.log('Original text input:', originalText); // Debug: see exact original
    if (normalizedSpeaker !== 'player' && normalizedSpeaker !== 'eli') {
      // Normal for Miss Leah, etc.
      console.log('No transformation: Speaker is', speaker);
      return originalText;
    }
    
    // For player/Eli: Split into words, reverse the LIST OF WORDS (order only), join back – words unchanged
    const words = originalText.trim().split(/\s+/);
    console.log('Player/Eli words before reverse:', words); // Debug: check split
    const jumbledWords = [...words].reverse(); // Copy array, reverse ORDER – NO string.reverse() here!
    console.log('Player/Eli words after reverse:', jumbledWords); // Debug: reversed order, words intact
    const jumbledText = jumbledWords.join(' ');
    console.log('Player/Eli jumbled text (word order reversed):', jumbledText); // Debug: full jumbled, letters normal
    
    // Fixed echo (deterministic based on text length)
    const patterns = [
      ` ... It repeats in my head. The echo is too loud.`,
      ` Exactly like that. No deviations. But the lights buzz—distracting.`,
      ` ... I feel the weight. Patterns shifting. Sensory input overload.`,
    ];
    const patternIndex = originalText.length % patterns.length;
    const echo = patterns[patternIndex];
    console.log('Player/Eli echo added:', echo); // Debug
    
    const fullTransformed = `${jumbledText}${echo}`;
    console.log('FULL Player/Eli transformed (for typing & skip):', fullTransformed); // Debug: exact string used everywhere
    return fullTransformed;
  }, []);

  // Typewriter: Types the EXACT SAME transformed string forward (normal letters)
  useEffect(() => {
    if (!dialogue || !showDialogue) {
      setDisplayedText('');
      setIsTyping(false);
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
      return;
    }

    console.log('Full dialogue object:', dialogue); // Debug: entire dialogue to see speaker/text

    const transformedText = getTransformedText(dialogue.text, dialogue.speaker);
    cachedTransformedText.current = transformedText;

    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }

    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const typingSpeed = 30;

    // Debug: Log first 20 chars – should be NORMAL letters from start of jumbled (or original if not player/Eli)
    console.log('First 20 chars to type (NORMAL order):', transformedText.slice(0, 20));

    typeIntervalRef.current = setInterval(() => {
      if (index < transformedText.length) {
        // FORWARD: Add next char normally (e.g., 'o' then 'v' for "overload")
        const nextChar = transformedText[index];
        setDisplayedText((prev) => prev + nextChar);
        if (index < 20) {
          console.log(`Typing char ${index}: "${nextChar}"`); // Debug first 20 adds
        }
        index++;
      } else {
        setDisplayedText(transformedText); // Full same text
        setIsTyping(false);
        if (typeIntervalRef.current) {
          clearInterval(typeIntervalRef.current);
          typeIntervalRef.current = null;
        }
        console.log('Typing done: Full text matches skip');
      }
    }, typingSpeed);

    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
    };
  }, [dialogue?.text, dialogue?.speaker, showDialogue, getTransformedText]);

  // Skip: Jumps to SAME full transformed text (no change)
  const handleClose = useCallback(() => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    
    if (isTyping) {
      setDisplayedText(cachedTransformedText.current);
      setIsTyping(false);
      console.log('Skip: Set to SAME full text:', cachedTransformedText.current);
    } else {
      setDialogue(null);
      setDisplayedText('');
      console.log('Continue: Advance');
    }
  }, [isTyping, setDialogue]);

  // Keyboard skip (Space/Enter)
  useEffect(() => {
    if (!showDialogue) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const skipKeys = [' ', 'Enter'];
      if (skipKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Key skip:', event.key);
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [showDialogue, handleClose]);

  if (!showDialogue || !dialogue) return null;

  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-6 pointer-events-auto">
      <div className="bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-xl p-6 shadow-[0_0_30px_rgba(107,143,181,0.3)] animate-fade-in">
        <div className="mb-4">
          <div className="w-12 h-1 bg-primary/50 rounded-full mb-3" />
          <p className="text-foreground text-lg leading-relaxed font-medium">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />}
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            {isTyping ? 'Skip' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};