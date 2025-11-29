
export interface BabyProfile {
  name: string;
  parentName: string;
  birthDate: string;
  weight: string; // keeping as string for input handling
  height: string;
  parentType: 'Mother' | 'Father';
  avatar?: string; // Base64 string for the image
}

export type ActivityType = 'meal' | 'medicine' | 'sleep' | 'play';

export interface PlanItem {
  id: string;
  type: ActivityType;
  title: string;
  time: string;
  endTime?: string; // For sleep end time
  details?: string;
  isCompleted: boolean;
  date: string; // YYYY-MM-DD
  hasReminder?: boolean;
}

export interface DayPlan {
  date: string; // ISO Date string YYYY-MM-DD
  items: PlanItem[];
}

export interface GrowthRecord {
  id: string;
  type: 'weight' | 'height';
  value: string;
  date: string; // YYYY-MM-DD
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'food' | 'medicine' | 'clothes' | 'other';
  isChecked: boolean;
}

export interface HospitalVisit {
  id: string;
  hospitalName: string;
  date: string;
  reason: string;
  notes?: string;
}

export type AppScreen = 'splash' | 'onboarding' | 'welcome' | 'dashboard';
