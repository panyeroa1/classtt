
export enum Role {
  TEACHER = 'Teacher',
  CO_HOST = 'Co-Host',
  STUDENT = 'Student',
  OBSERVER = 'Observer'
}

export enum SessionType {
  LIVE_CLASS = 'Live Class',
  INTERACTIVE = 'Interactive'
}

export interface Participant {
  id: string;
  name: string;
  role: Role;
  isMuted: boolean;
  isVideoOn: boolean;
  handRaised: boolean;
  speakingLanguage: string;
  listeningLanguage: string;
}

export interface TranscriptChunk {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: Role;
  originalText: string;
  translatedText: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Language {
  code: string;
  name: string;
}
