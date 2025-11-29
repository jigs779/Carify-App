
import React, { useState } from 'react';
import { BabyProfile, GrowthRecord, HospitalVisit } from '../types';
import { User, Calendar, Weight, Ruler, Save, Edit2, Camera, Activity, Plus, Stethoscope, Building2 } from 'lucide-react';
import AddGrowthModal from './AddGrowthModal';
import AddHospitalVisitModal from './AddHospitalVisitModal';

interface Props {
  profile: BabyProfile;
  onUpdate: (profile: BabyProfile) => void;
  growthRecords?: GrowthRecord[];
  setGrowthRecords?: React.Dispatch<React.SetStateAction<GrowthRecord[]>>;
  hospitalVisits?: HospitalVisit[];
  setHospitalVisits?: React.Dispatch<React.SetStateAction<HospitalVisit[]>>;
}

const ProfileTab: React.FC<Props> = ({ 
  profile, 
  onUpdate, 
  growthRecords = [], 
  setGrowthRecords, 
  hospitalVisits = [], 
  setHospitalVisits 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<BabyProfile>(profile);
  const [showGrowthModal, setShowGrowthModal] = useState<'weight' | 'height' | null>(null);
  const [showHospitalModal, setShowHospitalModal] = useState(false);

  const handleSave = () => {
    onUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof BabyProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({ ...prev, avatar: reader.result as string }));
        if (!isEditing) {
            onUpdate({ ...profile, avatar: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGrowth = (record: Omit<GrowthRecord, 'id'>) => {
      if (setGrowthRecords) {
          const newRecord = { ...record, id: Date.now().toString() };
          const updatedRecords = [newRecord, ...growthRecords].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setGrowthRecords(updatedRecords);
          
          // Update current profile stats if newer
          if (newRecord.type === 'weight') onUpdate({...profile, weight: newRecord.value});
          if (newRecord.type === 'height') onUpdate({...profile, height: newRecord.value});
      }
  };

  const handleAddHospitalVisit = (visit: Omit<HospitalVisit, 'id'>) => {
    if (setHospitalVisits) {
      const newVisit = { ...visit, id: Date.now().toString() };
      const updatedVisits = [newVisit, ...hospitalVisits].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHospitalVisits(updatedVisits);
    }
  };

  return (
    <div className="flex-1 p-6 animate-fade-in overflow-y-auto pb-32">
      <div className="flex justify-between items-center mb-8">
           <h3 className="text-2xl font-extrabold text-gray-700 uppercase tracking-wide">Profile</h3>
           <button 
             onClick={() => isEditing ? handleSave() : setIsEditing(true)}
             className={`p-3 rounded-2xl border-2 border-b-4 transition-all active:border-b-2 active:translate-y-1 ${isEditing ? 'bg-duoGreen border-duoGreenDark text-white' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
           >
               {isEditing ? <Save size={20} strokeWidth={3} /> : <Edit2 size={20} strokeWidth={3} />}
           </button>
      </div>

      <div className="flex flex-col items-center mb-8">
          <div className="relative group">
              <div className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-sm mb-4 overflow-hidden bg-white border-4 border-gray-200">
                  {editedProfile.avatar ? (
                      <img src={editedProfile.avatar} alt="Baby" className="w-full h-full object-cover" />
                  ) : (
                      <span className="text-gray-300 text-6xl font-extrabold">{editedProfile.name.charAt(0)}</span>
                  )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-duoBlue text-white rounded-2xl border-2 border-white shadow-md cursor-pointer hover:bg-blue-400 transition-colors">
                  <Camera size={20} strokeWidth={2.5} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
          </div>
          
          {isEditing ? (
             <div className="flex flex-col gap-3 items-center w-full max-w-[240px]">
                 <div className="w-full">
                     <label className="text-xs font-extrabold text-gray-400 uppercase ml-1 block mb-1">Baby Name</label>
                     <input 
                        type="text" 
                        value={editedProfile.name}
                        onChange={e => handleChange('name', e.target.value)}
                        className="text-lg font-bold text-center border-2 border-gray-200 rounded-xl px-2 py-2 outline-none focus:border-duoBlue w-full bg-white"
                     />
                 </div>
                 <div className="w-full">
                     <label className="text-xs font-extrabold text-gray-400 uppercase ml-1 block mb-1">Parent Name</label>
                     <input 
                        type="text" 
                        value={editedProfile.parentName}
                        onChange={e => handleChange('parentName', e.target.value)}
                        className="text-lg font-bold text-center border-2 border-gray-200 rounded-xl px-2 py-2 outline-none focus:border-duoBlue w-full text-gray-600 bg-white"
                     />
                 </div>
             </div>
          ) : (
             <div className="text-center">
                 <h2 className="text-3xl font-extrabold text-gray-700">{profile.name}</h2>
                 <p className="text-gray-400 font-bold">{profile.parentName} ({profile.parentType})</p>
             </div>
          )}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-200 border-b-4 space-y-6 mb-6">
          
          {/* Birth Date */}
          <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-duoBlue rounded-xl">
                  <Calendar size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                  <p className="text-xs text-gray-400 font-extrabold uppercase">Date of Birth</p>
                  {isEditing ? (
                      <input 
                        type="date" 
                        value={editedProfile.birthDate}
                        onChange={e => handleChange('birthDate', e.target.value)}
                        className="w-full mt-1 border-2 border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-duoBlue font-bold text-gray-700"
                      />
                  ) : (
                      <p className="font-extrabold text-gray-700 text-lg">{profile.birthDate}</p>
                  )}
              </div>
          </div>

          <div className="h-0.5 bg-gray-100"></div>

          {/* Current Weight/Height Display (Updates via Log or Edit) */}
          <div className="flex gap-4">
               {/* Weight */}
               <div className="flex-1 flex items-center gap-2">
                  <div className="p-3 bg-pink-50 text-pink-500 rounded-xl">
                      <Weight size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase">Weight</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-extrabold text-gray-700 text-lg">{profile.weight}</span>
                        <span className="text-gray-400 font-bold text-xs">kg</span>
                      </div>
                  </div>
               </div>

               {/* Height */}
               <div className="flex-1 flex items-center gap-2">
                  <div className="p-3 bg-yellow-50 text-duoYellowDark rounded-xl">
                      <Ruler size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase">Height</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-extrabold text-gray-700 text-lg">{profile.height}</span>
                        <span className="text-gray-400 font-bold text-xs">cm</span>
                      </div>
                  </div>
               </div>
          </div>

           <div className="h-0.5 bg-gray-100"></div>

           {/* Parent Type */}
           <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-duoPurple rounded-xl">
                  <User size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                  <p className="text-xs text-gray-400 font-extrabold uppercase">Primary Parent</p>
                  {isEditing ? (
                       <div className="flex gap-2 mt-2">
                           <button 
                             onClick={() => setEditedProfile({...editedProfile, parentType: 'Mother'})}
                             className={`px-3 py-1.5 rounded-xl text-sm font-extrabold border-2 border-b-4 active:border-b-2 active:translate-y-1 transition-all ${editedProfile.parentType === 'Mother' ? 'bg-duoRed text-white border-duoRedDark' : 'bg-white border-gray-200 text-gray-400'}`}
                           >
                               Mother
                           </button>
                           <button 
                             onClick={() => setEditedProfile({...editedProfile, parentType: 'Father'})}
                             className={`px-3 py-1.5 rounded-xl text-sm font-extrabold border-2 border-b-4 active:border-b-2 active:translate-y-1 transition-all ${editedProfile.parentType === 'Father' ? 'bg-duoBlue text-white border-duoBlueDark' : 'bg-white border-gray-200 text-gray-400'}`}
                           >
                               Father
                           </button>
                       </div>
                  ) : (
                      <p className="font-extrabold text-gray-700 text-lg">{profile.parentType}</p>
                  )}
              </div>
          </div>
      </div>

      {/* Growth Tracker Section */}
      <div className="mb-8">
          <h4 className="text-lg font-extrabold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Activity size={20} className="text-duoGreen" /> Growth Tracker
          </h4>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => setShowGrowthModal('weight')}
                className="bg-white border-2 border-gray-200 border-b-4 p-4 rounded-2xl flex flex-col items-center hover:bg-gray-50 active:border-b-2 active:translate-y-1 transition-all"
              >
                  <Plus className="text-duoRed mb-2 bg-red-100 rounded-full p-1" size={28} strokeWidth={3} />
                  <span className="font-extrabold text-gray-600">Log Weight</span>
              </button>
              <button 
                onClick={() => setShowGrowthModal('height')}
                className="bg-white border-2 border-gray-200 border-b-4 p-4 rounded-2xl flex flex-col items-center hover:bg-gray-50 active:border-b-2 active:translate-y-1 transition-all"
              >
                  <Plus className="text-duoYellowDark mb-2 bg-yellow-100 rounded-full p-1" size={28} strokeWidth={3} />
                  <span className="font-extrabold text-gray-600">Log Height</span>
              </button>
          </div>

          {/* Growth History List */}
          {growthRecords.length > 0 && (
              <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b-2 border-gray-200 font-extrabold text-xs text-gray-400 uppercase">Recent Logs</div>
                  {growthRecords.slice(0, 5).map(record => (
                      <div key={record.id} className="p-4 border-b border-gray-100 flex items-center justify-between last:border-0">
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${record.type === 'weight' ? 'bg-pink-50 text-pink-500' : 'bg-yellow-50 text-yellow-600'}`}>
                                  {record.type === 'weight' ? <Weight size={16} /> : <Ruler size={16} />}
                              </div>
                              <div className="flex flex-col">
                                  <span className="font-bold text-gray-700 capitalize">{record.type}</span>
                                  <span className="text-xs font-bold text-gray-400">{record.date}</span>
                              </div>
                          </div>
                          <span className="font-extrabold text-lg text-gray-700">
                              {record.value} <span className="text-sm text-gray-400">{record.type === 'weight' ? 'kg' : 'cm'}</span>
                          </span>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Hospital Visits Section */}
      <div className="mb-6">
        <h4 className="text-lg font-extrabold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Stethoscope size={20} className="text-duoRed" /> Health Log
        </h4>

        <button 
          onClick={() => setShowHospitalModal(true)}
          className="w-full bg-white border-2 border-gray-200 border-b-4 p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 active:border-b-2 active:translate-y-1 transition-all mb-4"
        >
            <Plus className="text-duoBlue mb-0 bg-blue-100 rounded-full p-1" size={24} strokeWidth={3} />
            <span className="font-extrabold text-gray-600">Log Hospital Visit</span>
        </button>

        {hospitalVisits.length > 0 && (
          <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden">
             <div className="bg-gray-50 px-4 py-2 border-b-2 border-gray-200 font-extrabold text-xs text-gray-400 uppercase">Recent Visits</div>
             {hospitalVisits.map(visit => (
                <div key={visit.id} className="p-4 border-b border-gray-100 last:border-0">
                   <div className="flex justify-between items-start mb-1">
                      <div className="font-extrabold text-gray-700 flex items-center gap-2">
                         <Building2 size={16} className="text-gray-400" />
                         {visit.hospitalName}
                      </div>
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{visit.date}</span>
                   </div>
                   <div className="pl-6">
                      <p className="text-sm font-bold text-gray-600 mb-1">{visit.reason}</p>
                      {visit.notes && <p className="text-xs text-gray-400 italic">"{visit.notes}"</p>}
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>

      {isEditing && (
          <button 
            onClick={handleSave}
            className="w-full mt-2 bg-duoBlue text-white font-extrabold text-lg uppercase tracking-wide py-4 rounded-2xl shadow-sm border-b-4 border-duoBlueDark active:border-b-0 active:translate-y-1 transition-all"
          >
              Save Changes
          </button>
      )}

      {showGrowthModal && (
          <AddGrowthModal 
            type={showGrowthModal}
            onClose={() => setShowGrowthModal(null)}
            onSave={handleAddGrowth}
          />
      )}

      {showHospitalModal && (
        <AddHospitalVisitModal 
          onClose={() => setShowHospitalModal(false)}
          onSave={handleAddHospitalVisit}
        />
      )}
    </div>
  );
};

export default ProfileTab;
