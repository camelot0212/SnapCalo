import React, { useState, useEffect } from 'react';
import { FoodItem, MealType } from '../../types';
import { Button } from '../../components/ui/Button';
import { Plus, Trash2, Check, ArrowLeft, Sunrise, Sun, Moon, Coffee, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MealEditorProps {
  initialItems: Omit<FoodItem, 'id'>[];
  imageBase64: string;
  onSave: (items: FoodItem[], type: MealType) => void;
  onCancel: () => void;
}

const MEAL_TYPE_CONFIG = {
  [MealType.Breakfast]: { icon: Sunrise, label: 'Sáng', color: 'text-orange-500', bg: 'bg-orange-50' },
  [MealType.Lunch]: { icon: Sun, label: 'Trưa', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  [MealType.Dinner]: { icon: Moon, label: 'Tối', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  [MealType.Snack]: { icon: Coffee, label: 'Vặt', color: 'text-purple-500', bg: 'bg-purple-50' },
};

export const MealEditor: React.FC<MealEditorProps> = ({ initialItems, imageBase64, onSave, onCancel }) => {
  const [items, setItems] = useState<FoodItem[]>(
    initialItems.map(item => ({ ...item, id: uuidv4() }))
  );

  const [mealType, setMealType] = useState<MealType>(MealType.Lunch);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) setMealType(MealType.Breakfast);
    else if (hour >= 11 && hour < 14) setMealType(MealType.Lunch);
    else if (hour >= 14 && hour < 18) setMealType(MealType.Snack);
    else setMealType(MealType.Dinner);
  }, []);

  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

  const handleUpdateItem = (id: string, field: keyof FoodItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updatedItem = { ...item, [field]: value };
      if (field === 'weight') {
        const ratio = Number(value) / item.weight;
        updatedItem.calories = Math.round(item.calories * ratio);
        updatedItem.protein = Number((item.protein * ratio).toFixed(1));
        updatedItem.fat = Number((item.fat * ratio).toFixed(1));
        updatedItem.carbs = Number((item.carbs * ratio).toFixed(1));
      }
      return updatedItem;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddItem = () => {
    const newItem: FoodItem = {
      id: uuidv4(),
      name: 'Món thêm',
      weight: 100,
      calories: 100,
      protein: 5,
      fat: 5,
      carbs: 10
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative pb-32">
      {/* Immersive Image Header */}
      <div className="relative h-72 w-full">
        <img src={imageBase64} alt="Meal" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/20 to-transparent"></div>

        {/* Top Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button onClick={onCancel} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-white/80 font-medium text-sm px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10">Xem lại</span>
        </div>

        {/* Floating Meal Selector */}
        <div className="absolute -bottom-8 left-4 right-4 bg-white rounded-3xl p-2 shadow-xl shadow-slate-200/50 flex justify-between items-center z-20">
          {Object.values(MealType).map((type) => {
            const config = MEAL_TYPE_CONFIG[type];
            const Icon = config.icon;
            const isActive = mealType === type;

            return (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-300 ${isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transform scale-105'
                    : 'text-slate-400 hover:bg-slate-50'
                  }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : config.color}`} />
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 px-5 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Chi tiết</h2>
            <p className="text-slate-500 text-sm">Chạm vào thông tin để chỉnh sửa</p>
          </div>
          <Button onClick={handleAddItem} variant="secondary" className="!px-3 !py-2 !text-xs !rounded-xl">
            <Plus className="w-4 h-4" /> Thêm
          </Button>
        </div>

        {/* List Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <input
                  className="font-bold text-slate-800 text-lg bg-transparent border-none p-0 focus:ring-0 w-full mr-4 placeholder-slate-300"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                  placeholder="Tên món ăn..."
                />
                <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4 relative z-10">
                {/* Weight Input */}
                <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 flex items-center justify-between border border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-all">
                  <span className="text-slate-400 text-xs font-bold uppercase">Nặng</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="w-12 bg-transparent font-bold text-slate-800 text-right outline-none"
                      value={item.weight}
                      onChange={(e) => handleUpdateItem(item.id, 'weight', Number(e.target.value))}
                    />
                    <span className="text-slate-500 text-xs ml-1 font-medium">g</span>
                  </div>
                </div>

                {/* Calories Display */}
                <div className="flex-1 bg-emerald-50 rounded-2xl px-4 py-3 flex items-center justify-between border border-transparent">
                  <span className="text-emerald-600/70 text-xs font-bold uppercase">Calo</span>
                  <div className="flex items-center">
                    <span className="text-emerald-700 font-bold text-lg">{item.calories}</span>
                  </div>
                </div>
              </div>

              {/* Macros */}
              <div className="flex gap-2 mt-4 relative z-10">
                {['protein', 'fat', 'carbs'].map((macro) => (
                  <div key={macro} className="flex-1 bg-white border border-slate-100 rounded-xl p-2 text-center shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                      {macro === 'protein' ? 'Đạm' : macro === 'fat' ? 'Béo' : 'Đường'}
                    </div>
                    <div className="font-bold text-slate-700 text-sm">
                      {item[macro as keyof FoodItem]}g
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-5 safe-area-bottom z-30">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng cộng</p>
            <p className="text-3xl font-bold text-slate-800">{totalCalories} <span className="text-lg text-slate-400 font-normal">Kcal</span></p>
          </div>
          <Button onClick={() => onSave(items, mealType)} className="px-8 !rounded-2xl !py-4 shadow-xl shadow-emerald-500/20">
            Lưu Nhật Ký <Check className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};