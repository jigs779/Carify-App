
import React, { useState } from 'react';
import { HospitalVisit } from '../types';
import { X, Building2, Calendar, FileText, Stethoscope } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSave: (visit: Omit<HospitalVisit, 'id'>) => void;
}

const AddHospitalVisitModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [hospitalName, setHospitalName] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!hospitalName || !date || !reason) return;
    onSave({
      hospitalName,
      date,
      reason,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in-up relative border-2 border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-transparent transition-colors">
            <X size={20} className="text-gray-500" strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center mb-6">
            <div className="p-4 rounded-2xl mb-4 bg-red-50 text-duoRed">
                <Stethoscope size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-700">Log Visit</h3>
        </div>

        <div className="space-y-4">
           <div>
               <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">Hospital / Clinic</label>
               <div className="relative">
                   <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                   <input 
                     type="text" 
                     autoFocus
                     placeholder="e.g. City Children's Hospital"
                     value={hospitalName}
                     onChange={(e) => setHospitalName(e.target.value)}
                     className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors"
                   />
               </div>
           </div>

           <div>
               <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">Date</label>
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

           <div>
               <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">Reason for Visit</label>
               <input 
                 type="text" 
                 placeholder="e.g. Vaccination, Fever"
                 value={reason}
                 onChange={(e) => setReason(e.target.value)}
                 className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 px-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors"
               />
           </div>

           <div>
               <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wide ml-1">Notes (Optional)</label>
               <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea 
                        rows={3}
                        placeholder="Doctor's advice, medication..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors resize-none"
                    />
               </div>
           </div>

           <button 
             onClick={handleSave}
             disabled={!hospitalName || !reason}
             className="w-full mt-2 bg-duoRed text-white font-extrabold text-lg uppercase tracking-wide py-3 rounded-2xl shadow-sm border-b-4 border-duoRedDark active:border-b-0 active:translate-y-1 transition-all"
           >
             SAVE RECORD
           </button>
        </div>
      </div>
    </div>
  );
};

export default AddHospitalVisitModal;
