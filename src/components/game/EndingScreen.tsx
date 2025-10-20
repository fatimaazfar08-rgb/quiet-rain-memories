import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export const EndingScreen = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Eli's Reflection",
      text: "I realize now... it wasn't my fault. The weight I've carried all these years, the guilt that consumed me... it was never mine to bear.",
      speaker: "Eli"
    },
    {
      title: "Understanding",
      text: "Rowan didn't fall because of who I am. They fell because we were children in a moment of chaos, scared and running from those who tormented us.",
      speaker: "Eli"
    },
    {
      title: "The Bullies' Confession",
      text: "We let you take the blame. We were cowards. We watched you suffer and said nothing. We're so sorry, Eli.",
      speaker: "The Bullies"
    },
    {
      title: "Acceptance",
      text: "I can't change what happened. But I can choose how I carry it forward. Rowan would want me to live, not just survive.",
      speaker: "Eli"
    },
    {
      title: "The Quiet Rain",
      text: "The rain still falls, but now I hear it differently. Not as a reminder of loss, but as a gentle presence. Life continues. And so must I.",
      speaker: "Narrator"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'n') {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(prev => prev + 1);
        }
      } else if (event.key === 'p') {
        if (currentSlide > 0) {
          setCurrentSlide(prev => prev - 1);
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, slides.length]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // ✅ BETTER: Go to main menu or credits
    navigate('/'); // Main menu
    // OR: navigate('/credits'); // If you have credits page
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/rain-pattern.svg')] opacity-5 animate-pulse"></div>

      <div className="relative max-w-4xl w-full px-8 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-slate-100 mb-4 tracking-tight">
            {slides[currentSlide].title}
          </h1>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-12 shadow-2xl min-h-[300px] flex flex-col justify-center">
          <p className="text-2xl text-slate-200 leading-relaxed mb-6 text-center italic">
            "{slides[currentSlide].text}"
          </p>
          <p className="text-lg text-blue-300 text-center font-semibold">
            — {slides[currentSlide].speaker}
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-12">
          <Button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            variant="outline"
            className="px-6 py-3"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-blue-400'
                    : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>

          {currentSlide < slides.length - 1 ? (
            <Button
              onClick={handleNext}
              className="px-6 py-3"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600"
            >
              Finish & Return Home
            </Button>
          )}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 text-lg">
            Progress: {currentSlide + 1} / {slides.length}
          </p>
        </div>
      </div>
    </div>
  );
};