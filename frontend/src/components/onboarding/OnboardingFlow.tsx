import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Users, Scan, Shield, Heart, Waves, Fish, Volume2, VolumeX } from 'lucide-react';

const OnboardingFlow = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasVibration, setHasVibration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Check for vibration support
  useEffect(() => {
    setHasVibration('vibrate' in navigator);
  }, []);

  // Initialize Audio Context
  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.AudioContext)();
    }
  }, [soundEnabled]);

  const screens = [
    {
      id: 1,
      title: "For All Stakeholders",
      description: "Whether you're a harvester, processor, transporter, inspector, or consumer, TracceAqua empowers you with transparency.",
      icon: <Users className="w-20 h-20 text-blue-400" />,
      animation: "users",
      buttonText: "Next",
      gradient: "from-blue-600 to-blue-800",
      bgPattern: "users"
    },
    {
      id: 2,
      title: "Trace With Ease",
      description: "Consumers can simply scan a QR code to get the full history and origin of their shellfish product.",
      icon: <Scan className="w-20 h-20 text-cyan-400" />,
      animation: "scan",
      buttonText: "Continue",
      gradient: "from-cyan-600 to-blue-700",
      bgPattern: "scan"
    },
    {
      id: 3,
      title: "How It Works",
      description: "We use blockchain technology to record every step of the shellfish journey, from harvest to your plate.",
      icon: <Shield className="w-20 h-20 text-teal-400" />,
      animation: "blockchain",
      buttonText: "Amazing!",
      gradient: "from-teal-600 to-cyan-700",
      bgPattern: "blockchain"
    },
    {
      id: 4,
      title: "Welcome to TracceAqua!",
      description: "Your trusted partner for traceability and conservation in the Nigerian shellfish supply chain",
      icon: <Heart className="w-20 h-20 text-emerald-400" />,
      animation: "welcome",
      buttonText: "Get Started",
      gradient: "from-emerald-600 to-teal-700",
      bgPattern: "welcome"
    }
  ];

  // Native Web Audio API sound generation
interface PlaySoundTypeMap {
    click: void;
    transition: void;
    success: void;
    whoosh: void;
}

type PlaySoundType = keyof PlaySoundTypeMap;

// interface AudioContextRef {
//     current: AudioContext | null;
// }

const playSound = (type: PlaySoundType): void => {
    if (!soundEnabled || !audioContextRef.current) return;

    const ctx: AudioContext = audioContextRef.current;
    const oscillator: OscillatorNode = ctx.createOscillator();
    const gainNode: GainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch (type) {
        case 'click':
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
            break;
        case 'transition':
            oscillator.frequency.setValueAtTime(400, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
            break;
        case 'success':
            // Success chord
            [523, 659, 784].forEach((freq, i) => {
                const osc: OscillatorNode = ctx.createOscillator();
                const gain: GainNode = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(0.03, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime + i * 0.1);
                osc.stop(ctx.currentTime + 0.5 + i * 0.1);
            });
            break;
        case 'whoosh':
            oscillator.frequency.setValueAtTime(200, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.2);
            break;
    }
};

  // Enhanced navigation with transitions and feedback
  const handleNext = async () => {
    // Haptic feedback
    if (hasVibration) {
      navigator.vibrate([50, 30, 50]);
    }

    // Audio feedback
    if (currentScreen === screens.length - 1) {
      playSound('success');
    } else {
      playSound('click');
    }

    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentScreen < screens.length - 1) {
        setCurrentScreen(currentScreen + 1);
        playSound('transition');
      } else {
        playSound('whoosh');
        console.log("Navigate to authentication");
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevious = () => {
    if (hasVibration) {
      navigator.vibrate(30);
    }
    
    playSound('click');
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentScreen > 0) {
        setCurrentScreen(currentScreen - 1);
        playSound('transition');
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleSkip = () => {
    if (hasVibration) {
      navigator.vibrate([30, 50, 30, 50, 30]);
    }
    
    playSound('whoosh');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screens.length - 1);
      setIsTransitioning(false);
    }, 300);
  };

