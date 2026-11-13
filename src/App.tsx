import { useCallback, useState } from 'react';
import { ConversationStage } from './components/ConversationStage';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeStage } from './components/WelcomeStage';
import { useGeminiLive } from './hooks/useGeminiLive';
import type {
  AppScreen,
  CharacterRoleId,
  LanguageCode,
  VoiceName,
} from './types/voice';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('studio-home');
  const [selectedRoleId, setSelectedRoleId] =
    useState<CharacterRoleId>('narrator');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Zephyr');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');

  const live = useGeminiLive();

  const handleEnterStage = useCallback(() => {
    setScreen('welcome-stage');
    void live.connectAndWelcome(
      selectedVoice,
      selectedRoleId,
      selectedLanguage
    );
  }, [live, selectedLanguage, selectedRoleId, selectedVoice]);

  const handleStartConversation = useCallback(() => {
    live.beginConversationNow();
    setScreen('conversation-stage');
  }, [live]);

  const handleEndSession = useCallback(() => {
    live.stopSession();
    setScreen('studio-home');
  }, [live]);

  const handleRetryWelcome = useCallback(() => {
    void live.connectAndWelcome(
      selectedVoice,
      selectedRoleId,
      selectedLanguage
    );
  }, [live, selectedLanguage, selectedRoleId, selectedVoice]);

  if (screen === 'welcome-stage') {
    return (
      <WelcomeStage
        roleId={live.activeRoleId}
        languageCode={live.activeLanguage}
        orbState={live.orbState}
        outputLevel={live.outputLevel}
        connectionStatus={live.connectionStatus}
        welcomeText={live.welcomeText}
        welcomeFinished={live.welcomeFinished}
        error={live.error}
        onStartConversation={handleStartConversation}
        onBackToHome={handleEndSession}
        onRetry={handleRetryWelcome}
      />
    );
  }

  if (screen === 'conversation-stage') {
    return (
      <ConversationStage
        connectionStatus={live.connectionStatus}
        orbState={live.orbState}
        inputLevel={live.inputLevel}
        outputLevel={live.outputLevel}
        isMuted={live.isMuted}
        hasMicPermission={live.hasMicPermission}
        micError={live.micError}
        error={live.error}
        activeRoleId={live.activeRoleId}
        activeVoice={live.activeVoice}
        activeLanguage={live.activeLanguage}
        activeMood={live.activeMood}
        activeScriptCard={live.activeScriptCard}
        starCount={live.starCount}
        lastPraise={live.lastPraise}
        transcripts={live.transcripts}
        onToggleMute={live.toggleMute}
        onSendTextCommand={live.sendTextCommand}
        onSwitchRole={live.switchRole}
        onSwitchLanguage={live.switchLanguage}
        onCelebrate={() => live.triggerCheering('Bravo! Star take!')}
        onInterrupt={live.interruptPlayback}
        onReconnect={handleRetryWelcome}
        onEndSession={handleEndSession}
      />
    );
  }

  return (
    <SplashScreen
      selectedRoleId={selectedRoleId}
      selectedVoice={selectedVoice}
      selectedLanguage={selectedLanguage}
      onSelectRole={setSelectedRoleId}
      onSelectVoice={setSelectedVoice}
      onSelectLanguage={setSelectedLanguage}
      onEnterStage={handleEnterStage}
    />
  );
}
