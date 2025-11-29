
import React, { useState } from 'react';
import { BabyProfile } from '../types';
import { Calendar, Ruler, Weight, User, Smile } from 'lucide-react';

interface Props {
  onComplete: (profile: BabyProfile) => void;
}

const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [profile, setProfile] = useState<BabyProfile>({
    name: '',
    parentName: '',
    birthDate: '',
    weight: '',
    height: '',
    parentType: 'Mother'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.birthDate && profile.parentName) {
      onComplete(profile);
    }
  };

  const inputClass = "w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-700 font-bold focus:outline-none focus:border-duoBlue focus:bg-white transition-colors";
  const labelClass = "text-sm font-extrabold text-gray-500 ml-1 uppercase tracking-wide mb-2 block";

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 max-w-md mx-auto">
      <div className="mt-8 mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Let’s know your<br/>baby better 👶</h2>
        <p className="text-gray-400 font-bold">Help us personalize your experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        
        {/* Parent Name */}
        <div>
          <label className={labelClass}>Your Name</label>
          <div className="relative">
            <Smile className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} strokeWidth={2.5} />
            <input 
              type="text" 
              required
              placeholder="e.g. Sarah"
              value={profile.parentName}
              onChange={(e) => setProfile({...profile, parentName: e.target.value})}
              className={inputClass}
            />
          </div>
        </div>

        {/* Baby Name */}
        <div>
          <label className={labelClass}>Baby's Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} strokeWidth={2.5} />
            <input 
              type="text" 
              required
              placeholder="e.g. Liam"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className={inputClass}
            />
          </div>
        </div>

        {/* DOB */}
        <div>
          <label className={labelClass}>Birth Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} strokeWidth={2.5} />
            <input 
              type="date" 
              required
              value={profile.birthDate}
              onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-4">
          {/* Weight */}
          <div className="flex-1">
            <label className={labelClass}>Weight (kg)</label>
            <div className="relative">
              <Weight className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} strokeWidth={2.5} />
              <input 
                type="number" 
                placeholder="0.0"
                step="0.1"
                value={profile.weight}
                onChange={(e) => setProfile({...profile, weight: e.target.value})}
                className={inputClass}
              />
            </div>
          </div>

          {/* Height */}
          <div className="flex-1">
            <label className={labelClass}>Height (cm)</label>
            <div className="relative">
              <Ruler className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} strokeWidth={2.5} />
              <input 
                type="number" 
                placeholder="0"
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: e.target.value})}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Parent Selector */}
        <div className="pt-2">
          <label className={labelClass}>I am the...</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setProfile({...profile, parentType: 'Mother'})}
              className={`flex-1 py-4 rounded-2xl border-2 border-b-4 font-extrabold transition-all active:border-b-2 active:translate-y-1 ${profile.parentType === 'Mother' ? 'border-duoRedDark bg-duoRed text-white' : 'border-gray-200 bg-white text-gray-400'}`}
            >
              Mother
            </button>
            <button
              type="button"
              onClick={() => setProfile({...profile, parentType: 'Father'})}
              className={`flex-1 py-4 rounded-2xl border-2 border-b-4 font-extrabold transition-all active:border-b-2 active:translate-y-1 ${profile.parentType === 'Father' ? 'border-duoBlueDark bg-duoBlue text-white' : 'border-gray-200 bg-white text-gray-400'}`}
            >
              Father
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-8 bg-duoGreen hover:bg-green-500 text-white font-extrabold uppercase tracking-wider py-4 rounded-2xl border-b-4 border-duoGreenDark active:border-b-0 active:translate-y-1 transition-all"
        >
          Get Started
        </button>

      </form>
    </div>
  );
};

export default OnboardingScreen;
