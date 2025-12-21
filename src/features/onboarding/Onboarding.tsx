import React, { useState } from 'react';
import { UserProfile, Gender, Goal } from '../../types';
import { calculateTDEE, saveUserProfile } from '../../lib/storage';
import { Button } from '../../components/ui/Button';
import { Target, Ruler, Weight, User, ChevronRight, Activity } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    gender: Gender.Female,
    height: 160,
    weight: 55,
    goal: Goal.LoseWeight
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    const tdee = calculateTDEE(formData.weight, formData.height, formData.age, formData.gender, formData.goal);
    const profile: UserProfile = { ...formData, tdee };
    saveUserProfile(profile);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1 mt-0">
        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <div className="flex-1 p-8 flex flex-col justify-center relative z-10">

        {step === 1 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Thông tin cơ bản</h1>
              <p className="text-slate-500">Giúp AI hiểu rõ cơ thể bạn hơn.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tên của bạn</label>
                <input
                  type="text"
                  className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-sm text-lg font-semibold text-slate-800 placeholder-slate-300"
                  placeholder="Nhập tên..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Giới tính</label>
                <div className="grid grid-cols-2 gap-4">
                  {[Gender.Male, Gender.Female].map(g => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-4 rounded-2xl font-bold transition-all border-2 ${formData.gender === g ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-transparent bg-white text-slate-500 hover:bg-slate-100'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tuổi</label>
                <input
                  type="number"
                  className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none shadow-sm text-lg font-semibold"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Chỉ số cơ thể</h1>
              <p className="text-slate-500">Để tính toán lượng Calo chính xác.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="font-bold text-slate-700 flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-emerald-500" /> Chiều cao
                  </label>
                  <span className="text-2xl font-bold text-emerald-600">{formData.height} <span className="text-sm text-slate-400">cm</span></span>
                </div>
                <input
                  type="range"
                  min="100" max="220"
                  value={formData.height}
                  onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="font-bold text-slate-700 flex items-center gap-2">
                    <Weight className="w-5 h-5 text-blue-500" /> Cân nặng
                  </label>
                  <span className="text-2xl font-bold text-blue-600">{formData.weight} <span className="text-sm text-slate-400">kg</span></span>
                </div>
                <input
                  type="range"
                  min="30" max="150"
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Mục tiêu</h1>
              <p className="text-slate-500">Bạn muốn đạt được điều gì?</p>
            </div>

            <div className="space-y-4">
              {[
                { val: Goal.LoseWeight, icon: Activity, desc: 'Giảm mỡ, thon gọn cơ thể' },
                { val: Goal.Maintain, icon: Target, desc: 'Duy trì cân nặng hiện tại' },
                { val: Goal.GainWeight, icon: Weight, desc: 'Tăng cơ, tăng cân' }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setFormData({ ...formData, goal: item.val })}
                  className={`w-full p-5 rounded-3xl border-2 transition-all duration-200 text-left flex items-center gap-4 group ${formData.goal === item.val
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-emerald-100 shadow-lg'
                      : 'border-transparent bg-white shadow-sm hover:bg-slate-50'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.goal === item.val ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-emerald-500'}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${formData.goal === item.val ? 'text-emerald-900' : 'text-slate-700'}`}>{item.val}</div>
                    <div className="text-sm text-slate-400">{item.desc}</div>
                  </div>
                  <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.goal === item.val ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
                    {formData.goal === item.val && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="p-8 pt-0 flex gap-4">
        {step > 1 && (
          <Button variant="secondary" onClick={prevStep} className="flex-1">Quay lại</Button>
        )}
        <Button
          onClick={step === 3 ? handleSubmit : nextStep}
          fullWidth
          className="flex-2 shadow-xl shadow-emerald-500/20"
          disabled={step === 1 && !formData.name}
        >
          {step === 3 ? 'Hoàn tất' : 'Tiếp tục'} <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};