// Touch gesture handlers
const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    touchStartX.current = e.touches[0].clientX;
};

const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    touchEndX.current = e.touches[0].clientX;
};

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentScreen < screens.length - 1) {
      if (hasVibration) navigator.vibrate(30);
      playSound('click');
      handleNext();
    }

    if (isRightSwipe && currentScreen > 0) {
      if (hasVibration) navigator.vibrate(30);
      playSound('click');
      handlePrevious();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    interface KeyboardEventWithPrevent extends KeyboardEvent {
      preventDefault(): void;
      key: string;
    }

    const handleKeyPress = (e: KeyboardEventWithPrevent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentScreen]);

  // Custom CSS animations component
  const CustomAnimation: React.FC<{ type: string; className?: string }> = ({ type, className = "" }) => {
    switch (type) {
      case 'users':
        return (
          <div className={`${className} relative`}>
            <div className="w-24 h-24 relative">
              {/* Animated user circles */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-white rounded-full animate-ping opacity-60"
                  style={{
                    top: `${20 + (i % 3) * 20}%`,
                    left: `${20 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
              <Users className="w-20 h-20 text-blue-400 relative z-10" />
            </div>
          </div>
        );
      case 'scan':
        return (
          <div className={`${className} relative`}>
            <div className="w-24 h-24 relative">
              {/* QR scanning line */}
              <div className="absolute inset-0 border-2 border-white/30 rounded-lg">
                <div className="w-full h-0.5 bg-cyan-400 animate-scan absolute top-0"></div>
              </div>
              <Scan className="w-20 h-20 text-cyan-400 relative z-10 m-2" />
            </div>
          </div>
        );
      case 'blockchain':
        return (
          <div className={`${className} relative`}>
            <div className="w-24 h-24 relative">
              {/* Blockchain blocks */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 border border-white rounded transform rotate-45 animate-spin opacity-60"
                  style={{
                    top: `${30 + i * 15}%`,
                    left: `${30 + i * 10}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3s'
                  }}
                />
              ))}
              <Shield className="w-20 h-20 text-teal-400 relative z-10" />
            </div>
          </div>
        );
      case 'welcome':
        return (
          <div className={`${className} relative`}>
            <div className="w-24 h-24 relative">
              {/* Floating elements */}
              <Waves className="absolute top-2 left-2 w-4 h-4 text-white/40 animate-bounce" />
              <Fish className="absolute top-4 right-2 w-3 h-3 text-white/40 animate-bounce delay-500" />
              <Heart className="w-20 h-20 text-emerald-400 relative z-10 animate-heartbeat" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Background pattern components
  const BackgroundPattern: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
      case 'users':
        return (
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-white rounded-full animate-pulse"
                style={{
                  top: `${20 + (i * 15)}%`,
                  left: `${10 + (i % 2 * 80)}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>
        );
      case 'scan':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-white rounded-lg animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-16 h-16 border-2 border-white rounded-lg animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/6 w-12 h-12 border border-white rounded animate-ping delay-500"></div>
          </div>
        );
      case 'blockchain':
        return (
          <div className="absolute inset-0 opacity-10">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 border border-white transform rotate-45 animate-spin"
                style={{
                  top: `${15 + (i * 8)}%`,
                  left: `${5 + (i % 4 * 25)}%`,
                  animationDuration: `${3 + (i % 3)}s`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        );
      case 'welcome':
        return (
          <div className="absolute inset-0 opacity-15">
            <Waves className="absolute top-20 left-10 w-12 h-12 animate-bounce" />
            <Fish className="absolute top-40 right-16 w-10 h-10 animate-bounce delay-500" />
            <Waves className="absolute bottom-32 left-20 w-14 h-14 animate-bounce delay-1000" />
            <Fish className="absolute bottom-20 right-10 w-8 h-8 animate-bounce delay-1500" />
            <Heart className="absolute top-32 right-32 w-6 h-6 animate-pulse delay-300" />
            <Shield className="absolute bottom-40 left-32 w-5 h-5 animate-spin delay-800" />
          </div>
        );
      default:
        return null;
    }
  };

  const current = screens[currentScreen];

  return (
    <div 
      className="min-h-screen flex flex-col overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sound Toggle Button */}
      <button
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          if (hasVibration) navigator.vibrate(20);
          playSound('click');
        }}
        className="absolute top-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-sm rounded-full
                 hover:bg-white/30 transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-white" />
        ) : (
          <VolumeX className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Background with enhanced gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${current.gradient} transition-all duration-700 ease-in-out`}>
        {/* Animated background pattern */}
        <BackgroundPattern type={current.bgPattern} />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>
      </div>

      {/* Content Container with enhanced transitions */}
      <div className={`relative z-10 flex flex-col min-h-screen transition-all duration-500 ${
        isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}>
        
        {/* Progress Indicators with enhanced animation */}
        <div className="flex justify-center pt-16 pb-8">
          <div className="flex space-x-3">
            {screens.map((_, index) => (
              <div
                key={index}
                className={`h-3 rounded-full transition-all duration-500 transform ${
                  index === currentScreen 
                    ? 'w-10 bg-white shadow-lg scale-110 animate-glow' 
                    : index < currentScreen 
                    ? 'w-3 bg-white/90 scale-100' 
                    : 'w-3 bg-white/30 scale-90'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content with slide animation */}
        <div className={`flex-1 flex flex-col items-center justify-center px-6 text-center transition-all duration-700 transform ${
          isTransitioning ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'
        }`}>
          
          {/* Custom Animation with enhanced effects */}
          <div className="mb-8 transform transition-all duration-700 hover:scale-110 hover:rotate-3">
            <CustomAnimation type={current.animation} className="animate-fadeInScale" />
          </div>

          {/* Title with enhanced typewriter effect */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-md leading-tight">
            <span className="inline-block animate-fadeInUp animate-shimmer">
              {current.title}
            </span>
          </h1>

          {/* Description with staggered animation */}
          <p className="text-lg md:text-xl text-white/90 max-w-sm leading-relaxed mb-12 animate-fadeInUp animation-delay-200">
            {current.description}
          </p>

        </div>

        {/* Enhanced Navigation */}
        <div className="p-6 space-y-4">
          
          {/* Primary Button with enhanced effects */}
          <button
            onClick={handleNext}
            className="w-full bg-white text-gray-800 font-semibold py-5 px-6 rounded-2xl 
                     transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                     flex items-center justify-center space-x-2 group relative overflow-hidden
                     active:scale-95 animate-glow"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                          transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                          transition-transform duration-1000"></div>
            
            <span className="relative z-10">{current.buttonText}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
          </button>

          {/* Back Button with subtle animation */}
          {currentScreen > 0 && (
            <button
              onClick={handlePrevious}
              className="w-full text-white/80 font-medium py-4 px-6 rounded-xl
                       hover:text-white hover:bg-white/10 transition-all duration-300
                       transform hover:scale-102 active:scale-98"
            >
              Back
            </button>
          )}

          {/* Skip Button with enhanced bounce effect */}
          {currentScreen < screens.length - 1 && (
            <button
              onClick={handleSkip}
              className="w-full text-white/60 font-medium py-3 hover:text-white/80 
                       transition-all duration-300 hover:scale-105 active:scale-95
                       animate-bounce animation-delay-1000"
            >
              Skip
            </button>
          )}

          {/* Gesture Hint */}
          <div className="text-center text-white/40 text-sm mt-4 animate-fadeIn animation-delay-1000">
            Swipe left/right or use arrow keys to navigate
          </div>

        </div>

      </div>

      {/* Enhanced Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shimmer {
          0% { 
            background-position: -200px 0; 
          }
          100% { 
            background-position: calc(200px + 100%) 0; 
          }
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3),
                        0 0 40px rgba(255, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.5),
                        0 0 60px rgba(255, 255, 255, 0.2);
          }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05); }
        }

        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float var(--duration, 4s) ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        /* Smooth transitions for all elements */
        * {
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;