
import React, { useState, useMemo } from 'react';
import { BabyProfile, PlanItem, ActivityType, GrowthRecord, ShoppingItem, HospitalVisit } from '../types';
import { ChevronLeft, ChevronRight, Plus, Home, Calendar as CalendarIcon, PieChart, User, Utensils, Pill, Check, Moon, Edit3, Coffee, Activity, ArrowUp, Zap, CalendarDays, Bell, ShoppingBag } from 'lucide-react';
import AddActivityModal from './AddActivityModal';
import ItemDetailModal from './ItemDetailModal';
import CalendarTab from './CalendarTab';
import ProfileTab from './ProfileTab';
import ShoppingListTab from './ShoppingListTab';

interface Props {
  profile: BabyProfile;
  initialItems: PlanItem[];
  setItems: React.Dispatch<React.SetStateAction<PlanItem[]>>;
  growthRecords: GrowthRecord[];
  setGrowthRecords: React.Dispatch<React.SetStateAction<GrowthRecord[]>>;
  shoppingItems: ShoppingItem[];
  setShoppingItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  hospitalVisits: HospitalVisit[];
  setHospitalVisits: React.Dispatch<React.SetStateAction<HospitalVisit[]>>;
  onUpdateProfile?: (p: BabyProfile) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Dashboard: React.FC<Props> = ({ 
  profile, 
  initialItems, 
  setItems, 
  growthRecords, 
  setGrowthRecords, 
  shoppingItems, 
  setShoppingItems,
  hospitalVisits,
  setHospitalVisits,
  onUpdateProfile 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const sunday = new Date(d);
    sunday.setDate(d.getDate() - day);
    return sunday;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<ActivityType>('meal');
  const [editingItem, setEditingItem] = useState<PlanItem | undefined>(undefined);
  
  const [selectedDetailItem, setSelectedDetailItem] = useState<PlanItem | null>(null);

  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'stats' | 'profile' | 'shopping'>('home');
  const [isEditingPast, setIsEditingPast] = useState(false);
  
  const [localProfile, setLocalProfile] = useState(profile);

  const generateWeekDates = (start: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d);
    }
    return dates;
  };

  const weekDates = useMemo(() => generateWeekDates(weekStart), [weekStart]);

