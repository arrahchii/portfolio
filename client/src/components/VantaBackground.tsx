import { useEffect, useRef, useState } from 'react';

// Declare global types for Vanta
declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

interface VantaBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const VantaBackground: React.FC<VantaBackgroundProps> = ({ 
  className = '', 
  children 
}) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initializeVanta = async () => {
      try {
        // Load Three.js first
        if (!window.THREE) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js');
        }

        // Load Vanta.js NET effect
        if (!window.VANTA) {
          await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js');
        }

        // Small delay to ensure scripts are fully initialized
        await new Promise(resolve => setTimeout(resolve, 200));

        if (!mounted) return;

        // Initialize Vanta effect
        if (window.VANTA && window.VANTA.NET && window.THREE && vantaRef.current) {
          vantaEffect.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x3f3f46, // Dark gray lines
            backgroundColor: 0x8a8ab1, // Purple-blue background
            points: 10.00,
            maxDistance: 20.00,
            spacing: 15.00
          });
          
          setIsLoaded(true);
        }
      } catch (error) {
        // Silently handle errors - Vanta effect is optional
      }
    };

    initializeVanta();

    // Cleanup function
    return () => {
      mounted = false;
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (error) {
          // Silently handle cleanup errors
        }
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={vantaRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ 
        zIndex: -10,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#8a8ab1', // Purple-blue fallback background
        background: isLoaded ? 'transparent' : '#8a8ab1'
      }}
    >
      {children}
    </div>
  );
};

export default VantaBackground;