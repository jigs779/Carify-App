
import React from 'react';
import { PlanItem } from '../types';
import { X, Trash2, Edit3, Bell } from 'lucide-react';

interface Props {
  item: PlanItem;
  onClose: () => void;
  onEdit: (item: PlanItem) => void;
  onDelete: (id: string) => void;
  onToggleReminder: (id: string) => void;
}

const ItemDetailModal: React.FC<Props> = ({ item, onClose, onEdit, onDelete, onToggleReminder }) => {
  
  const isFuture = () => {
    const now = new Date();
    const [hours, minutes] = item.time.split(':').map(Number);
    const [y, m, d] = item.date.split('-').map(Number);
    
    // Create local date object
    const itemDate = new Date(y, m - 1, d, hours, minutes);
    
    return itemDate > now;
  };

  const getThemeColor = () => {
      if (item.type === 'meal') return 'text-duoGreen';
      if (item.type === 'medicine') return 'text-duoPurple';
      return 'text-duoBlue';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in-up relative border-2 border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-xl hover:bg-gray-200 border-2 border-transparent transition-colors">
            <X size={20} className="text-gray-500" strokeWidth={3} />
        </button>

        <div className="mb-8 mt-2">
            <div className={`inline-block px-3 py-1 rounded-lg text-xs font-extrabold mb-3 uppercase tracking-wide bg-gray-100 ${getThemeColor()}`}>
                {item.type}
            </div>
            <h3 className="text-3xl font-extrabold text-gray-700 mb-1 leading-tight">{item.title}</h3>
            <div className="text-gray-400 font-bold text-xl flex items-center gap-2">
                {item.time} {item.endTime ? `- ${item.endTime}` : ''}
            </div>
            {item.details && (
                <div className="mt-6 text-gray-600 font-bold bg-gray-100 p-4 rounded-2xl border-2 border-gray-200">
                    {item.details}
                </div>
            )}
        </div>

        <div className="space-y-3">
            {isFuture() && (
                <button 
                    onClick={() => onToggleReminder(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 border-b-4 transition-all active:border-b-2 active:translate-y-1
                    ${item.hasReminder ? 'border-duoBlueDark bg-duoBlue text-white' : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'}`}
                >
                    <span className="font-extrabold flex items-center gap-2">
                        <Bell size={20} fill={item.hasReminder ? "currentColor" : "none"} strokeWidth={2.5} />
                        {item.hasReminder ? 'REMINDER SET' : 'SET REMINDER'}
                    </span>
                </button>
            )}

            <div className="flex gap-3 pt-2">
                <button 
                    onClick={() => onEdit(item)}
                    className="flex-1 bg-white border-2 border-gray-200 border-b-4 hover:bg-gray-50 text-gray-700 font-extrabold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:border-b-2 active:translate-y-1"
                >
                    <Edit3 size={20} strokeWidth={2.5} /> EDIT
                </button>
                <button 
                    onClick={() => {
                        if(window.confirm("Are you sure you want to delete this?")) {
                            onDelete(item.id);
                        }
                    }}
                    className="flex-1 bg-white border-2 border-duoRedDark border-b-4 hover:bg-red-50 text-duoRed font-extrabold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:border-b-2 active:translate-y-1"
                >
                    <Trash2 size={20} strokeWidth={2.5} /> DELETE
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;