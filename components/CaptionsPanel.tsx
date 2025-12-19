
import React, { useRef, useEffect } from 'react';
import { TranscriptChunk, Language } from '../types';

interface CaptionsPanelProps {
  transcripts: TranscriptChunk[];
  targetLang: Language;
}

const CaptionsPanel: React.FC<CaptionsPanelProps> = ({ transcripts, targetLang }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Only show the last few transcripts for the overlay effect
  const recentTranscripts = transcripts.slice(-2);

  if (transcripts.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-end pointer-events-none mb-8">
      <div className="space-y-3 w-full max-w-2xl">
        {recentTranscripts.map((t) => (
          <div key={t.id} className="animate-fadeIn">
            <div className="bg-black/40 backdrop-blur-3xl px-8 py-5 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 opacity-80">
                {t.participantName} • Translated to {targetLang.name}
              </span>
              <p className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight drop-shadow-lg">
                {t.translatedText || <span className="opacity-40 italic">Translating...</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaptionsPanel;