  const changeWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() + (direction === 'next' ? 7 : -7));
    setWeekStart(newStart);
  };

  // Fixed Date Formatter (Local Time) to prevent timezone issues
  const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const selectedDateKey = formatDateKey(selectedDate);
  const todayKey = formatDateKey(new Date());
  const isPastDate = selectedDateKey < todayKey;
  const isToday = selectedDateKey === todayKey;

  const jumpToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    
    // Update week start for Home
    const day = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - day);
    setWeekStart(sunday);
    
    setActiveTab('home');
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(items => items.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const toggleReminder = (id: string) => {
    setItems(items => items.map(item => 
        item.id === id ? { ...item, hasReminder: !item.hasReminder } : item
    ));
  };

  const handleSaveItem = (item: PlanItem) => {
    setItems(prev => {
        const exists = prev.find(i => i.id === item.id);
        if (exists) {
            return prev.map(i => i.id === item.id ? item : i);
        }
        return [...prev, item];
    });
    setIsModalOpen(false);
    setEditingItem(undefined);
    setSelectedDetailItem(null);
  };

  const handleDeleteItem = (id: string) => {
      setItems(prev => prev.filter(i => i.id !== id));
      setSelectedDetailItem(null);
  };

  const openAddModal = (type: ActivityType = 'meal') => {
    setModalInitialTab(type);
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PlanItem) => {
      setEditingItem(item);
      setIsModalOpen(true);
      setSelectedDetailItem(null);
  };

  const handleCalendarDateClick = (date: string) => {
      const [y,m,d] = date.split('-').map(Number);
      const newDate = new Date(y, m-1, d);
      setSelectedDate(newDate);
      
      const day = newDate.getDay();
      const sunday = new Date(newDate);
      sunday.setDate(newDate.getDate() - day);
      setWeekStart(sunday);

      setActiveTab('home');
  };

  const handleProfileUpdate = (updatedProfile: BabyProfile) => {
      setLocalProfile(updatedProfile);
      if (onUpdateProfile) onUpdateProfile(updatedProfile);
  };

  // Filter items for the selected date
  const dayItems = initialItems.filter(i => i.date === selectedDateKey);
  const meals = dayItems.filter(i => i.type === 'meal').sort((a,b) => a.time.localeCompare(b.time));
  const meds = dayItems.filter(i => i.type === 'medicine').sort((a,b) => a.time.localeCompare(b.time));
  const sleeps = dayItems.filter(i => i.type === 'sleep').sort((a,b) => a.time.localeCompare(b.time));

  useMemo(() => {
      setIsEditingPast(false);
  }, [selectedDateKey]);

  // Stats Logic - Daily
  const stats = useMemo(() => {
      const totalMeals = meals.length;
      const completedMeals = meals.filter(i => i.isCompleted).length;
      
      const totalMeds = meds.length;
      const completedMeds = meds.filter(i => i.isCompleted).length;
      
      const totalSleeps = sleeps.length;
      
      // Calculate sleep duration
      let totalSleepMinutes = 0;
      sleeps.forEach(s => {
          if(s.time && s.endTime) {
            const [sh, sm] = s.time.split(':').map(Number);
            const [eh, em] = s.endTime.split(':').map(Number);
            let start = sh * 60 + sm;
            let end = eh * 60 + em;
            if (end < start) end += 24 * 60; // Overnight sleep handling
            totalSleepMinutes += (end - start);
          }
      });
      const sleepHours = Math.floor(totalSleepMinutes / 60);
      const sleepMins = totalSleepMinutes % 60;
      
      return { totalMeals, completedMeals, totalMeds, completedMeds, totalSleeps, sleepHours, sleepMins };
  }, [meals, meds, sleeps]);

  const renderEmptySection = (message: string) => (
      <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <p className="text-sm text-gray-400 font-bold">{message}</p>
      </div>
  );

  const renderItemRow = (item: PlanItem, color: 'green' | 'blue' | 'purple') => {
      let bgClass = '';
      let borderClass = '';
      let iconColor = '';

      if (color === 'green') { // Meals
          bgClass = item.isCompleted ? 'bg-duoGreen' : 'bg-white';
          borderClass = item.isCompleted ? 'border-duoGreenDark' : 'border-gray-200';
          iconColor = 'text-duoGreen';
      } else if (color === 'blue') { // Sleep
          bgClass = item.isCompleted ? 'bg-duoBlue' : 'bg-white';
          borderClass = item.isCompleted ? 'border-duoBlueDark' : 'border-gray-200';
          iconColor = 'text-duoBlue';
      } else { // Meds (Purple)
          bgClass = item.isCompleted ? 'bg-duoPurple' : 'bg-white';
          borderClass = item.isCompleted ? 'border-duoPurpleDark' : 'border-gray-200';
          iconColor = 'text-duoPurple';
      }

      const isFutureItem = () => {
        const now = new Date();
        const [y, m, d] = item.date.split('-').map(Number);
        const [h, min] = item.time.split(':').map(Number);
        const itemDate = new Date(y, m - 1, d, h, min);
        return itemDate > now;
      };

      const future = isFutureItem();

      return (
       <div 
         key={item.id} 
         onClick={() => setSelectedDetailItem(item)}
         className={`flex flex-col p-4 rounded-2xl cursor-pointer transition-all border-2 border-b-4 mb-3 active:border-b-2 active:translate-y-1 ${bgClass} ${borderClass}`}
        >
           <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                   <div className="flex flex-col items-start w-20">
                       <div className={`text-xs font-extrabold ${item.isCompleted ? 'text-white/80' : 'text-gray-400'}`}>
                           {item.time}
                       </div>
                       {item.endTime && (
                           <div className={`text-xs font-extrabold ${item.isCompleted ? 'text-white/60' : 'text-gray-300'}`}>
                               - {item.endTime}
                           </div>
                       )}
                   </div>
                   <div className="flex flex-col">
                       <div className="flex items-center gap-2">
                           <span className={`text-lg font-bold ${item.isCompleted ? 'text-white' : 'text-gray-700'}`}>
                               {item.title}
                           </span>
                           {item.hasReminder && (
                               <Bell size={16} className={`${item.isCompleted ? 'text-white' : iconColor}`} fill="currentColor" />
                           )}
                       </div>
                       {item.details && <span className={`text-xs font-bold truncate max-w-[150px] ${item.isCompleted ? 'text-white/80' : 'text-gray-400'}`}>{item.details}</span>}
                       
                       {/* Inline Set Reminder Button for Future Items */}
                       {future && !item.hasReminder && !item.isCompleted && (
                           <button 
                             onClick={(e) => {
                                 e.stopPropagation();
                                 toggleReminder(item.id);
                             }}
                             className={`mt-2 text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 w-fit transition-colors border-b-2 active:border-b-0 active:translate-y-[1px]
                                ${color === 'green' ? 'bg-green-50 text-duoGreen border-green-200 hover:bg-green-100' : 
                                  color === 'blue' ? 'bg-blue-50 text-duoBlue border-blue-200 hover:bg-blue-100' :
                                  'bg-purple-50 text-duoPurple border-purple-200 hover:bg-purple-100'
                                }
                             `}
                           >
                               <Bell size={12} /> Set Reminder
                           </button>
                       )}
                   </div>
               </div>
               
               <button 
                 onClick={(e) => toggleComplete(item.id, e)} 
                 className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors shrink-0 ${item.isCompleted ? 'bg-white/20 border-white/40' : 'bg-gray-100 border-gray-200'}`}
               >
                   {item.isCompleted && <Check className="text-white" strokeWidth={4} size={20} />}
               </button>
           </div>
       </div>
      );
  };

  const renderStats = () => {
      const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

      return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto animate-fade-in-up pb-32">
           <h3 className="text-2xl font-extrabold text-gray-700 mb-2">Daily Summary</h3>
           <p className="text-gray-400 font-bold mb-6">{dateStr}</p>

           {/* Stats Cards */}
           <div className="space-y-4">
               
               {/* Meals Card */}
               <div className="bg-white p-5 rounded-3xl border-2 border-gray-200 border-b-4">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-duoGreen text-white rounded-xl">
                           <Utensils size={24} strokeWidth={2.5} />
                       </div>
                       <div>
                           <div className="font-extrabold text-gray-700 text-lg">Meals</div>
                           <div className="text-xs font-bold text-gray-400 uppercase">Daily Goal</div>
                       </div>
                       <div className="ml-auto text-2xl font-extrabold text-duoGreen">
                           {stats.completedMeals}<span className="text-gray-300 text-lg">/{Math.max(stats.totalMeals, 1)}</span>
                       </div>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                       <div 
                        className="bg-duoGreen h-full rounded-full transition-all duration-500" 
                        style={{ width: `${stats.totalMeals > 0 ? (stats.completedMeals / stats.totalMeals) * 100 : 0}%` }}
                       ></div>
                   </div>
               </div>

               {/* Meds Card */}
               <div className="bg-white p-5 rounded-3xl border-2 border-gray-200 border-b-4">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-duoPurple text-white rounded-xl">
                           <Pill size={24} strokeWidth={2.5} />
                       </div>
                       <div>
                           <div className="font-extrabold text-gray-700 text-lg">Medicine</div>
                           <div className="text-xs font-bold text-gray-400 uppercase">Daily Adherence</div>
                       </div>
                       <div className="ml-auto text-2xl font-extrabold text-duoPurple">
                           {stats.completedMeds}<span className="text-gray-300 text-lg">/{Math.max(stats.totalMeds, 1)}</span>
                       </div>
                   </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                       <div 
                        className="bg-duoPurple h-full rounded-full transition-all duration-500" 
                        style={{ width: `${stats.totalMeds > 0 ? (stats.completedMeds / stats.totalMeds) * 100 : 0}%` }}
                       ></div>
                   </div>
               </div>

               {/* Sleep Card */}
               <div className="bg-white p-5 rounded-3xl border-2 border-gray-200 border-b-4">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-duoBlue text-white rounded-xl">
                           <Moon size={24} strokeWidth={2.5} />
                       </div>
                       <div>
                           <div className="font-extrabold text-gray-700 text-lg">Sleep</div>
                           <div className="text-xs font-bold text-gray-400 uppercase">Total Duration</div>
                       </div>
                       <div className="ml-auto text-right">
                           <div className="text-2xl font-extrabold text-duoBlue">
                               {stats.sleepHours}h {stats.sleepMins}m
                           </div>
                           <div className="text-xs font-bold text-gray-400">{stats.totalSleeps} sessions</div>
                       </div>
                   </div>
                   <div className="text-sm font-bold text-gray-400">
                       {stats.totalSleeps > 0 ? "Tracking sleep effectively!" : "No sleep data logged today."}
                   </div>
               </div>
           </div>
      </div>
  )};

  const renderHome = () => {
    if (isPastDate && dayItems.length === 0 && !isEditingPast) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in pb-32">
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-4 border-gray-200">
                    <CalendarIcon size={64} className="text-gray-300" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-700 mb-2">Day Skipped</h3>
                <p className="text-gray-400 font-bold mb-8">You didn't track anything for this day.</p>
                <button 
                    onClick={() => setIsEditingPast(true)}
                    className="flex items-center gap-2 bg-duoBlue text-white px-8 py-4 rounded-2xl font-extrabold border-b-4 border-duoBlueDark active:border-b-0 active:translate-y-1 transition-all"
                >
                    <Edit3 size={20} strokeWidth={3} /> EDIT HISTORY
                </button>
            </div>
        );
    }

    return (
      <div className="flex-1 p-5 space-y-6 overflow-y-auto animate-fade-in pb-32">
        <div className="flex justify-between items-center">
             <h3 className="text-xl font-extrabold text-gray-700 uppercase tracking-wider">
                Plan {localProfile.name}'s day
            </h3>
            {(isToday || isPastDate || !isPastDate) && (
                <button 
                    onClick={() => openAddModal('meal')}
                    className="w-12 h-12 bg-duoGreen rounded-xl flex items-center justify-center text-white border-b-4 border-duoGreenDark active:border-b-0 active:translate-y-1 transition-all shadow-sm"
                >
                    <Plus size={28} strokeWidth={3} />
                </button>
            )}
        </div>

        {/* Meals Section */}
        <div>
           <div className="flex justify-between items-center mb-3 px-1">
               <h4 className="font-extrabold text-duoGreen text-lg flex items-center gap-2">
                   <Utensils size={20} /> MEALS
               </h4>
           </div>
           <div className="space-y-1">
               {meals.length === 0 && renderEmptySection("No meals yet")}
               {meals.map(item => renderItemRow(item, "green"))}
           </div>
        </div>

        {/* Medicines Section */}
        <div>
           <div className="flex justify-between items-center mb-3 px-1">
               <h4 className="font-extrabold text-duoPurple text-lg flex items-center gap-2">
                   <Pill size={20} /> MEDICINE
               </h4>
           </div>
           <div className="space-y-1">
              {meds.length === 0 && renderEmptySection("No meds yet")}
              {meds.map(item => renderItemRow(item, "purple"))}
           </div>
        </div>

        {/* Sleep Section */}
        <div>
           <div className="flex justify-between items-center mb-3 px-1">
               <h4 className="font-extrabold text-duoBlue text-lg flex items-center gap-2">
                   <Moon size={20} /> SLEEP
               </h4>
           </div>
           <div className="space-y-1">
              {sleeps.length === 0 && renderEmptySection("No sleep logged")}
              {sleeps.map(item => renderItemRow(item, "blue"))}
           </div>
        </div>
      </div>
    );
  };

  const NavButton = ({ icon: Icon, label, tab, active }: any) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`flex-1 flex items-center justify-center p-2 rounded-xl transition-all active:scale-95`}
      >
        <div className={`flex flex-col items-center gap-1 ${active ? 'text-duoBlue' : 'text-gray-400'}`}>
             <Icon 
                size={24} 
                strokeWidth={2.5}
                fill={active ? "currentColor" : "none"}
             />
             <span className="text-[10px] font-extrabold uppercase">{label}</span>
        </div>
      </button>
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col max-w-md mx-auto relative overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-white px-4 pt-4 pb-2 border-b-2 border-gray-200 z-10 sticky top-0">
        <div className="flex justify-between items-center mb-4">
           
           {/* Avatar & Name */}
           <div 
             className="flex items-center gap-3 cursor-pointer p-1 rounded-xl hover:bg-gray-50 transition-colors"
             onClick={() => setActiveTab('profile')}
           >
               <div className="w-10 h-10 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50">
                   {localProfile.avatar ? (
                       <img src={localProfile.avatar} alt="Baby" className="w-full h-full object-cover" />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">{localProfile.name.charAt(0)}</div>
                   )}
               </div>
               <div>
                   <h2 className="text-lg font-extrabold text-gray-700 leading-tight">Hi, {localProfile.parentName}</h2>
               </div>
           </div>

           {/* Jump to Today Button */}
           {(!isToday || activeTab !== 'home') && (
               <button 
                onClick={jumpToToday}
                className="bg-duoBlue text-white px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-sm active:scale-95 transition-transform flex items-center gap-1 border-b-4 border-duoBlueDark active:border-b-0 active:translate-y-1"
               >
                   <CalendarDays size={14} /> JUMP TO TODAY
               </button>
           )}
           
           {isToday && activeTab === 'home' && <div className="text-duoBlue font-extrabold flex items-center gap-1"><Zap size={18} fill="currentColor" /> TODAY</div>}
        </div>

        {/* Date Selector (Shared between Home and Stats) */}
        {(activeTab === 'home' || activeTab === 'stats') && (
            <div className="flex items-center justify-between pb-2">
                <button onClick={() => changeWeek('prev')} className="text-gray-400 hover:text-duoBlue p-1"><ChevronLeft strokeWidth={3} size={20} /></button>
                <div className="flex flex-1 justify-between px-2">
                    {weekDates.map((d, i) => {
                        const isSelected = formatDateKey(d) === selectedDateKey;
                        const isTodayDate = formatDateKey(d) === todayKey;
                        
                        return (
                            <div key={i} className="flex flex-col items-center cursor-pointer group" onClick={() => setSelectedDate(d)}>
                                <span className={`text-[10px] font-extrabold uppercase mb-1 ${isSelected ? 'text-duoBlue' : 'text-gray-400'}`}>
                                    {DAYS[d.getDay()].charAt(0)}
                                </span>
                                <div className={`w-9 h-10 flex items-center justify-center rounded-xl text-sm font-extrabold transition-all border-b-4 
                                    ${isSelected 
                                        ? 'bg-duoBlue text-white border-duoBlueDark translate-y-[-2px]' 
                                        : isTodayDate 
                                            ? 'bg-blue-50 text-duoBlue border-blue-200' 
                                            : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-100'
                                    }`}>
                                    {d.getDate()}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <button onClick={() => changeWeek('next')} className="text-gray-400 hover:text-duoBlue p-1"><ChevronRight strokeWidth={3} size={20} /></button>
            </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-100">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'calendar' && <CalendarTab items={initialItems} onDateClick={handleCalendarDateClick} />}
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'shopping' && <ShoppingListTab items={shoppingItems} setItems={setShoppingItems} />}
        {activeTab === 'profile' && (
          <ProfileTab 
            profile={localProfile} 
            onUpdate={handleProfileUpdate} 
            growthRecords={growthRecords} 
            setGrowthRecords={setGrowthRecords}
            hospitalVisits={hospitalVisits}
            setHospitalVisits={setHospitalVisits}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t-2 border-gray-200 pb-6 pt-2 px-2 flex justify-between items-end z-20 h-20">
          <NavButton icon={Home} label="Home" tab="home" active={activeTab === 'home'} />
          <NavButton icon={CalendarIcon} label="Plan" tab="calendar" active={activeTab === 'calendar'} />
          <NavButton icon={ShoppingBag} label="Shop" tab="shopping" active={activeTab === 'shopping'} />
          <NavButton icon={PieChart} label="Stats" tab="stats" active={activeTab === 'stats'} />
          <NavButton icon={User} label="Profile" tab="profile" active={activeTab === 'profile'} />
      </div>

      {isModalOpen && (
          <AddActivityModal 
            type={modalInitialTab} 
            selectedDate={selectedDateKey}
            initialItem={editingItem}
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSaveItem} 
          />
      )}

      {selectedDetailItem && (
          <ItemDetailModal 
            item={selectedDetailItem}
            onClose={() => setSelectedDetailItem(null)}
            onDelete={handleDeleteItem}
            onEdit={openEditModal}
            onToggleReminder={toggleReminder}
          />
      )}

    </div>
  );
};

export default Dashboard;
