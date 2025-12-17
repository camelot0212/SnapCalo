import React, { useRef, useState } from 'react';
import { Button } from './ui/Button';
import { Camera, Image as ImageIcon, X, Zap, ChevronRight } from 'lucide-react';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodItem } from '../types';

interface CameraViewProps {
  onClose: () => void;
  onAnalysisComplete: (items: Omit<FoodItem, 'id'>[], imageBase64: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onClose, onAnalysisComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const items = await analyzeFoodImage(preview);
      onAnalysisComplete(items, preview);
    } catch (err) {
      setError("Không thể nhận diện món ăn. Vui lòng chụp lại rõ nét hơn.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      {/* Scanning Line Animation Styles */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scanning-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 4px;
          background: #10B981;
          box-shadow: 0 0 10px #10B981, 0 0 20px #10B981;
          animation: scan 2s linear infinite;
          z-index: 20;
        }
      `}</style>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-lg flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <X className="w-6 h-6" />
        </button>
        <span className="font-medium text-sm bg-black/40 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10">AI Food Scanner</span>
        <div className="w-10"></div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        {preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Food preview" 
              className="w-full h-full object-contain" 
            />
            {/* Analysis Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-900/20 z-10">
                <div className="scanning-line"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 font-bold text-xl text-emerald-400 animate-pulse tracking-wide">AI ĐANG PHÂN TÍCH</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center relative">
             <div className="w-72 h-72 border border-white/20 rounded-[40px] flex items-center justify-center mb-8 relative">
               {/* Corner Markers */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl -mt-1 -ml-1"></div>
               <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl -mt-1 -mr-1"></div>
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl -mb-1 -ml-1"></div>
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl -mb-1 -mr-1"></div>
               
               <Camera className="w-12 h-12 text-white/50" />
             </div>
             <p className="text-white/80 font-medium text-lg">Căn món ăn vào khung</p>
             <p className="text-white/50 text-sm mt-2">AI sẽ tự động nhận diện thành phần</p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-900 px-6 py-8 pb-10 safe-area-bottom">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
               <X className="w-4 h-4 text-red-500" />
             </div>
             <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {!preview ? (
          <div className="flex items-center justify-around">
            <label className="flex flex-col items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                 <ImageIcon className="w-6 h-6 text-white" />
               </div>
               <span className="text-xs font-medium">Thư viện</span>
               <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </label>

            <div className="relative">
               <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
               <Button 
                onClick={triggerFileInput} 
                className="!w-20 !h-20 !rounded-full !p-0 bg-white hover:bg-gray-200 ring-4 ring-white/20 shadow-xl shadow-white/10"
              >
                <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black"></div>
                </div>
              </Button>
            </div>
            
            <div className="w-12 opacity-0"></div> {/* Spacer for balance */}
          </div>
        ) : (
          <div className="flex gap-4">
             <Button 
              variant="secondary" 
              onClick={() => setPreview(null)}
              className="flex-1 !bg-white/10 !text-white !border-white/10 hover:!bg-white/20 !rounded-2xl"
            >
              Chụp lại
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAnalyze} 
              className="flex-[2] !rounded-2xl !bg-emerald-500 hover:!bg-emerald-400 !shadow-emerald-500/40"
            >
              Phân tích <Zap className="w-4 h-4 fill-current" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};