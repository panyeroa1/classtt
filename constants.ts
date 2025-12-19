
import { Language } from './types';

export const AUTO_LANGUAGE: Language = { code: 'auto', name: 'Auto-detect' };

export const SUPPORTED_LANGUAGES: Language[] = [
  AUTO_LANGUAGE,
  
  // English Dialects
  { code: 'en-US', name: 'English (United States)' },
  { code: 'en-GB', name: 'English (United Kingdom)' },
  { code: 'en-AU', name: 'English (Australia)' },
  { code: 'en-CA', name: 'English (Canada)' },
  { code: 'en-IN', name: 'English (India)' },
  { code: 'en-NZ', name: 'English (New Zealand)' },
  { code: 'en-ZA', name: 'English (South Africa)' },
  { code: 'en-IE', name: 'English (Ireland)' },
  { code: 'en-SG', name: 'English (Singapore)' },
  { code: 'en-PH', name: 'English (Philippines)' },
  
  // Dutch & Flemish Regional Dialects
  { code: 'nl-NL', name: 'Dutch (Netherlands)' },
  { code: 'nl-BE', name: 'Dutch (Belgium / Flemish)' },
  { code: 'vls-BE', name: 'West Flemish (West-Vlaams)' },
  { code: 'vls-EF', name: 'East Flemish (Oost-Vlaams)' },
  { code: 'vls-AN', name: 'Antwerp Dialect (Antwerps)' },
  { code: 'vls-BR', name: 'Brabantian (Brabants)' },
  { code: 'li-LI', name: 'Limburgish (Limburgs)' },
  { code: 'nl-SR', name: 'Dutch (Suriname)' },

  // Spanish Dialects
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'es-AR', name: 'Spanish (Argentina)' },
  { code: 'es-CO', name: 'Spanish (Colombia)' },
  { code: 'es-CL', name: 'Spanish (Chile)' },
  { code: 'es-PE', name: 'Spanish (Peru)' },
  { code: 'es-VE', name: 'Spanish (Venezuela)' },
  { code: 'es-CU', name: 'Spanish (Cuba)' },
  { code: 'es-US', name: 'Spanish (United States)' },

  // French Dialects
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'fr-CA', name: 'French (Canada)' },
  { code: 'fr-BE', name: 'French (Belgium)' },
  { code: 'fr-CH', name: 'French (Switzerland)' },
  { code: 'fr-WA', name: 'French (West Africa)' },
  { code: 'fr-MA', name: 'French (Maghreb)' },

  // German Dialects
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'de-AT', name: 'German (Austria)' },
  { code: 'de-CH', name: 'German (Switzerland / Schwiizertüütsch)' },
  { code: 'de-BA', name: 'German (Bavarian / Boarisch)' },

  // Portuguese Dialects
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
  { code: 'pt-AO', name: 'Portuguese (Angola)' },

  // Chinese Dialects
  { code: 'zh-CN', name: 'Chinese (Mandarin Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Mandarin Traditional)' },
  { code: 'zh-HK', name: 'Chinese (Cantonese / Hong Kong)' },
  { code: 'zh-GD', name: 'Chinese (Cantonese / Guangdong)' },
  { code: 'zh-NAN', name: 'Chinese (Hokkien / Taiwanese)' },
  { code: 'zh-WU', name: 'Chinese (Shanghainese)' },

  // Arabic Dialects
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia / MSA)' },
  { code: 'ar-EG', name: 'Arabic (Egypt / Egyptian)' },
  { code: 'ar-LEV', name: 'Arabic (Levantine / Lebanon, Syria, Jordan)' },
  { code: 'ar-GUL', name: 'Arabic (Gulf / UAE, Kuwait, Qatar)' },
  { code: 'ar-MAG', name: 'Arabic (Maghrebi / Morocco, Algeria, Tunisia)' },
  { code: 'ar-IRQ', name: 'Arabic (Iraqi)' },

  // Italian Dialects
  { code: 'it-IT', name: 'Italian (Standard)' },
  { code: 'it-SC', name: 'Italian (Sicilian)' },
  { code: 'it-NA', name: 'Italian (Neapolitan)' },
  { code: 'it-VN', name: 'Italian (Venetian)' },

  // Other Major Languages & Dialects
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'bn-BD', name: 'Bengali' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'tr-TR', name: 'Turkish' },
  { code: 'vi-VN', name: 'Vietnamese' },
  { code: 'th-TH', name: 'Thai' },
  { code: 'id-ID', name: 'Indonesian' },
  { code: 'ms-MY', name: 'Malay' },
  { code: 'fil-PH', name: 'Filipino (Tagalog)' },
  { code: 'pl-PL', name: 'Polish' },
  { code: 'uk-UA', name: 'Ukrainian' },
  { code: 'sv-SE', name: 'Swedish' },
  { code: 'no-NO', name: 'Norwegian' },
  { code: 'da-DK', name: 'Danish' },
  { code: 'fi-FI', name: 'Finnish' },
  { code: 'el-GR', name: 'Greek' },
  { code: 'he-IL', name: 'Hebrew' },
  { code: 'fa-IR', name: 'Persian' },
  { code: 'ur-PK', name: 'Urdu' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'ro-RO', name: 'Romanian' },
  { code: 'hu-HU', name: 'Hungarian' },
  { code: 'cs-CZ', name: 'Czech' },
  { code: 'sk-SK', name: 'Slovak' }
];

export const AUDIO_SAMPLE_RATE = 16000;
export const OUTPUT_SAMPLE_RATE = 24000;
