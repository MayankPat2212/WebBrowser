import React, { useState, useEffect } from "react";
import { Monitor } from "lucide-react";

const BootSequence = ({ onBootComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [displayText, setDisplayText] = useState([]);
  const [isZooming, setIsZooming] = useState(false);

  const bootMessages = [
    "[ OK ] Starting Kali Linux Security OS...",
    "[ OK ] Loading kernel modules",
    "[ OK ] Initializing network interfaces",
    "[ OK ] Starting system logging daemon",
    "[ OK ] Starting enhanced privacy protocols",
    "[ OK ] Loading cryptographic modules",
    "[ OK ] Initializing secure search engine",
    "[ OK ] Establishing anonymous connections",
    "[ OK ] Privacy shield: ACTIVE",
    "[ OK ] Secure search ready",
    "",
    "Welcome to CyberSearch - Your Privacy-First Search Engine",
    "Initializing secure connection...",
    "Ready."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentPhase < bootMessages.length) {
        setDisplayText(prev => [...prev, bootMessages[currentPhase]]);
        setCurrentPhase(prev => prev + 1);
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setIsZooming(true);
          setTimeout(() => {
            onBootComplete();
          }, 3000);
        }, 1000);
      }
    }, 300);

    return () => clearInterval(timer);
  }, [currentPhase, bootMessages, onBootComplete]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className={`relative ${isZooming ? 'animate-zoom-smooth' : ''}`}>
        {/* Monitor Frame */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border-2 border-gray-600">
          {/* Monitor Stand */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-700 rounded-b-lg"></div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-800 rounded-lg"></div>
          
          {/* Screen */}
          <div className="w-96 h-72 bg-black border-4 border-gray-700 rounded p-4 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {displayText.map((line, index) => (
                <div key={index} className="font-mono text-sm text-green-400 mb-1 leading-tight">
                  {line.startsWith("[ OK ]") ? (
                    <span>
                      <span className="text-green-500">[ OK ]</span>
                      <span className="ml-2">{line.substring(6)}</span>
                    </span>
                  ) : line.startsWith("Welcome") || line.startsWith("Initializing") || line.startsWith("Ready") ? (
                    <span className="text-green-300 font-semibold">{line}</span>
                  ) : (
                    line
                  )}
                </div>
              ))}
              {currentPhase < bootMessages.length && (
                <span className="text-green-400 animate-pulse">█</span>
              )}
            </div>
          </div>
          
          {/* Monitor Brand */}
          <div className="text-center mt-2">
            <Monitor className="w-6 h-6 text-gray-400 mx-auto" />
            <span className="text-gray-400 text-xs font-mono">CYBER-MON v2.1</span>
          </div>
        </div>
        
        {/* Power LED */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default BootSequence;