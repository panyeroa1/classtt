
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';

interface SettingsPageProps {
  sourceLang: Language;
  setSourceLang: (l: Language) => void;
  targetLang: Language;
  setTargetLang: (l: Language) => void;
  voiceName: string;
  setVoiceName: (v: string) => void;
}

const VOICE_OPTIONS = [
  { id: 'Kore', name: 'Emerald (Kore)' },
  { id: 'Puck', name: 'Ruby (Puck)' },
  { id: 'Charon', name: 'Sapphire (Charon)' },
  { id: 'Fenrir', name: 'Diamond (Fenrir)' },
  { id: 'Zephyr', name: 'Amethyst (Zephyr)' },
];

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  sourceLang, setSourceLang, targetLang, setTargetLang, voiceName, setVoiceName 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-zinc-950 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3">System Configuration</div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-zinc-100 tracking-tighter">Preferences</h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-indigo-600 shadow-xl flex items-center justify-center transition-all hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Audio Section */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8 eburon-card transition-all hover:shadow-md">
            <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100 flex items-center gap-4">
              <span className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 flex items-center justify-center text-xl shadow-inner">🎙️</span>
              Audio Diagnostics
            </h3>
            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mb-3 block">Transducer Profile</label>
                <select className="w-full bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 font-black text-sm text-slate-700 dark:text-zinc-200 appearance-none shadow-sm cursor-pointer">
                  <option>System Default (Optimized)</option>
                  <option>Studio Condenser Mic</option>
                  <option>High Definition Input</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800/50">
                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase">Input Pressure</span>
                <div className="flex gap-1.5 h-6 items-center">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                    <div key={i} className={`w-1.5 rounded-full transition-all duration-500 ${i < 6 ? 'bg-indigo-500 h-6' : 'bg-slate-200 dark:bg-zinc-700 h-2 opacity-30'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8 eburon-card transition-all hover:shadow-md">
            <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100 flex items-center gap-4">
              <span className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 flex items-center justify-center text-xl shadow-inner">📹</span>
              Optical Matrix
            </h3>
            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mb-3 block">Capture Hardware</label>
                <select className="w-full bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 font-black text-sm text-slate-700 dark:text-zinc-200 appearance-none shadow-sm cursor-pointer">
                  <option>Eburon HD Logic Cam</option>
                  <option>Secondary Stream Port</option>
                </select>
              </div>
              <div className="w-full aspect-video bg-slate-100 dark:bg-zinc-800 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-zinc-700 space-y-3 grayscale">
                <div className="text-3xl opacity-20">📷</div>
                <span className="text-slate-400 dark:text-zinc-600 font-black text-[9px] uppercase tracking-[0.2em]">Encrypted Stream Active</span>
              </div>
            </div>
          </div>

          {/* Translation Section */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[4rem] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-10 lg:col-span-2 eburon-card">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-8">
              <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100 flex items-center gap-4">
                <span className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 flex items-center justify-center text-xl shadow-inner">🌍</span>
                Linguistic Intelligence
              </h3>
              <div className="px-5 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Gemini 2.5 Logic Bridge
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest block ml-1">Spoken Dialect</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-600 rounded-[2rem] px-8 py-6 font-black text-lg text-slate-800 dark:text-zinc-100 shadow-sm cursor-pointer transition-all"
                  value={sourceLang.code}
                  onChange={(e) => setSourceLang(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!)}
                >
                  {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
                <p className="text-[11px] text-slate-400 font-bold px-4 leading-relaxed uppercase tracking-tight opacity-70">The system will analyze this specific dialect for phonetic accuracy.</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest block ml-1">Synthesized Result</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-600 rounded-[2rem] px-8 py-6 font-black text-lg text-slate-800 dark:text-zinc-100 shadow-sm cursor-pointer transition-all"
                  value={targetLang.code}
                  onChange={(e) => setTargetLang(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!)}
                >
                  {SUPPORTED_LANGUAGES.filter(l => l.code !== 'auto').map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
                <p className="text-[11px] text-slate-400 font-bold px-4 leading-relaxed uppercase tracking-tight opacity-70">All incoming audio streams will be translated into this dialect instantly.</p>
              </div>
              {/* Added Voice Style Dropdown */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest block ml-1">Vocal Frequency Profile (Voice Style)</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-600 rounded-[2rem] px-8 py-6 font-black text-lg text-slate-800 dark:text-zinc-100 shadow-sm cursor-pointer transition-all"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                >
                  {VOICE_OPTIONS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
                <p className="text-[11px] text-slate-400 font-bold px-4 leading-relaxed uppercase tracking-tight opacity-70">Select the harmonic signature of the synthesized output stream.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 text-center pb-20">
           <button 
             onClick={() => navigate(-1)}
             className="px-16 py-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)] transform hover:scale-105 transition active:scale-95 text-2xl tracking-tighter uppercase"
           >
             Commit Architecture
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
