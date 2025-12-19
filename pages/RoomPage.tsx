
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
  
  // Audio Pipeline Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const screenAudioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  
  const isDuckingRef = useRef(false);
  const currentSpeechSourceId = useRef<string>('me');
  const screenStreamRef = useRef<MediaStream | null>(null);
  const sessionId = useRef(`session-${Date.now()}`);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  // Unified Audio Cleanup
  const cleanupAudio = useCallback(() => {
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }
    if (screenAudioSourceRef.current) {
      screenAudioSourceRef.current.disconnect();
      screenAudioSourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
  }, []);

  const startSession = useCallback(async () => {
    if (translatorRef.current) {
      translatorRef.current.close();
    }
    
    const translator = new GeminiLiveTranslator();
    translatorRef.current = translator;

    try {
      // Initialize Context if not exists
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: AUDIO_SAMPLE_RATE });
        
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = scriptProcessor;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVisualizer = () => {
          if (analyserRef.current && audioContextRef.current?.state !== 'closed') {
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

        // Base pipeline connection
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContextRef.current.destination);
      }

      // Initialize Mic Source
      if (!micSourceRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        micSourceRef.current = source;
        source.connect(analyserRef.current!);
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
          
          // Clean text from internal tags if any leak
          const cleanText = text.replace(/\[.*?\]/g, '').trim();
          if (!cleanText) return;

          setActiveSpeakerId(sourceId);

          setTranscripts(prev => {
            const last = prev[prev.length - 1];
            const now = Date.now();
            
            if (isModel) {
              if (last && last.participantId === sourceId && (!last.translatedText || last.translatedText === '...')) {
                const updated = [...prev];
                updated[updated.length - 1] = { ...last, translatedText: cleanText };
                
                saveTranscriptToSupabase({
                  session_id: sessionId.current,
                  speaker_name: speaker.name,
                  speaker_role: speaker.role,
                  original_text: last.originalText,
                  translated_text: cleanText,
                  timestamp: new Date(now).toISOString()
                });

                return updated;
              }
            } else {
              // Append to last if within 4s and same speaker
              if (last && last.participantId === sourceId && now - last.timestamp < 4000 && !last.translatedText) {
                 const updated = [...prev];
                 updated[updated.length - 1] = { ...last, originalText: last.originalText + ' ' + cleanText };
                 return updated;
              }
              // Create new chunk with current speaker identity
              return [...prev, { 
                id: now.toString(), 
                participantId: speaker.id, 
                participantName: speaker.name, 
                participantRole: speaker.role, 
                originalText: cleanText, 
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
      cleanupAudio();
    };
  }, [startSession, cleanupAudio]);

  const handleLeave = () => {
    onExit(transcripts);
    cleanupAudio();
    navigate('/transcript');
  };
  
  const toggleShareScreen = async () => {
    if (!isSharingScreen) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: { cursor: "always" },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: AUDIO_SAMPLE_RATE
          }
        } as any);
        
        screenStreamRef.current = stream;

        if (stream.getAudioTracks().length > 0 && audioContextRef.current && analyserRef.current) {
          const screenAudioSource = audioContextRef.current.createMediaStreamSource(stream);
          screenAudioSourceRef.current = screenAudioSource;
          screenAudioSource.connect(analyserRef.current);
        }

        stream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
        setIsSharingScreen(true);
      } catch (e: any) {
        console.warn('Screen share failed:', e);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenAudioSourceRef.current) {
      screenAudioSourceRef.current.disconnect();
      screenAudioSourceRef.current = null;
    }
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current = null;
    setIsSharingScreen(false);
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
