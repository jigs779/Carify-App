
import React from 'react';
import { BabyProfile } from '../types';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  profile: BabyProfile;
  onPlan: () => Promise<void>;
}

const WelcomeScreen: React.FC<Props> = ({ profile, onPlan }) => {

  const handlePlanClick = async () => {
    await onPlan();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white max-w-md mx-auto relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
        <div className="bg-white border-2 border-gray-100 p-8 rounded-full mb-8 shadow-sm">
             <div className="relative">
                <Heart className="text-duoRed fill-duoRed animate-pulse" size={80} strokeWidth={2.5} />
                <div className="absolute -right-4 -top-4">
                    <Sparkles className="text-duoYellow fill-current" size={40} />
                </div>
             </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-700 mb-3">
          Hi, {profile.parentName}!<br/>
          <span className="text-xl text-gray-400 font-bold">({profile.name}'s {profile.parentType === 'Mother' ? 'Mom' : 'Dad'})</span>
        </h1>
        
        <p className="text-gray-400 font-bold text-lg mb-12 max-w-xs mt-4">
          Ready to simplify your day? Let's get everything organized!
        </p>

        <button
          onClick={handlePlanClick}
          className="w-full max-w-xs bg-duoBlue text-white font-extrabold text-lg uppercase tracking-wide py-4 rounded-2xl border-b-4 border-duoBlueDark active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          LET'S GO <ArrowRight size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
