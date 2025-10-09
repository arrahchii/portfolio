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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadScript = (src: string, timeout = 10000): Promise<void> => {
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
        script.crossOrigin = 'anonymous';
        
        // Add timeout for slow connections
        const timeoutId = setTimeout(() => {
          reject(new Error(`Script loading timeout: ${src}`));
        }, timeout);

        script.onload = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        
        script.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error(`Failed to load script: ${src}`));
        };
        
        document.head.appendChild(script);
      });
    };

    const initializeVanta = async () => {
      try {
        // Use HTTPS CDN URLs with specific versions for production stability
        const threeJsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        const vantaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.net.min.js';

        // Load Three.js first with timeout
        if (!window.THREE) {
          await loadScript(threeJsUrl, 15000);
        }

        // Verify Three.js loaded correctly
        if (!window.THREE) {
          throw new Error('Three.js failed to load');
        }

        // Load Vanta.js NET effect with timeout
        if (!window.VANTA) {
          await loadScript(vantaUrl, 15000);
        }

        // Verify Vanta.js loaded correctly
        if (!window.VANTA || !window.VANTA.NET) {
          throw new Error('Vanta.js NET effect failed to load');
        }

        // Longer delay for production environments
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!mounted) return;

        // Initialize Vanta effect with error checking
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
            spacing: 15.00,
            // Add production-specific settings
            showDots: true,
            showLines: true,
            spacing: 16.00,
            backgroundAlpha: 1.0
          });
          
          // Verify effect was created successfully
          if (vantaEffect.current) {
            setIsLoaded(true);
            console.log('✅ Vanta.js NET effect loaded successfully');
          } else {
            throw new Error('Vanta effect initialization failed');
          }
        }
      } catch (error) {
        console.warn('⚠️ Vanta.js failed to load:', error);
        setHasError(true);
        // Fallback to static background
        setIsLoaded(false);
      }
    };

    // Add a small delay before initialization to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializeVanta();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      mounted = false;
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (error) {
          console.warn('Error destroying Vanta effect:', error);
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
        background: isLoaded ? 'transparent' : '#8a8ab1',
        // Add gradient fallback for better visual appeal when Vanta fails
        backgroundImage: hasError ? 'linear-gradient(135deg, #8a8ab1 0%, #6366f1 50%, #8b5cf6 100%)' : undefined,
        transition: 'background 0.5s ease-in-out'
      }}
    >
      {children}
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 text-xs text-white/70 bg-black/20 p-2 rounded">
          Vanta: {isLoaded ? '✅ Loaded' : hasError ? '❌ Error' : '⏳ Loading...'}
        </div>
      )}
    </div>
  );
};

export default VantaBackground;