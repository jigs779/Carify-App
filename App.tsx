
import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import { AppScreen, BabyProfile, PlanItem, GrowthRecord, ShoppingItem, HospitalVisit } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [hospitalVisits, setHospitalVisits] = useState<HospitalVisit[]>([]);

  // Transition handlers
  const finishSplash = () => setCurrentScreen('onboarding');
  
  const finishOnboarding = (profile: BabyProfile) => {
    setBabyProfile(profile);
    setCurrentScreen('welcome');
  };

  const startDashboard = async () => {
    // Start with an empty plan for a fresh experience
    setPlans([]);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="font-sans text-textDark bg-gray-100 min-h-screen flex justify-center">
      {/* Container to simulate mobile width on desktop */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden relative">
        
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={finishSplash} />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingScreen onComplete={finishOnboarding} />
        )}

        {currentScreen === 'welcome' && babyProfile && (
          <WelcomeScreen profile={babyProfile} onPlan={startDashboard} />
        )}

        {currentScreen === 'dashboard' && babyProfile && (
          <Dashboard 
            profile={babyProfile} 
            initialItems={plans} 
            setItems={setPlans}
            growthRecords={growthRecords}
            setGrowthRecords={setGrowthRecords}
            shoppingItems={shoppingItems}
            setShoppingItems={setShoppingItems}
            hospitalVisits={hospitalVisits}
            setHospitalVisits={setHospitalVisits}
          />
        )}
      </div>
    </div>
  );
};

export default App;
