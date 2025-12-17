import React from 'react';
import { UserProfile, Meal, MealType } from '../types';
import { Button } from './ui/Button';
import { Camera, Utensils, Flame, Sunrise, Sun, Moon, Coffee, ChevronRight, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  meals: Meal[];
  onOpenCamera: () => void;
}

const getMealIcon = (type: MealType) => {
  switch (type) {
    case MealType.Breakfast: return <Sunrise className="w-5 h-5" />;
    case MealType.Lunch: return <Sun className="w-5 h-5" />;
    case MealType.Dinner: return <Moon className="w-5 h-5" />;
    case MealType.Snack: return <Coffee className="w-5 h-5" />;
    default: return <Utensils className="w-5 h-5" />;
  }
};

const getMealColor = (type: MealType) => {
  switch (type) {
    case MealType.Breakfast: return 'bg-orange-100 text-orange-600';
    case MealType.Lunch: return 'bg-yellow-100 text-yellow-600';
    case MealType.Dinner: return 'bg-indigo-100 text-indigo-600';
    case MealType.Snack: return 'bg-purple-100 text-purple-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ user, meals, onOpenCamera }) => {
  const consumedCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const remainingCalories = Math.max(0, user.tdee - consumedCalories);
  
  // Custom Gauge Chart Data
  const data = [
    { name: 'Consumed', value: consumedCalories },
    { name: 'Remaining', value: Math.max(0, user.tdee - consumedCalories) },
  ];
  
  const isOverLimit = consumedCalories > user.tdee;
  const progressColor = isOverLimit ? '#F87171' : '#10B981'; // Red-400 or Emerald-500
  const emptyColor = '#334155'; // Slate-700
  
  return (
    <div className="min-h-screen bg-slate-50 relative pb-24">
      {/* Immersive Header Background */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-b-[40px] z-0"></div>

      {/* Header Content */}
      <div className="relative z-10 p-6 pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-emerald-100/80 text-sm font-medium mb-1 uppercase tracking-wider">Hôm nay</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">Chào, {user.name}</h1>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-emerald-100 font-bold text-lg shadow-lg">
            {user.name.charAt(0)}
          </div>
        </div>

        {/* Main HUD Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl shadow-emerald-900/50 text-white flex items-center justify-between relative overflow-hidden group">
           {/* Decorative Glow */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-400/30 transition-all duration-700"></div>

           <div className="flex flex-col gap-1 z-10">
             <span className="text-emerald-200 text-sm font-medium">Calo còn lại</span>
             <span className="text-4xl font-bold tracking-tight">{isOverLimit ? 0 : remainingCalories}</span>
             <span className="text-emerald-200/70 text-xs">Mục tiêu: {user.tdee} Kcal</span>
           </div>

           <div className="w-32 h-32 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={50}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={5}
                    cornerRadius={10}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell key="consumed" fill={progressColor} />
                    <Cell key="remaining" fill={emptyColor} opacity={0.5} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <Flame className={`w-6 h-6 ${isOverLimit ? 'text-red-400' : 'text-emerald-400'} fill-current`} />
              </div>
           </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="relative z-10 px-6 mt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            Nhật ký ăn uống
          </h2>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {meals.length} bữa
          </span>
        </div>
        
        {meals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center group cursor-pointer" onClick={onOpenCamera}>
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
               <Camera className="w-8 h-8 text-emerald-300" />
            </div>
            <p className="text-slate-600 font-semibold text-lg">Chưa có dữ liệu</p>
            <p className="text-sm text-slate-400 mt-1 max-w-[200px]">Hãy bắt đầu hành trình của bạn bằng bữa ăn đầu tiên.</p>
            <Button variant="ghost" className="mt-4 text-emerald-600 font-bold" onClick={onOpenCamera}>
               <Plus className="w-4 h-4" /> Thêm bữa ăn
            </Button>
          </div>
        ) : (
          <div className="space-y-4 relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-200 z-0"></div>

            {meals.map((meal, index) => (
              <div key={meal.id} className="relative z-10 group">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-1">
                   {/* Image / Icon */}
                   <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner">
                      {meal.imageUrl ? (
                        <img src={meal.imageUrl} alt={meal.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${getMealColor(meal.type)} bg-opacity-20`}>
                          <Utensils className="w-8 h-8" />
                        </div>
                      )}
                   </div>

                   <div className="flex-1 min-w-0 py-1">
                     <div className="flex justify-between items-start mb-1">
                       <div className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold ${getMealColor(meal.type)}`}>
                          {getMealIcon(meal.type)}
                          {meal.type}
                       </div>
                       <span className="font-bold text-slate-800">{meal.totalCalories} <span className="text-[10px] text-slate-400 font-normal">Kcal</span></span>
                     </div>
                     
                     <p className="text-sm text-slate-600 truncate font-medium mt-2">
                       {meal.items.map(i => i.name).join(', ')}
                     </p>
                     <p className="text-xs text-slate-400 mt-1">
                       {new Date(meal.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                     </p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button - Enhanced */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <button 
          onClick={onOpenCamera} 
          className="group relative w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95"
        >
          {/* Pulsing rings */}
          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-full shadow-lg shadow-emerald-500/40 w-16 h-16 flex items-center justify-center mx-auto my-auto ring-4 ring-white">
            <Camera className="w-7 h-7 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};