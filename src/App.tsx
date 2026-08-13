import { useState, useEffect } from 'react';
import { TypebotConfig, LeadData, StepStage } from './types';
import { DEFAULT_CONFIG } from './data/typebotFlow';
import { TypebotHeader } from './components/TypebotHeader';
import { TypebotChat } from './components/TypebotChat';
import { AdminPanel } from './components/AdminPanel';
import { DeviceSimulator } from './components/DeviceSimulator';

export default function App() {
  // Config state initialized with localStorage fallback
  const [config, setConfig] = useState<TypebotConfig>(() => {
    try {
      const saved = localStorage.getItem('typebot_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          whatsappNumber: '5586981280344',
          customMessageTemplate: 'Oi! Vim pelo atendimento e quero saber mais.',
          brandName: 'F.A STORE',
          brandLogoUrl: DEFAULT_CONFIG.brandLogoUrl,
          watchImageUrl: DEFAULT_CONFIG.watchImageUrl,
        };
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_CONFIG;
  });

  // Leads tracking
  const [leads, setLeads] = useState<LeadData[]>(() => {
    try {
      const saved = localStorage.getItem('typebot_leads');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // UI state
  const [stage, setStage] = useState<StepStage>('start');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(config.soundEnabled);
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [restartKey, setRestartKey] = useState<number>(0);

  // Sync config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('typebot_config', JSON.stringify(config));
    } catch {
      // Ignore
    }
  }, [config]);

  // Sync leads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('typebot_leads', JSON.stringify(leads));
    } catch {
      // Ignore
    }
  }, [leads]);

  // Lead update callback from TypebotChat
  const handleLeadUpdate = (updatedLead: LeadData) => {
    setLeads((prev) => {
      const existingIdx = prev.findIndex((l) => l.id === updatedLead.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedLead;
        return copy;
      }
      return [updatedLead, ...prev];
    });
  };

  const handleRestart = () => {
    setRestartKey((k) => k + 1);
  };

  const handleClearLeads = () => {
    setLeads([]);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-stone-50/80 text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white flex flex-col items-center">
      <DeviceSimulator isMobileFrame={isMobileDeviceFrame}>
        {/* Typebot Header */}
        <TypebotHeader
          config={config}
          stage={stage}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onRestart={handleRestart}
          onOpenAdmin={() => setIsAdminOpen(true)}
          isMobileDeviceFrame={isMobileDeviceFrame}
          onToggleFrame={() => setIsMobileDeviceFrame((prev) => !prev)}
        />

        {/* Main Typebot Chat Experience */}
        <main className="w-full flex-1 flex flex-col justify-between">
          <TypebotChat
            key={restartKey}
            config={config}
            onStageChange={setStage}
            onLeadUpdate={handleLeadUpdate}
            soundEnabled={soundEnabled}
            restartKey={restartKey}
          />
        </main>
      </DeviceSimulator>

      {/* Admin / Config Drawer */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        leads={leads}
        onClearLeads={handleClearLeads}
      />
    </div>
  );
}
