import { useEffect, useState, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from './button';

export const DialogueBox = () => {
  const { showDialogue, dialogue, setDialogue } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cachedTransformedText = useRef<string>('');

  // Transform text only for 'player' or 'Eli' speakers
  const getTransformedText = useCallback((originalText: string, speaker: string): string => {
    if (speaker !== 'player' && speaker !== 'Eli') {
      return originalText; // No transformation for non-player/Eli speakers
    }
    
    // Deterministic transformation for player/Eli
    const patterns = [
      `${originalText} ... It repeats in my head. The echo is too loud.`,
      `${originalText} Exactly like that. No deviations. But the lights buzz—distracting.`,
      `${originalText} ... I feel the weight. Patterns shifting. Sensory input overload.`,
    ];
    return patterns[Date.now() % patterns.length];
  }, []);

  // Typewriter effect with proper cleanup
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

    console.log('Rendering dialogue:', { text: transformedText, speaker: dialogue.speaker }); // Debug log

    typeIntervalRef.current = setInterval(() => {
      if (index < transformedText.length) {
        setDisplayedText((prev) => prev + transformedText[index]);
        index++;
      } else {
        setIsTyping(false);
        if (typeIntervalRef.current) {
          clearInterval(typeIntervalRef.current);
          typeIntervalRef.current = null;
        }
        console.log('Displayed text:', displayedText); // Debug log after typing
      }
    }, typingSpeed);

    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
      console.log('DialogueBox cleanup'); // Debug log
    };
  }, [dialogue?.text, dialogue?.speaker, showDialogue, getTransformedText]);

  // Memoized handleClose
  const handleClose = useCallback(() => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    
    if (isTyping) {
      setDisplayedText(cachedTransformedText.current);
      setIsTyping(false);
    } else {
      setDialogue(null);
      setDisplayedText('');
    }
  }, [isTyping, setDialogue]);

  // Early return if no dialogue
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