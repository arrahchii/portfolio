import { useState, useEffect, useRef } from 'react';

/**
 * Reveals text word-by-word with a typing effect.
 * Returns the partially-revealed text and whether streaming is complete.
 */
export function useTypewriter(fullText: string, speed: number = 30): { displayText: string; isDone: boolean } {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset when the target text changes
    setDisplayText('');
    setIsDone(false);
    indexRef.current = 0;

    if (!fullText) {
      setIsDone(true);
      return;
    }

    // Split into words for natural typing
    const words = fullText.split(' ');

    intervalRef.current = setInterval(() => {
      if (indexRef.current < words.length) {
        const next = words.slice(0, indexRef.current + 1).join(' ');
        setDisplayText(next);
        indexRef.current++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(fullText);
        setIsDone(true);
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fullText, speed]);

  return { displayText, isDone };
}
