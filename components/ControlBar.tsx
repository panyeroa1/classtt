
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';

interface ControlBarProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isSharingScreen: boolean;
  isSharingAudio?: boolean;
  onToggleAudioShare?: () => void;
  onMute: () => void;
  onVideo: () => void;
  onShareScreen: () => void;
  onLeave: () => void;
  role: Role;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  showCaptions: boolean;
  onToggleCaptions: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  targetLang: Language;
  setTargetLang: (l: Language) => void;
  onToggleSidebar: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({ 
  isMuted, isVideoOn, isSharingScreen, isSharingAudio, onToggleAudioShare, onMute, onVideo, onShareScreen, onLeave, role, 
  showCaptions, onToggleCaptions, showLabels, targetLang, setTargetLang, onToggleSidebar
}) => {
  const navigate = useNavigate();

  const ControlButton = ({ active, onClick, children, title, danger, badge }: any) => (
    <div className="flex flex-col items-center gap-1 group relative">
      <button
        onClick={onClick}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg ${
          danger 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : active 
              ? 'bg-indigo-600 text-white shadow-indigo-500/30 scale-105' 
              : 'bg-zinc-800 text-zinc-300 border border-white/5 hover:bg-zinc-700'
        }`}
        title={title}
      >
        {children}
      </button>
      {badge && <span className="absolute -top-1 -right-1 bg-indigo-500 text-[8px] px-1 rounded-full font-black border-2 border-zinc-950">{badge}</span>}
      {showLabels && (
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-indigo-400 transition-colors text-center max-w-[60px] leading-tight">
          {title}
        </span>
      )}
    </div>
  );

  return (
    <div className="h-20 bg-zinc-950 flex items-center justify-between px-4 md:px-8 shrink-0 border-t border-white/5 shadow-2xl z-30">
      
      {/* Left section: Language Control */}
      <div className="flex-1 hidden md:flex items-center gap-4">
        <div className="flex flex-col">
          <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 ml-1">Linguistic Bridge</label>
          <div className="relative group">
            <select 
              className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5 pr-8 text-[10px] font-black text-zinc-100 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
              value={targetLang.code}
              onChange={(e) => setTargetLang(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!)}
            >
              {SUPPORTED_LANGUAGES.filter(l => l.code !== 'auto').map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Center section: Unified Command Hub */}
      <div className="flex items-center gap-2 md:gap-3 px-4 py-2 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-inner">
        
        <ControlButton onClick={onMute} active={!isMuted} title={isMuted ? 'Mic Off' : 'Mic On'}>
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
          )}
        </ControlButton>

        <ControlButton onClick={onVideo} active={isVideoOn} title={isVideoOn ? 'Cam On' : 'Cam Off'}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
        </ControlButton>

        <div className="w-[1px] h-8 bg-white/5 mx-1" />

        {role !== Role.OBSERVER && (
          <>
            <ControlButton onClick={onShareScreen} active={isSharingScreen} title="Present">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 18H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"/><path d="M8 21h8"/><path d="M12 18v3"/></svg>
            </ControlButton>
          </>
        )}

        <ControlButton onClick={onToggleSidebar} active={false} title="Social">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </ControlButton>

        <ControlButton onClick={onToggleCaptions} active={showCaptions} title="CC">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2" ry="2"/><path d="M7 15h4"/><path d="M15 15h2"/><path d="M7 11h2"/><path d="M13 11h4"/></svg>
        </ControlButton>

        <div className="w-[1px] h-8 bg-white/5 mx-1" />

        {/* New Test Suite / Lab Button */}
        <ControlButton onClick={() => navigate('/testsuite')} active={false} title="Lab">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.5l-3 4V19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5.5l-3-4V2"/><path d="M8 2h8"/><path d="M10 9h4"/></svg>
        </ControlButton>
      </div>

      {/* Right section: Exit Actions */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={onLeave}
          className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black text-[10px] rounded-xl border border-red-600/20 transition-all flex items-center gap-2 uppercase tracking-widest hover:shadow-lg hover:shadow-red-600/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Leave Session
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
