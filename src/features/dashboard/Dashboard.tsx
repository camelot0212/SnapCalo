import React from 'react';
import { UserProfile, Meal, MealType } from '../../types';
import { Camera, Utensils, Flame, Sunrise, Sun, Moon, Coffee, Plus, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  meals: Meal[];
  onOpenCamera: () => void;
}

const MEAL_CONFIG = {
  [MealType.Breakfast]: { icon: Sunrise, style: 'bg-orange-50 text-orange-600 border-orange-100' },
  [MealType.Lunch]: { icon: Sun, style: 'bg-amber-50 text-amber-600 border-amber-100' },
  [MealType.Dinner]: { icon: Moon, style: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  [MealType.Snack]: { icon: Coffee, style: 'bg-purple-50 text-purple-600 border-purple-100' },
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
    <div className="min-h-screen bg-[#FDFDFD] relative pb-32 animate-fade-in overflow-x-hidden">
      {/* Immersive Header Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#0f172a] z-0 rounded-b-[60px] shadow-2xl shadow-emerald-950/20"></div>

      <div className="relative z-10 px-6 pt-12">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">SnapCalo</h1>
            <p className="text-emerald-200/50 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Chào, {user.name}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
            {user.name.charAt(0)}
          </div>
        </header>

        {/* HUD Hero Card */}
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 rounded-[48px] shadow-2xl shadow-emerald-950/40 text-white flex items-center justify-between overflow-hidden relative group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/20 blur-[100px] rounded-full group-hover:bg-emerald-400/30 transition-all duration-1000"></div>

          <div className="z-10 flex flex-col">
            <p className="text-emerald-200/70 text-[10px] font-black uppercase tracking-widest mb-1">Cần bổ sung</p>
            <p className="text-6xl font-black tracking-tighter leading-none mb-4">{isOver ? 0 : remaining}</p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${isOver ? 'text-red-400' : 'text-emerald-400'}`} />
                <span className="text-xs font-bold">{consumed} / {user.tdee} Kcal</span>
              </div>
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${isOver ? 'bg-red-400' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(100, (consumed / user.tdee) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="w-32 h-32 z-10 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={48}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={8}
                  cornerRadius={12}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="consumed" fill={isOver ? '#F87171' : '#10B981'} />
                  <Cell key="remaining" fill="#ffffff" opacity={0.1} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Utensils className="w-6 h-6 text-white/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Nhật ký hôm nay</h2>
        <div className="space-y-4">
          {meals.map(meal => {
            const config = MEAL_CONFIG[meal.type];
            const Icon = config.icon;
            return (
              <div key={meal.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.style} border`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{meal.type}</h3>
                    <span className="font-bold text-emerald-600">{meal.totalCalories} Kcal</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{meal.items.map(i => i.name).join(', ')}</p>
                </div>
              </div>
            );
          })}
          {meals.length === 0 && (
            <p className="text-center text-slate-400 py-8">Chưa có bữa ăn nào.</p>
          )}
        </div>
      </div>

      <button onClick={onOpenCamera} className="fixed bottom-8 right-6 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 z-50 animate-bounce hover:scale-110 transition-transform">
        <Camera className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};