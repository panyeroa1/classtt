
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TranscriptChunk } from '../types';

interface TranscriptPageProps {
  transcripts: TranscriptChunk[];
  isDarkMode: boolean;
  onReset?: () => void;
}

const TranscriptPage: React.FC<TranscriptPageProps> = ({ transcripts, isDarkMode, onReset }) => {
  const navigate = useNavigate();

  const handleExport = (format: 'txt' | 'json') => {
    let content = '';
    if (format === 'txt') {
      content = `EBURON CLASS SESSION TRANSCRIPT\nGenerated: ${new Date().toLocaleString()}\nSession Hash: ${Date.now().toString(16).toUpperCase()}\n------------------------------------------\n\n`;
      
      content += transcripts.map(t => {
        const time = new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const speakerIdLine = `[${time}] ${t.participantName.toUpperCase()} (${t.participantRole.toUpperCase()})`;
        const separator = "-".repeat(speakerIdLine.length);
        
        return `${speakerIdLine}\n${separator}\nORIGINAL: ${t.originalText}\nTRANSLATED: ${t.translatedText || '...'}\n\n`;
      }).join('\n');
    } else {
      content = JSON.stringify(transcripts, null, 2);
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Eburon_Transcript_${Date.now()}.${format}`;
    link.click();
  };

  const handleExit = () => {
    if (onReset) onReset();
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-12 max-w-6xl mx-auto w-full bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
             </div>
             <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">Knowledge Base</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-zinc-100 tracking-tighter leading-none">Lecture Vault</h1>
          <p className="text-slate-500 dark:text-zinc-500 font-bold text-xl">Linguistic artifacts from your global session.</p>
        </div>
        <button
          onClick={handleExit}
          className="px-8 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-indigo-600 font-black rounded-3xl transition-all flex items-center gap-3 self-start md:self-center hover:shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span className="uppercase tracking-widest text-xs">Exit & Log Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-16">
        <button
          onClick={() => handleExport('txt')}
          className="group p-10 bg-white dark:bg-zinc-900 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white rounded-[3.5rem] transition-all duration-500 flex items-center gap-8 shadow-xl border border-slate-100 dark:border-zinc-800 hover:scale-[1.02]"
        >
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-zinc-800 group-hover:bg-white/20 flex items-center justify-center text-4xl transition-colors">
            📄
          </div>
          <div className="text-left">
            <h4 className="font-black text-2xl mb-1 tracking-tight">Plain Text</h4>
            <p className="text-[10px] opacity-60 font-black uppercase tracking-widest">Universal Readability</p>
          </div>
        </button>
        <button
          onClick={() => handleExport('json')}
          className="group p-10 bg-white dark:bg-zinc-900 hover:bg-slate-900 dark:hover:bg-white text-slate-600 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-950 rounded-[3.5rem] transition-all duration-500 flex items-center gap-8 shadow-xl border border-slate-100 dark:border-zinc-800 hover:scale-[1.02]"
        >
          <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-zinc-800 group-hover:bg-white/20 flex items-center justify-center text-4xl transition-colors">
            🗄️
          </div>
          <div className="text-left">
            <h4 className="font-black text-2xl mb-1 tracking-tight">Data Stream</h4>
            <p className="text-[10px] opacity-60 font-black uppercase tracking-widest">Structure Archive</p>
          </div>
        </button>
      </div>

      <div className="space-y-12 pb-24">
        <div className="flex items-center justify-between border-b-4 border-slate-100 dark:border-zinc-900 pb-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tighter uppercase">Sequential Feed</h2>
          <div className="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/30">
            {transcripts.length} Captured
          </div>
        </div>
        
        {transcripts.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-zinc-900/50 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-zinc-800 flex flex-col items-center gap-6 shadow-inner">
            <div className="text-8xl opacity-20 drop-shadow-2xl grayscale">🎙️</div>
            <p className="text-2xl font-black text-slate-300 dark:text-zinc-700 tracking-tight">Awaiting acoustic data extraction...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {transcripts.map((t) => (
              <div key={t.id} className="relative animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 md:gap-16">
                  <div className="flex flex-col items-start md:items-end md:text-right md:pt-4">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">{t.participantRole}</span>
                    <span className="font-black text-slate-900 dark:text-zinc-100 text-2xl tracking-tighter leading-none">{t.participantName}</span>
                    <span className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-tight">
                      {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-zinc-900/80 rounded-[3rem] p-10 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                       <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Input Phrase</span>
                      <p className="text-slate-600 dark:text-zinc-400 text-xl leading-relaxed font-bold italic opacity-80">
                        "{t.originalText}"
                      </p>
                    </div>
                    <div className="h-[2px] bg-slate-100 dark:bg-zinc-800 w-full"></div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Acoustic Translation</span>
                      <p className="text-slate-900 dark:text-zinc-100 text-3xl font-black tracking-tight leading-tight">
                        {t.translatedText || "Decoding signal..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-20 pt-12 border-t-2 border-slate-100 dark:border-zinc-900 text-center opacity-40">
         <p className="text-slate-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
           SECURED BY EBURON QUANTUM ARCHITECTURE • SESSION HASH: {Date.now().toString(16).toUpperCase()}
         </p>
      </div>
    </div>
  );
};

export default TranscriptPage;
