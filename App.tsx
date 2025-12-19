
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PreJoinPage from './pages/PreJoinPage';
import RoomPage from './pages/RoomPage';
import TranscriptPage from './pages/TranscriptPage';
import SettingsPage from './pages/SettingsPage';
import TestSuitePage from './pages/TestSuitePage';
import { Role, SessionType, Language, TranscriptChunk } from './types';
import { SUPPORTED_LANGUAGES } from './constants';

const App: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [sessionType, setSessionType] = useState<SessionType>(SessionType.LIVE_CLASS);
  const [sourceLang, setSourceLang] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [targetLang, setTargetLang] = useState<Language>(SUPPORTED_LANGUAGES[1]); // Default to English US
  const [voiceName, setVoiceName] = useState('Kore'); // Default voice
  const [transcripts, setTranscripts] = useState<TranscriptChunk[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  
  // UI Preferences
  const [showCaptions, setShowCaptions] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleJoin = (name: string, r: Role, st: SessionType, sl: Language, tl: Language) => {
    setUserName(name);
    setRole(r);
    setSessionType(st);
    setSourceLang(sl);
    setTargetLang(tl);
  };

  const handleRoomExit = (finalTranscripts: TranscriptChunk[]) => {
    setTranscripts(finalTranscripts);
  };

  const handleLogout = () => {
    setUserName('');
    setTranscripts([]);
  };

  return (
    <HashRouter>
      <div className="h-full w-full bg-inherit text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 overflow-hidden">
        <Routes>
          <Route path="/" element={<LandingPage onJoin={handleJoin} isDarkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/prejoin" element={userName ? <PreJoinPage /> : <Navigate to="/" />} />
          <Route path="/room" element={
            userName ? (
              <RoomPage 
                userName={userName} 
                role={role} 
                sessionType={sessionType}
                sourceLang={sourceLang}
                targetLang={targetLang}
                voiceName={voiceName}
                onExit={handleRoomExit}
                isDarkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                showCaptions={showCaptions}
                setShowCaptions={setShowCaptions}
                showLabels={showLabels}
                setShowLabels={setShowLabels}
                setTargetLang={setTargetLang}
              />
            ) : <Navigate to="/" />
          } />
          <Route path="/transcript" element={<TranscriptPage transcripts={transcripts} isDarkMode={darkMode} onReset={handleLogout} />} />
          <Route path="/settings" element={
            <SettingsPage 
              sourceLang={sourceLang} 
              setSourceLang={setSourceLang} 
              targetLang={targetLang} 
              setTargetLang={setTargetLang}
              voiceName={voiceName}
              setVoiceName={setVoiceName}
            />
          } />
          <Route path="/testsuite" element={<TestSuitePage voiceName={voiceName} />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
