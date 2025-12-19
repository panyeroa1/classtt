
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '../constants';
import { GeminiLiveTranslator } from '../services/geminiService';
import { AUDIO_SAMPLE_RATE } from '../constants';

interface TestSuitePageProps {
  voiceName: string;
}

const TestSuitePage: React.FC<TestSuitePageProps> = ({ voiceName }) => {
  const navigate = useNavigate();
  const [targetLang, setTargetLang] = useState(SUPPORTED_LANGUAGES[1]); // Default to English US
  const [isTesting, setIsTesting] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  
  const translatorRef = useRef<GeminiLiveTranslator | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isDuckingRef = useRef(false);

  const startTest = async () => {
    if (isTesting) {
      stopTest();
      return;
    }

    try {
      const translator = new GeminiLiveTranslator();
      translatorRef.current = translator;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: AUDIO_SAMPLE_RATE });
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaStreamSource(stream);
      const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyser || ctx.state === 'closed') return;
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(avg / 128);
        if (isTesting) requestAnimationFrame(updateLevel);
      };
      updateLevel();

      scriptProcessor.onaudioprocess = (e) => {
        if (isDuckingRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        translator.sendAudio(inputData);
      };

      source.connect(analyser);
      source.connect(scriptProcessor);
      scriptProcessor.connect(ctx.destination);

      await translator.connect({
        sourceLang: 'Auto-detect',
        targetLang: targetLang.name,
        voiceName: voiceName,
        useTts: true,
        onTranscription: (text, isModel) => {
          if (isModel) setTranslatedText(text);
          else setOriginalText(text);
        },
        onInterrupted: () => { isDuckingRef.current = false; },
        onAudioOutput: (buffer) => {
          isDuckingRef.current = true;
          const playCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          const sourceNode = playCtx.createBufferSource();
          sourceNode.buffer = buffer;
          sourceNode.connect(playCtx.destination);
          sourceNode.onended = () => { 
            isDuckingRef.current = false; 
            playCtx.close(); 
          };
          sourceNode.start();
        }
      });

      setIsTesting(true);
    } catch (err) {
      console.error('Test Suite failure:', err);
    }
  };

  const stopTest = () => {
    setIsTesting(false);
    translatorRef.current?.close();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setAudioLevel(0);
    setOriginalText('');
    setTranslatedText('');
  };

  useEffect(() => {
    return () => stopTest();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-zinc-950 p-6 md:p-12 overflow-y-auto min-h-screen">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Diagnostic Laboratory</div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-zinc-100 tracking-tighter">Acoustic Test Suite</h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-indigo-600 shadow-xl flex items-center justify-center transition-all hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls Card */}
          <div className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-xl space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest block ml-1">Target Frequency (Listen In)</label>
              <select 
                className="w-full bg-slate-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 font-black text-sm text-slate-800 dark:text-zinc-100 appearance-none shadow-sm cursor-pointer transition-all"
                value={targetLang.code}
                onChange={(e) => setTargetLang(SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!)}
                disabled={isTesting}
              >
                {SUPPORTED_LANGUAGES.filter(l => l.code !== 'auto').map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={startTest}
              className={`w-full py-8 rounded-[2rem] font-black text-xl tracking-tighter uppercase transition-all duration-500 shadow-2xl flex flex-col items-center justify-center gap-2 ${
                isTesting 
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
              }`}
            >
              <span className="text-3xl">{isTesting ? '⏹️' : '🎙️'}</span>
              <span>{isTesting ? 'Terminate Loopback' : 'Initiate Audio Test'}</span>
            </button>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Microphone Pressure</span>
                <span>{(audioLevel * 100).toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-1 p-1">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-100 ${i < audioLevel * 20 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-700 opacity-20'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Results Feed */}
          <div className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-xl space-y-8 flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Original Signal</span>
                <div className="p-6 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl border border-slate-100 dark:border-zinc-800 min-h-[100px] text-slate-500 italic font-bold">
                  {originalText || "Awaiting acoustic input..."}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Synthesized Translation</span>
                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/20 min-h-[100px] text-slate-900 dark:text-zinc-100 font-black text-xl">
                  {translatedText || (isTesting ? "Processing..." : "Select language and speak.")}
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
               <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 leading-relaxed uppercase">
                 <span className="mr-2">💡</span>
                 Speak clearly into your microphone. The AI will translate your voice and play it back in the target dialect to verify hardware compatibility and synthesis quality.
               </p>
            </div>
          </div>
        </div>

        <div className="text-center opacity-40">
           <p className="text-slate-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
             EBURON ACOUSTIC LABORATORY • HARDWARE VERSION 1.0.4-BETA
           </p>
        </div>
      </div>
    </div>
  );
};

export default TestSuitePage;
