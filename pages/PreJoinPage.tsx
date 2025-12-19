import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PreJoinPage: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsReady(true);
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    }
    setupMedia();
  }, []);

  const handleJoin = () => {
    navigate('/room');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-slate-50 dark:bg-zinc-950 overflow-y-auto">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Preview Screen */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[4rem] opacity-10 blur-2xl group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative aspect-video w-full bg-white dark:bg-zinc-900 rounded-[3.5rem] overflow-hidden border-[8px] border-white dark:border-zinc-800 shadow-2xl transition-all duration-500">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover transition-all duration-1000 ${isVideoOn ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
            />
            {!isVideoOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-zinc-800 space-y-4">
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-4xl">📷</div>
                <span className="text-slate-400 dark:text-zinc-500 font-black uppercase tracking-widest text-xs">Video Stream Paused</span>
              </div>
            )}
            
            {/* Overlay Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 shadow-xl ${isMicOn ? 'bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-100 backdrop-blur-xl' : 'bg-red-600 text-white shadow-red-600/30'}`}
              >
                {isMicOn ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                )}
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 shadow-xl ${isVideoOn ? 'bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-100 backdrop-blur-xl' : 'bg-red-600 text-white shadow-red-600/30'}`}
              >
                {isVideoOn ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20"/><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-start space-y-10">
          <div className="space-y-4">
             <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Hardware Verification</div>
             <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-zinc-100 tracking-tighter leading-none">Ready to Engage?</h2>
             <p className="text-slate-500 dark:text-zinc-500 font-bold text-lg leading-relaxed max-w-md">
               Validating your local media environment. Artificial intelligence translation initializes upon room entry.
             </p>
          </div>

          <div className="w-full space-y-6">
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Acoustic Level</span>
                <span className="text-sm font-black text-slate-700 dark:text-zinc-200">Testing Audio Pipeline...</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div key={i} className={`w-1.5 h-6 rounded-full transition-all duration-300 ${i < 6 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-100 dark:bg-zinc-800'}`} style={{ animationDelay: `${i * 100}ms` }}></div>
                ))}
              </div>
            </div>

            <button
              disabled={!isReady}
              onClick={handleJoin}
              className={`w-full py-8 rounded-[2rem] font-black text-2xl tracking-tighter uppercase transition-all duration-500 shadow-2xl ${
                isReady 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-95' 
                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-700 cursor-not-allowed'
              }`}
            >
              Enter Classroom Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreJoinPage;