import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, SessionType, Language } from '../types';
import { SUPPORTED_LANGUAGES, AUTO_LANGUAGE } from '../constants';

interface LandingPageProps {
  onJoin: (name: string, role: Role, type: SessionType, source: Language, target: Language) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

type Mode = 'select' | 'create' | 'join' | 'schedule';

const LandingPage: React.FC<LandingPageProps> = ({ onJoin, isDarkMode, toggleDarkMode }) => {
  const [mode, setMode] = useState<Mode>('select');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [sessionType, setSessionType] = useState<SessionType>(SessionType.LIVE_CLASS);
  const [sourceLang, setSourceLang] = useState(AUTO_LANGUAGE);
  const [targetLang, setTargetLang] = useState(SUPPORTED_LANGUAGES.find(l => l.code === 'en-US') || SUPPORTED_LANGUAGES[1]);
  const navigate = useNavigate();

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onJoin(name, role, sessionType, sourceLang, targetLang);
    navigate('/prejoin');
  };

  const Card = ({ title, icon, color, onClick, desc }: any) => (
    <button
      onClick={onClick}
      className="group relative bg-white dark:bg-zinc-900/60 eburon-card p-10 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-left w-full overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full`}></div>
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-3xl mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-3xl font-black text-slate-800 dark:text-zinc-100 mb-3 tracking-tighter">{title}</h3>
      <p className="text-slate-500 dark:text-zinc-500 text-sm leading-relaxed font-bold uppercase tracking-tight opacity-70">{desc}</p>
    </button>
  );

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 bg-slate-50 dark:bg-zinc-950 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-200/20 dark:bg-indigo-900/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-200/20 dark:bg-purple-900/10 blur-[150px] rounded-full"></div>

      <div className="fixed top-10 right-10 z-50">
        <button 
          onClick={toggleDarkMode}
          className="p-4 rounded-[1.5rem] bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-xl text-slate-600 dark:text-zinc-400 hover:text-indigo-600 transition-all duration-300 hover:scale-110"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>

