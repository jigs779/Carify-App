
import React, { useState } from 'react';
import { GrowthRecord } from '../types';
import { X, Ruler, Weight, Calendar } from 'lucide-react';

interface Props {
  type: 'weight' | 'height';
  onClose: () => void;
  onSave: (record: Omit<GrowthRecord, 'id'>) => void;
}

const AddGrowthModal: React.FC<Props> = ({ type, onClose, onSave }) => {
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (!value || !date) return;
    onSave({
      type,
      value,
      date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-fade-in-up relative border-2 border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-transparent transition-colors">
            <X size={20} className="text-gray-500" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-6">
            <div className={`p-4 rounded-2xl mb-4 ${type === 'weight' ? 'bg-pink-100 text-pink-500' : 'bg-yellow-100 text-yellow-600'}`}>
                {type === 'weight' ? <Weight size={40} strokeWidth={2.5} /> : <Ruler size={40} strokeWidth={2.5} />}
            </div>
            <h3 className="text-2xl font-extrabold text-gray-700 capitalize">Track {type}</h3>
        </div>

        <div className="space-y-4">
           <div>
               <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">
                   {type === 'weight' ? 'Weight (kg)' : 'Height (cm)'}
               </label>
               <input 
                 type="number" 
                 autoFocus
                 placeholder="0.0"
                 value={value}
                 onChange={(e) => setValue(e.target.value)}
                 className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 px-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors text-lg"
               />
           </div>

           <div>
               <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">
                   Date
               </label>
               <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                   <input 
                     type="date" 
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors"
                   />
               </div>
           </div>

           <button 
             onClick={handleSave}
             disabled={!value}
             className={`w-full mt-2 text-white font-extrabold text-lg uppercase tracking-wide py-3 rounded-2xl shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all
                ${type === 'weight' ? 'bg-duoRed border-duoRedDark' : 'bg-duoYellow border-duoYellowDark'}
             `}
           >
             SAVE LOG
           </button>
        </div>
      </div>
    </div>
  );
};

export default AddGrowthModal;
