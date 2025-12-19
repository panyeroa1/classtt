
import React, { useEffect, useRef } from 'react';
import { Participant, Role } from '../types';

interface VideoGridProps {
  participants: Participant[];
  localIsMuted: boolean;
  localIsVideoOn: boolean;
  isSharingScreen: boolean;
  activeSpeakerId: string;
  audioLevel?: number;
  localVideoStream?: MediaStream | null;
  screenStream?: MediaStream | null;
}

const VideoGrid: React.FC<VideoGridProps> = ({ 
  participants, 
  localIsMuted, 
  localIsVideoOn, 
  isSharingScreen, 
  activeSpeakerId, 
  audioLevel = 0,
  localVideoStream,
  screenStream
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const host = participants.find(p => p.role === Role.TEACHER);
  const activeSpeaker = participants.find(p => p.id === activeSpeakerId);
  
  const isHostSpeaking = host && activeSpeakerId === host.id;
  const displayedParticipant = isHostSpeaking ? host : (host || activeSpeaker || participants.find(p => p.id === 'me') || participants[0]);

  useEffect(() => {
    if (videoRef.current) {
      if (isSharingScreen && screenStream) {
        videoRef.current.srcObject = screenStream;
      } else if (localIsVideoOn && localVideoStream && displayedParticipant?.id === 'me') {
        videoRef.current.srcObject = localVideoStream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [isSharingScreen, screenStream, localIsVideoOn, localVideoStream, displayedParticipant]);

  if (!displayedParticipant) return null;

  const isMe = displayedParticipant.id === 'me';
  const isVideoOn = isMe ? localIsVideoOn : displayedParticipant.isVideoOn;
  const isMuted = isMe ? localIsMuted : displayedParticipant.isMuted;
  const isSpeaking = activeSpeakerId === displayedParticipant.id;
  const isHost = displayedParticipant.role === Role.TEACHER;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 overflow-hidden relative">
      <div className={`relative w-full h-full transition-all duration-700 overflow-hidden flex items-center justify-center`}>
        
        {isVideoOn || (isSharingScreen && isMe) ? (
          <div className="relative w-full h-full animate-fadeIn bg-black flex items-center justify-center">
            <video 
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
            {isSharingScreen && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl">
                Presenting Mode Active
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 px-6 relative overflow-hidden text-center">
            <div className="absolute w-[60%] h-[60%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse" />
            
            <div className="relative z-10 animate-fadeIn">
              {isHost ? (
                <h1 className="text-zinc-100 text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none select-none opacity-90 drop-shadow-2xl">
                  {displayedParticipant.name}
                </h1>
              ) : (
                <div className={`w-48 h-48 md:w-64 md:h-64 rounded-[3.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-7xl md:text-9xl font-black text-white shadow-[0_0_70px_rgba(79,70,229,0.3)] transition-all duration-500 ${isSpeaking && !isMuted ? 'scale-110' : 'scale-100'}`}>
                  {displayedParticipant.name[0].toUpperCase()}
                </div>
              )}
              
              {!isHost && (
                <div className="mt-12 space-y-2">
                  <h2 className="text-white text-4xl md:text-5xl font-black tracking-tighter uppercase">{displayedParticipant.name}</h2>
                  <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em]">Active Speaker</p>
                </div>
              )}
            </div>
            
            {isHost && isSpeaking && !isMuted && (
              <div className="absolute bottom-20 left-0 w-full flex justify-center">
                <div className="flex gap-2 h-8 items-end">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="w-1.5 bg-indigo-500/50 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 150}ms` }} />
                   ))}
                </div>
              </div>
            )}
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
      </div>
    </div>
  );
};

export default VideoGrid;
