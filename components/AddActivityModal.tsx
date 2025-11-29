
import React, { useState, useEffect } from 'react';
import { PlanItem, ActivityType } from '../types';
import { X, Clock, Type, Utensils, Pill, Moon, Bell } from 'lucide-react';

interface Props {
  type: ActivityType;
  selectedDate: string;
  initialItem?: PlanItem;
  onClose: () => void;
  onSave: (item: PlanItem) => void;
}

const AddActivityModal: React.FC<Props> = ({ type, selectedDate, initialItem, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<ActivityType>(initialItem ? initialItem.type : (type === 'play' ? 'meal' : type));
  const [name, setName] = useState(initialItem?.title || '');
  const [time, setTime] = useState(initialItem?.time || '');
  const [endTime, setEndTime] = useState(initialItem?.endTime || '');
  const [details, setDetails] = useState(initialItem?.details || '');
  const [hasReminder, setHasReminder] = useState(initialItem?.hasReminder || false);

  useEffect(() => {
    if (!initialItem && !time) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setTime(`${hours}:${minutes}`);
        
        // Default end time to 1 hour later
        const end = new Date(now.getTime() + 60 * 60 * 1000);
        const endHours = String(end.getHours()).padStart(2, '0');
        const endMinutes = String(end.getMinutes()).padStart(2, '0');
        setEndTime(`${endHours}:${endMinutes}`);
    }
  }, [initialItem, time]);

  useEffect(() => {
    if (!initialItem && activeTab === 'sleep' && !name) {
        setName('Nap');
    }
  }, [activeTab, initialItem, name]);

  const handleSave = () => {
    if (!name || !time) return;
    const newItem: PlanItem = {
      id: initialItem?.id || Date.now().toString(),
      type: activeTab,
      title: name,
      time: time,
      endTime: activeTab === 'sleep' ? endTime : undefined,
      details: details,
      isCompleted: initialItem?.isCompleted || false,
      date: initialItem?.date || selectedDate,
      hasReminder: hasReminder
    };
    onSave(newItem);
  };

  const getTabStyle = (tab: ActivityType) => {
      const base = "flex-1 py-3 text-sm font-extrabold flex items-center justify-center gap-2 rounded-xl transition-all border-2 border-b-4 active:border-b-2 active:translate-y-1";
      if (activeTab === tab) {
          switch(tab) {
              case 'meal': return `${base} bg-duoGreen text-white border-duoGreenDark`;
              case 'medicine': return `${base} bg-duoPurple text-white border-duoPurpleDark`;
              case 'sleep': return `${base} bg-duoBlue text-white border-duoBlueDark`;
              default: return base;
          }
      }
      return `${base} bg-white text-gray-400 border-gray-200 hover:bg-gray-50`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-fade-in-up border-2 border-gray-200">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-extrabold text-gray-700">{initialItem ? 'Edit Activity' : 'Add New'}</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-transparent hover:border-gray-300 transition-colors">
            <X size={24} className="text-gray-500" strokeWidth={3} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 mb-6 ${initialItem ? 'opacity-50 pointer-events-none' : ''}`}>
            <button onClick={() => setActiveTab('meal')} className={getTabStyle('meal')}>
                <Utensils size={18} strokeWidth={2.5} /> Meal
            </button>
            <button onClick={() => setActiveTab('medicine')} className={getTabStyle('medicine')}>
                <Pill size={18} strokeWidth={2.5} /> Meds
            </button>
            <button onClick={() => setActiveTab('sleep')} className={getTabStyle('sleep')}>
                <Moon size={18} strokeWidth={2.5} /> Sleep
            </button>
        </div>

        <div className="space-y-4">
           {/* Inputs */}
           <div className="space-y-1">
             <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">
                 {activeTab === 'sleep' ? 'Sleep Type' : 'Name'}
             </label>
             <div className="relative">
                <input 
                  type="text" 
                  autoFocus={!initialItem}
                  placeholder="e.g. Activity Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 px-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors"
                />
             </div>
           </div>

           <div className="flex gap-4">
                <div className="space-y-1 flex-1">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">
                        {activeTab === 'sleep' ? 'Sleep Time' : 'Time'}
                    </label>
                    <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 px-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors"
                    />
                </div>
                
                {activeTab === 'sleep' ? (
                     <div className="space-y-1 flex-1">
                        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">
                            Wake Up Time
                        </label>
                        <input 
                            type="time" 
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 px-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors"
                        />
                    </div>
                ) : (
                    <div className="space-y-1 flex-[2]">
                        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">
                            Details
                        </label>
                        <input 
                            type="text" 
                            placeholder="Optional info"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 px-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors"
                        />
                    </div>
                )}
           </div>
           
           {/* Reminder Toggle */}
           <button 
             onClick={() => setHasReminder(!hasReminder)}
             className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 border-b-4 transition-all active:border-b-2 active:translate-y-1 ${hasReminder ? 'border-duoBlueDark bg-duoBlue text-white' : 'border-gray-200 bg-white text-gray-500'}`}
           >
                <div className="flex items-center gap-2 font-extrabold">
                    <Bell size={20} fill={hasReminder ? "currentColor" : "none"} strokeWidth={2.5} />
                    <span>REMINDER</span>
                </div>
                <div className="font-extrabold text-xs bg-black/10 px-2 py-1 rounded-lg">
                    {hasReminder ? 'ON' : 'OFF'}
                </div>
           </button>

           <button 
             onClick={handleSave}
             disabled={!name || !time}
             className={`w-full mt-2 text-white font-extrabold text-lg uppercase tracking-wide py-4 rounded-2xl shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all
                ${activeTab === 'meal' ? 'bg-duoGreen border-duoGreenDark hover:bg-green-500' : 
                  activeTab === 'medicine' ? 'bg-duoPurple border-duoPurpleDark hover:bg-purple-400' :
                  'bg-duoBlue border-duoBlueDark hover:bg-blue-400'}
             `}
           >
             {initialItem ? 'SAVE CHANGES' : 'ADD ITEM'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default AddActivityModal;