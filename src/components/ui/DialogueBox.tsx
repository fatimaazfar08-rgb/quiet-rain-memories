import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Button } from './button';

export const DialogueBox = () => {
  const { showDialogue, currentDialogue, setDialogue } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentDialogue && showDialogue) {
      setDisplayedText('');
      setIsTyping(true);
      
      let index = 0;
      const typingSpeed = 30; // ms per character

      const typeInterval = setInterval(() => {
        if (index < currentDialogue.length) {
          setDisplayedText((prev) => prev + currentDialogue[index]);
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, typingSpeed);

      return () => clearInterval(typeInterval);
    }
  }, [currentDialogue, showDialogue]);

  if (!showDialogue || !currentDialogue) return null;

  const handleClose = () => {
    if (isTyping) {
      // Skip to full text
      setDisplayedText(currentDialogue);
      setIsTyping(false);
    } else {
      setDialogue(null);
    }
  };

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
