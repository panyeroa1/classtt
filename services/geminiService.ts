
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { AUDIO_SAMPLE_RATE, OUTPUT_SAMPLE_RATE } from '../constants';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export interface LiveSessionOptions {
  onTranscription: (text: string, isModel: boolean) => void;
  onInterrupted: () => void;
  onAudioOutput: (buffer: AudioBuffer) => void;
  sourceLang: string;
  targetLang: string;
  voiceName?: string;
  useTts: boolean;
}

export class GeminiLiveTranslator {
  private ai: GoogleGenAI;
  private session: any;
  private nextStartTime = 0;
  private outputAudioContext: AudioContext;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });
  }

  async connect(options: LiveSessionOptions) {
    const { onTranscription, onInterrupted, onAudioOutput, sourceLang, targetLang, voiceName = 'Kore', useTts } = options;

    if (!process.env.API_KEY) {
      console.warn('Eburon: Mission Critical API Key Missing.');
      return;
    }

    const isAutoDetect = sourceLang === 'Auto-detect';
    
    const systemInstruction = `
      You are a world-class real-time classroom translator with vision capabilities.
      ${isAutoDetect ? "Detect the speaker's language automatically." : `The speaker is using ${sourceLang}.`}
      Translate all spoken input into ${targetLang}.
      
      VISION CAPABILITIES:
      If image frames are sent, use them as context for your translation. 
      For example, if you see a slide about "Quantum Physics", ensure your terminology matches.
      
      CRITICAL RULES:
      1. Output ONLY the final translated text. 
      2. NEVER include tags like [Input Transcription], [Translation], or speaker IDs.
      3. Maintain an educational, clear, and authoritative tone.
      4. If the source language matches ${targetLang}, repeat the input exactly.
      5. Do not engage in conversation; strictly translate.
    `;

    try {
      this.session = await this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => console.log('Eburon Translator: Core Link Established'),
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              onTranscription(message.serverContent.outputTranscription.text, true);
            } else if (message.serverContent?.inputTranscription) {
              onTranscription(message.serverContent.inputTranscription.text, false);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && useTts) {
              if (this.outputAudioContext.state === 'closed') return;
              if (this.outputAudioContext.state === 'suspended') await this.outputAudioContext.resume();
              
              this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                this.outputAudioContext,
                OUTPUT_SAMPLE_RATE,
                1
              );
              onAudioOutput(audioBuffer);
            }

            if (message.serverContent?.interrupted) {
              onInterrupted();
              this.nextStartTime = 0;
            }
          },
          onerror: (e) => console.warn('Eburon Translator Error:', e),
          onclose: (e) => console.log('Eburon Translator: Offline', e),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });
      return this.session;
    } catch (err) {
      console.error('Eburon: Connection Matrix Failure:', err);
      return null;
    }
  }

  sendAudio(data: Float32Array) {
    if (!this.session) return;
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const pcmBlob: Blob = {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
    try {
      this.session.sendRealtimeInput({ media: pcmBlob });
    } catch (e) {}
  }

  sendVideoFrame(base64Data: string) {
    if (!this.session) return;
    try {
      this.session.sendRealtimeInput({
        media: { data: base64Data, mimeType: 'image/jpeg' }
      });
    } catch (e) {}
  }

  close() {
    if (this.session) {
      try { this.session.close(); } catch (e) {}
    }
    if (this.outputAudioContext && this.outputAudioContext.state !== 'closed') {
      this.outputAudioContext.close().catch(() => {});
    }
  }
}
