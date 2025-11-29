
import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { Plus, Check, Trash2, ShoppingBag, Shirt, Pill, Apple, Package } from 'lucide-react';

interface Props {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

const ShoppingListTab: React.FC<Props> = ({ items, setItems }) => {
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShoppingItem['category']>('food');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: selectedCategory,
      isChecked: false
    };

    setItems(prev => [newItem, ...prev]);
    setNewItemName('');
  };

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'food': return <Apple size={18} />;
      case 'medicine': return <Pill size={18} />;
      case 'clothes': return <Shirt size={18} />;
      default: return <Package size={18} />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'food': return 'bg-orange-100 text-orange-500';
      case 'medicine': return 'bg-purple-100 text-purple-500';
      case 'clothes': return 'bg-blue-100 text-blue-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="flex-1 p-5 animate-fade-in overflow-y-auto pb-32">
       <h3 className="text-2xl font-extrabold text-gray-700 mb-6 uppercase tracking-wide flex items-center gap-2">
         <ShoppingBag className="text-duoYellowDark" size={28} /> Shopping List
       </h3>

       {/* Add Item Form */}
       <div className="bg-white p-4 rounded-3xl border-2 border-gray-200 border-b-4 mb-6">
         <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Add item (e.g. Diapers)" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl py-3 px-4 text-gray-700 font-bold focus:border-duoBlue focus:bg-white outline-none transition-colors"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {(['food', 'medicine', 'clothes', 'other'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold uppercase whitespace-nowrap border-2 border-b-4 transition-all active:border-b-2 active:translate-y-1
                    ${selectedCategory === cat 
                      ? 'bg-duoYellow text-white border-duoYellowDark' 
                      : 'bg-white text-gray-400 border-gray-200'}`}
                >
                  {getCategoryIcon(cat)} {cat}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              disabled={!newItemName}
              className="w-full bg-duoGreen text-white font-extrabold uppercase py-3 rounded-2xl border-b-4 border-duoGreenDark active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:active:border-b-4 disabled:active:translate-y-0"
            >
              Add to List
            </button>
         </form>
       </div>

       {/* List */}
       <div className="space-y-3">
         {items.length === 0 && (
           <div className="text-center py-10">
             <div className="inline-flex bg-gray-100 p-6 rounded-full mb-4">
               <ShoppingBag size={40} className="text-gray-300" />
             </div>
             <p className="text-gray-400 font-bold">Your list is empty.</p>
           </div>
         )}

         {items.map(item => (
           <div 
             key={item.id} 
             className={`flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-b-4 transition-all ${item.isChecked ? 'border-gray-200 opacity-60' : 'border-gray-200'}`}
           >
             <div className="flex items-center gap-3 overflow-hidden">
               <button 
                 onClick={() => toggleCheck(item.id)}
                 className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0
                   ${item.isChecked ? 'bg-duoGreen border-duoGreenDark text-white' : 'border-gray-300 text-transparent hover:border-duoGreen'}`}
               >
                 <Check size={16} strokeWidth={4} />
               </button>
               
               <div className="flex flex-col overflow-hidden">
                 <span className={`font-extrabold text-gray-700 truncate ${item.isChecked ? 'line-through text-gray-400' : ''}`}>
                   {item.name}
                 </span>
                 <div className="flex items-center gap-1">
                   <div className={`p-0.5 rounded-md ${getCategoryColor(item.category)}`}>
                     {getCategoryIcon(item.category)}
                   </div>
                   <span className="text-[10px] font-extrabold uppercase text-gray-400">{item.category}</span>
                 </div>
               </div>
             </div>

             <button 
               onClick={() => deleteItem(item.id)}
               className="p-2 text-gray-300 hover:text-duoRed transition-colors"
             >
               <Trash2 size={20} />
             </button>
           </div>
         ))}
       </div>
    </div>
  );
};

export default ShoppingListTab;
