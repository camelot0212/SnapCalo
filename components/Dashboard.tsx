
import React from 'react';
import { UserProfile, Meal, MealType } from '../types';
import { Button } from './ui/Button';
import { Camera, Utensils, Flame, Sunrise, Sun, Moon, Coffee, Plus, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  meals: Meal[];
  onOpenCamera: () => void;
}

const MEAL_CONFIG = {
  [MealType.Breakfast]: { icon: Sunrise, style: 'bg-orange-100 text-orange-600' },
  [MealType.Lunch]: { icon: Sun, style: 'bg-amber-100 text-amber-600' },
  [MealType.Dinner]: { icon: Moon, style: 'bg-indigo-100 text-indigo-600' },
  [MealType.Snack]: { icon: Coffee, style: 'bg-purple-100 text-purple-600' },
};

export const Dashboard: React.FC<DashboardProps> = ({ user, meals, onOpenCamera }) => {
  const consumed = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const remaining = Math.max(0, user.tdee - consumed);
  const isOver = consumed > user.tdee;

  const data = [
    { name: 'Consumed', value: consumed },
    { name: 'Remaining', value: remaining },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative pb-28">
      {/* Immersive Header */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 z-0 rounded-b-[48px]"></div>

      <div className="relative z-10 px-6 pt-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Chào, {user.name}</h1>
            <p className="text-emerald-200/60 text-xs font-bold uppercase tracking-widest mt-0.5">Mục tiêu: {user.goal}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl">
            {user.name.charAt(0)}
          </div>
        </header>

        {/* HUD Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-6 rounded-[32px] shadow-2xl shadow-emerald-900/40 text-white flex items-center justify-between overflow-hidden relative group">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/10 blur-[64px] rounded-full group-hover:bg-emerald-400/20 transition-all duration-700"></div>
          
          <div className="z-10">
            <p className="text-emerald-200/80 text-xs font-bold uppercase mb-1">Calo còn lại</p>
            <p className="text-5xl font-black tracking-tighter">{isOver ? 0 : remaining}</p>
            <div className="mt-4 flex items-center gap-2 bg-white/5 w-fit px-3 py-1.5 rounded-full border border-white/5">
              <Flame className={`w-4 h-4 ${isOver ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
              <span className="text-xs font-bold tracking-wide">{consumed} / {user.tdee} Kcal</span>
            </div>
          </div>

          <div className="w-28 h-28 z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={42}
                  outerRadius={52}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={4}
                  cornerRadius={8}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="consumed" fill={isOver ? '#F87171' : '#10B981'} />
                  <Cell key="remaining" fill="#ffffff" opacity={0.1} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Nhật ký hôm nay</h2>
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
              <Info className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {meals.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-slate-200 shadow-sm group cursor-pointer" onClick={onOpenCamera}>
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Camera className="w-8 h-8 text-emerald-300" />
              </div>
              <h3 className="text-slate-700 font-bold text-lg">Chưa có dữ liệu</h3>
              <p className="text-slate-400 text-sm mt-1">Chụp món ăn của bạn để bắt đầu tính toán.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {meals.map((meal) => {
                const config = MEAL_CONFIG[meal.type];
                const Icon = config.icon;
                return (
                  <div key={meal.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex gap-4 transition-all hover:shadow-md hover:border-emerald-100">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                      {meal.imageUrl ? (
                        <img src={meal.imageUrl} alt={meal.type} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                          <Utensils className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${config.style}`}>
                          <Icon className="w-3 h-3" /> {meal.type}
                        </div>
                        <span className="text-sm font-black text-slate-800">{meal.totalCalories} Kcal</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium truncate mt-1">
                        {meal.items.map(i => i.name).join(', ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={onOpenCamera}
          className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center justify-center text-white ring-4 ring-white active:scale-90 transition-all duration-200"
        >
          <Camera className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