      <div className="z-10 w-full max-w-7xl py-12">
        {mode === 'select' ? (
          <div className="space-y-16">
            <div className="text-center space-y-6 px-4">
              <div className="inline-block px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                Eburon AI Intelligence
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-zinc-100 tracking-tight leading-[0.9] md:leading-[0.9]">
                Global Education, <br className="hidden md:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">Reimagined.</span>
              </h1>
              <p className="text-slate-500 dark:text-zinc-500 text-xl md:text-2xl max-w-3xl mx-auto font-bold leading-snug">
                Real-time translation for high-impact classrooms. Speak freely, listen globally.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 px-4">
              <Card
                title="Launch Class"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>}
                color="from-indigo-600 to-blue-700"
                onClick={() => { setMode('create'); setRole(Role.TEACHER); }}
                desc="Start a new session as the host teacher."
              />
              <Card
                title="Enter Room"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>}
                color="from-emerald-600 to-teal-700"
                onClick={() => { setMode('join'); setRole(Role.STUDENT); }}
                desc="Join a live session with a code."
              />
              <Card
                title="Calendar"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                color="from-orange-600 to-amber-700"
                onClick={() => setMode('schedule')}
                desc="Plan future translated events."
              />
            </div>
          </div>
        ) : mode === 'schedule' ? (
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-[4rem] shadow-2xl p-12 md:p-16 border border-slate-100 dark:border-zinc-800 eburon-card">
             <button onClick={() => setMode('select')} className="text-slate-400 hover:text-indigo-600 mb-10 flex items-center gap-3 transition font-black text-xs uppercase tracking-widest">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back
             </button>
             <h2 className="text-5xl font-black text-slate-900 dark:text-zinc-100 mb-6 tracking-tighter">Schedule Session</h2>
             <div className="bg-indigo-50 dark:bg-indigo-900/10 p-10 rounded-[3rem] text-center space-y-8 border border-indigo-100/50 dark:border-indigo-800/20">
                <div className="text-8xl drop-shadow-xl animate-bounce">📅</div>
                <div className="space-y-3">
                  <p className="text-indigo-900 dark:text-indigo-100 font-black text-2xl tracking-tight">Enterprise Sync Pending</p>
                  <p className="text-indigo-600/70 dark:text-indigo-400/60 text-base font-bold uppercase tracking-tight">Our API bridge is currently in maintenance. Scheduled classes will return shortly.</p>
                </div>
                <button onClick={() => setMode('select')} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-2xl shadow-indigo-600/30">Dashboard</button>
             </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-[4rem] shadow-2xl p-8 md:p-16 border border-slate-100 dark:border-zinc-800 eburon-card animate-fadeIn">
            <button onClick={() => setMode('select')} className="text-slate-400 hover:text-indigo-600 mb-10 flex items-center gap-3 transition font-black text-xs uppercase tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back
            </button>

            <h2 className="text-5xl font-black text-slate-900 dark:text-zinc-100 mb-3 tracking-tighter leading-none">{mode === 'create' ? 'Start Class' : 'Enter Session'}</h2>
            <p className="text-slate-500 dark:text-zinc-500 mb-12 font-bold text-lg">Define your identity and language bridge.</p>

            <form onSubmit={handleAction} className="space-y-10">
              <div className="space-y-8">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-500 transition-colors">Display Identity</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    className="w-full bg-slate-50 dark:bg-zinc-800/30 border-2 border-transparent focus:border-indigo-600 rounded-[2rem] px-8 py-6 focus:ring-8 focus:ring-indigo-500/5 transition-all font-black text-slate-800 dark:text-zinc-100 text-xl placeholder:text-slate-300 dark:placeholder:text-zinc-700"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name..."
                  />
                </div>

                {mode === 'join' && (
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-500 transition-colors">Classroom Secret</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 dark:bg-zinc-800/30 border-2 border-transparent focus:border-indigo-600 rounded-[2rem] px-8 py-6 focus:ring-8 focus:ring-indigo-500/5 transition-all font-black text-slate-800 dark:text-zinc-100 text-xl placeholder:text-slate-300 dark:placeholder:text-zinc-700"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      placeholder="e.g. EB-CLASS-LIV"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-3">Pedagogy Style</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-zinc-800/30 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-5 transition font-black text-slate-800 dark:text-zinc-100 appearance-none cursor-pointer text-sm"
                      value={sessionType}
                      onChange={(e) => setSessionType(e.target.value as SessionType)}
                    >
                      <option value={SessionType.LIVE_CLASS}>Lecture Mode</option>
                      <option value={SessionType.INTERACTIVE}>Interactive Mode</option>
                    </select>
                  </div>
                   <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-3">Assigned Role</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-zinc-800/30 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-5 transition font-black text-slate-800 dark:text-zinc-100 appearance-none cursor-pointer text-sm"
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                    >
                      {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[3rem] border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6 6-6"/></svg>
                   </div>
                   <h3 className="font-black text-indigo-950 dark:text-indigo-100 text-sm uppercase tracking-[0.2em]">Dialect Bridge</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-3">I Speak</label>
                    <select
                      className="w-full bg-white dark:bg-zinc-900 border-2 border-indigo-100 dark:border-zinc-800 rounded-2xl px-5 py-5 transition text-xs font-black text-indigo-900 dark:text-indigo-100 cursor-pointer shadow-sm"
                      value={sourceLang.code}
                      onChange={(e) => setSourceLang(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!)}
                    >
                      {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-3">I Hear</label>
                    <select
                      className="w-full bg-white dark:bg-zinc-900 border-2 border-indigo-100 dark:border-zinc-800 rounded-2xl px-5 py-5 transition text-xs font-black text-indigo-900 dark:text-indigo-100 cursor-pointer shadow-sm"
                      value={targetLang.code}
                      onChange={(e) => setTargetLang(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!)}
                    >
                      {SUPPORTED_LANGUAGES.filter(l => l.code !== 'auto').map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 text-white font-black text-2xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] hover:shadow-indigo-500/60 hover:scale-[1.02] active:scale-95 tracking-tighter uppercase"
              >
                Establish Connection
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;