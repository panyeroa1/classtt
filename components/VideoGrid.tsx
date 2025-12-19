import React from 'react';
import { Participant, Role } from '../types';

interface VideoGridProps {
  participants: Participant[];
  localIsMuted: boolean;
  localIsVideoOn: boolean;
  isSharingScreen: boolean;
  activeSpeakerId: string;
  audioLevel?: number;
}

const VideoGrid: React.FC<VideoGridProps> = ({ participants, localIsMuted, localIsVideoOn, isSharingScreen, activeSpeakerId, audioLevel = 0 }) => {
  // Find the Host primarily, otherwise the active speaker, otherwise 'me'
  const host = participants.find(p => p.role === Role.TEACHER);
  const activeSpeaker = participants.find(p => p.id === activeSpeakerId);
  const displayedParticipant = host || activeSpeaker || participants.find(p => p.id === 'me') || participants[0];

  if (!displayedParticipant) return null;

  const isMe = displayedParticipant.id === 'me';
  const isVideoOn = isMe ? localIsVideoOn : displayedParticipant.isVideoOn;
  const isMuted = isMe ? localIsMuted : displayedParticipant.isMuted;
  const isSpeaking = activeSpeakerId === displayedParticipant.id;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 overflow-hidden relative">
      <div className={`relative w-full h-full transition-all duration-700 overflow-hidden flex items-center justify-center`}>
        
        {isSharingScreen ? (
          <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center space-y-6 animate-fadeIn">
             <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(79,70,229,0.4)] animate-pulse">
               🖥️
             </div>
             <div className="text-center space-y-2">
               <h2 className="text-white text-4xl font-black tracking-tighter uppercase">Broadcast Active</h2>
               <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.3em]">Source: {displayedParticipant.name}</p>
             </div>
          </div>
        ) : isVideoOn ? (
          <div className="relative w-full h-full animate-fadeIn">
            {/* Simulation of a video stream - Using a high quality placeholder for the demo */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
            <img 
              src={`https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80`} 
              alt={displayedParticipant.name}
              className="w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 px-6 relative overflow-hidden">
            {/* Deep background glow */}
            <div className="absolute w-[80%] h-[80%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse" />
            
            <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-[3.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-7xl md:text-9xl font-black text-white shadow-[0_0_70px_rgba(79,70,229,0.3)] transition-all duration-500 ${isSpeaking && !isMuted ? 'scale-110 shadow-indigo-500/60' : 'scale-100'}`}>
              {displayedParticipant.name[0].toUpperCase()}
              
              {/* Talking Ring */}
              {isSpeaking && !isMuted && (
                <div className="absolute -inset-4 border-4 border-indigo-400/30 rounded-[4rem] animate-ping" />
              )}
            </div>
            
            <div className="mt-12 text-center space-y-2 animate-fadeIn">
              <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase">{displayedParticipant.name}</h1>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em]">{displayedParticipant.role === Role.TEACHER ? 'Session Host' : 'Active Participant'}</p>
            </div>
          </div>
        )}

        {/* HUD Info */}
        <div className="absolute bottom-10 left-10 z-20 pointer-events-none">
          <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
            <div className={`w-3 h-3 rounded-full shadow-lg ${isMuted ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
            <div className="flex flex-col">
              <span className="text-white font-black text-base tracking-tight leading-none mb-1">{displayedParticipant.name}</span>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{displayedParticipant.role}</span>
            </div>
          </div>
        </div>

        {/* Bottom Audio Pulse Visualization */}
        {!isMuted && isSpeaking && (
          <div className="absolute bottom-0 left-0 w-full h-32 z-10 pointer-events-none flex items-end justify-center px-12 pb-4">
             <div className="flex gap-1.5 h-full items-end justify-center w-full max-w-4xl">
                {[...Array(40)].map((_, i) => {
                  const variance = Math.sin(i * 0.3 + Date.now() * 0.01) * 0.2 + 0.8;
                  const power = audioLevel * 100 * variance;
                  return (
                    <div 
                      key={i} 
                      className="flex-1 bg-indigo-500/40 rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(5, power)}%`, opacity: Math.max(0.1, audioLevel) }}
                    />
                  );
                })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;