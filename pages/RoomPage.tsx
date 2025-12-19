
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, SessionType, Language, Participant, TranscriptChunk, ChatMessage } from '../types';
import { GeminiLiveTranslator } from '../services/geminiService';
import { saveTranscriptToSupabase } from '../services/supabaseService';
import ControlBar from '../components/ControlBar';
import VideoGrid from '../components/VideoGrid';
import CaptionsPanel from '../components/CaptionsPanel';
import SidePanel from '../components/SidePanel';
import { AUDIO_SAMPLE_RATE } from '../constants';

interface RoomPageProps {
  userName: string;
  role: Role;
  sessionType: SessionType;
  sourceLang: Language;
  targetLang: Language;
  voiceName: string;
  onExit: (transcripts: TranscriptChunk[]) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  showCaptions: boolean;
  setShowCaptions: (v: boolean) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  setTargetLang: (l: Language) => void;
}

const RoomPage: React.FC<RoomPageProps> = ({ 
  userName, role, sessionType, sourceLang, targetLang, voiceName, onExit, isDarkMode, toggleDarkMode,
  showCaptions, setShowCaptions, showLabels, setShowLabels, setTargetLang
}) => {
  const navigate = useNavigate();
  
  const initialMe: Participant = {
    id: 'me',
    name: userName || 'Anonymous',
    role: role,
    isMuted: false,
    isVideoOn: true,
    handRaised: false,
    speakingLanguage: sourceLang.name,
    listeningLanguage: targetLang.name
  };

  const [participants, setParticipants] = useState<Participant[]>([initialMe]);
  const participantsRef = useRef<Participant[]>([initialMe]);
  const [transcripts, setTranscripts] = useState<TranscriptChunk[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isSharingAudio, setIsSharingAudio] = useState(true);
  const [activeTab, setActiveTab] = useState<'participants' | 'chat'>('participants');
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('me');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const translatorRef = useRef<GeminiLiveTranslator | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const isDuckingRef = useRef(false);
  const currentSpeechSourceId = useRef<string>('me');
  const screenStreamRef = useRef<MediaStream | null>(null);
  const sessionId = useRef(`session-${Date.now()}`);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  const startSession = useCallback(async () => {
    if (translatorRef.current) {
      translatorRef.current.close();
    }
    
    const translator = new GeminiLiveTranslator();
    translatorRef.current = translator;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: AUDIO_SAMPLE_RATE });
        inputAudioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVisualizer = () => {
          if (analyserRef.current && inputAudioContextRef.current?.state !== 'closed') {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average / 128);
            requestAnimationFrame(updateVisualizer);
          }
        };
        updateVisualizer();

        scriptProcessor.onaudioprocess = (e) => {
          if (isDuckingRef.current || isMuted) return;
          const inputData = e.inputBuffer.getChannelData(0);
          translatorRef.current?.sendAudio(inputData);
        };

        source.connect(analyser);
        source.connect(scriptProcessor);
        scriptProcessor.connect(ctx.destination);
      }

      await translator.connect({
        sourceLang: sourceLang.name,
        targetLang: targetLang.name,
        voiceName: voiceName,
        useTts: true,
        onTranscription: (text, isModel) => {
          const sourceId = currentSpeechSourceId.current;
          const curParticipants = participantsRef.current;
          const speaker = curParticipants.find(p => p.id === sourceId) || curParticipants[0];
          
          if (!speaker) return;
          if (text.trim().length > 0) setActiveSpeakerId(sourceId);

          setTranscripts(prev => {
            const last = prev[prev.length - 1];
            const now = Date.now();
            
            if (isModel) {
              // Handle translation result from AI
              if (last && last.participantId === sourceId && (!last.translatedText || last.translatedText === '...')) {
                const updated = [...prev];
                updated[updated.length - 1] = { ...last, translatedText: text };
                
                // Sync to external repository with full speaker metadata
                saveTranscriptToSupabase({
                  session_id: sessionId.current,
                  speaker_name: speaker.name,
                  speaker_role: speaker.role,
                  original_text: last.originalText,
                  translated_text: text,
                  timestamp: new Date(now).toISOString()
                });

                return updated;
              }
            } else {
              // Handle original transcription from user
              // If the speaker is the same and time gap is small, append to the current chunk
              if (last && last.participantId === sourceId && now - last.timestamp < 4000 && !last.translatedText) {
                 const updated = [...prev];
                 updated[updated.length - 1] = { ...last, originalText: last.originalText + ' ' + text };
                 return updated;
              }
              // Create a new distinct transcript chunk
              return [...prev, { 
                id: now.toString(), 
                participantId: speaker.id, 
                participantName: speaker.name, 
                participantRole: speaker.role, 
                originalText: text, 
                translatedText: '', 
                timestamp: now 
              }];
            }
            return prev;
          });
        },
        onInterrupted: () => { isDuckingRef.current = false; },
        onAudioOutput: (buffer) => {
          if (currentSpeechSourceId.current === 'me') return;
          isDuckingRef.current = true;
          const playCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          const sourceNode = playCtx.createBufferSource();
          sourceNode.buffer = buffer;
          sourceNode.connect(playCtx.destination);
          sourceNode.onended = () => { isDuckingRef.current = false; playCtx.close(); };
          sourceNode.start();
        }
      });
    } catch (err) {
      console.error('Session establishment failed:', err);
    }
  }, [sourceLang.name, targetLang.name, voiceName, isMuted]);

  useEffect(() => {
    startSession();
    return () => {
      translatorRef.current?.close();
    };
  }, [startSession]);

  const handleLeave = () => {
    onExit(transcripts);
    navigate('/transcript');
  };
  
  const toggleShareScreen = async () => {
    if (!isSharingScreen) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: isSharingAudio
        });
        screenStreamRef.current = stream;
        stream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          screenStreamRef.current = null;
        };
        setIsSharingScreen(true);
      } catch (e: any) {
        console.warn('Screen share failed:', e);
      }
    } else {
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
      setIsSharingScreen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black transition-colors duration-300 overflow-hidden">
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
          <VideoGrid 
            participants={participants} 
            localIsMuted={isMuted} 
            localIsVideoOn={isVideoOn} 
            isSharingScreen={isSharingScreen}
            activeSpeakerId={activeSpeakerId}
            audioLevel={audioLevel}
          />
          
          {showCaptions && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-10 pointer-events-none">
              <CaptionsPanel transcripts={transcripts} targetLang={targetLang} />
            </div>
          )}
        </div>

        {isSidebarOpen && (
          <div className="w-80 h-full border-l border-white/10 bg-zinc-950 flex flex-col transition-all animate-fadeIn shrink-0">
            <SidePanel 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              participants={participants}
              messages={messages}
              onSendMessage={(text) => setMessages(prev => [...prev, { id: Date.now().toString(), senderId: 'me', senderName: userName, text, timestamp: Date.now() }])}
              onClose={() => setIsSidebarOpen(false)}
              activeSpeakerId={activeSpeakerId}
            />
          </div>
        )}
      </div>

      <ControlBar 
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        isSharingScreen={isSharingScreen}
        isSharingAudio={isSharingAudio}
        onToggleAudioShare={() => setIsSharingAudio(!isSharingAudio)}
        onMute={() => setIsMuted(!isMuted)}
        onVideo={() => setIsVideoOn(!isVideoOn)}
        onShareScreen={toggleShareScreen}
        onLeave={handleLeave}
        role={role}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        showCaptions={showCaptions}
        onToggleCaptions={() => setShowCaptions(!showCaptions)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(!showLabels)}
        targetLang={targetLang}
        setTargetLang={setTargetLang}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  );
};

export default RoomPage;
