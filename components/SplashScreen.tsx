import React, { useEffect } from 'react';
import { Milk } from 'lucide-react';

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-screen w-full bg-duoBlue flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-duoGreen opacity-20 rounded-full"></div>

      <div className="flex flex-col items-center z-10 animate-fade-in-up">
        <div className="bg-white p-8 rounded-3xl border-b-4 border-gray-200 mb-6 transform hover:scale-105 transition-transform duration-500">
           <Milk size={64} className="text-duoBlue" strokeWidth={2.5} />
        </div>
        
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
          Carify
        </h1>
        <p className="text-blue-100 font-bold text-xl tracking-wide">
          Baby Care, Simplified
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;