import React, { useState } from 'react';
import { Participant, ChatMessage, Role } from '../types';

interface SidePanelProps {
  activeTab: 'participants' | 'chat';
  onTabChange: (tab: 'participants' | 'chat') => void;
  participants: Participant[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose?: () => void;
  activeSpeakerId?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ activeTab, onTabChange, participants, messages, onSendMessage, onClose, activeSpeakerId }) => {
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-900 flex flex-col shrink-0 z-10 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden p-4 flex items-center justify-between border-b border-slate-200 dark:border-zinc-900">
        <span className="font-black text-xs uppercase tracking-widest text-slate-400">Class Info</span>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-indigo-600">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {/* Numerical Counter */}
      <div className="p-8 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Session Attendance</span>
            <span className="text-5xl font-black text-slate-900 dark:text-zinc-100 leading-none tracking-tighter">{participants.length.toString().padStart(2, '0')}</span>
         </div>
         <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.3)] text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
         </div>
      </div>

      <div className="flex p-4 gap-3 border-b border-slate-200 dark:border-zinc-900">
        <button
          onClick={() => onTabChange('participants')}
          className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all tracking-widest ${
            activeTab === 'participants' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 dark:text-zinc-600 hover:bg-slate-100 dark:hover:bg-zinc-900'
          }`}
        >
          Participants
        </button>
        <button
          onClick={() => onTabChange('chat')}
          className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all tracking-widest ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 dark:text-zinc-600 hover:bg-slate-100 dark:hover:bg-zinc-900'
          }`}
        >
          Chat Feed
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'participants' ? (
          <div className="p-0 space-y-0.5">
            {participants.map((p) => {
              const isSpeaking = activeSpeakerId === p.id;
              return (
                <div key={p.id} className={`relative flex items-center gap-4 p-5 transition-all duration-300 group ${isSpeaking ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/50'}`}>
                  
                  {/* Talking Indicator Bar (The requested visualization on the left bar area) */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${isSpeaking ? 'bg-indigo-600 opacity-100 scale-y-100' : 'bg-transparent opacity-0 scale-y-0'}`} />

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all shadow-sm ${isSpeaking ? 'bg-indigo-600 text-white scale-105 rotate-3' : 'bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 group-hover:bg-indigo-100 dark:group-hover:bg-zinc-800'}`}>
                    {p.name[0].toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-black truncate tracking-tight ${isSpeaking ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-zinc-100'}`}>{p.name}</p>
                      {p.id === 'me' && <span className="text-[7px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/50">You</span>}
                    </div>
                    <div className="flex items-center gap-2">
                       <p className="text-[9px] text-slate-400 dark:text-zinc-600 font-black uppercase tracking-widest">
                         {p.role}
                       </p>
                       {isSpeaking && <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {p.isMuted ? (
                      <span className="text-xs opacity-30 grayscale grayscale-100">🔇</span>
                    ) : (
                      <div className={`flex gap-0.5 items-end h-3 px-1 ${isSpeaking ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-0.5 bg-indigo-500 rounded-full ${isSpeaking ? 'animate-music1' : 'h-1'}`} />
                        <div className={`w-0.5 bg-indigo-500 rounded-full ${isSpeaking ? 'animate-music2' : 'h-1'}`} />
                        <div className={`w-0.5 bg-indigo-500 rounded-full ${isSpeaking ? 'animate-music3' : 'h-1'}`} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                   <div className="text-7xl mb-6 grayscale">💬</div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Silence is Golden</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.senderId === 'me' ? 'items-end' : 'items-start'} animate-fadeIn`}>
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      <span className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">{m.senderName}</span>
                      <span className="text-[8px] text-slate-300 dark:text-zinc-700 font-bold">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`px-6 py-4 rounded-[1.8rem] max-w-[90%] text-sm font-bold transition-all shadow-sm leading-relaxed ${
                      m.senderId === 'me' ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20' : 'bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 rounded-tl-none border border-slate-200 dark:border-zinc-800'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={handleChatSubmit} className="p-6 border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-6 py-5 text-sm font-black text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-600 transition-all shadow-inner"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-indigo-600/30">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;