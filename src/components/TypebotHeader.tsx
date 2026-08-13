import React from 'react';
import { RotateCcw } from 'lucide-react';
import { StepStage, TypebotConfig } from '../types';

interface TypebotHeaderProps {
  config: TypebotConfig;
  stage: StepStage;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenAdmin: () => void;
  isMobileDeviceFrame: boolean;
  onToggleFrame: () => void;
}

export const TypebotHeader: React.FC<TypebotHeaderProps> = ({
  config,
  stage,
  soundEnabled,
  onToggleSound,
  onRestart,
  onOpenAdmin,
  isMobileDeviceFrame,
  onToggleFrame,
}) => {
  // Compute progress percentage
  const progressMap: Record<StepStage, number> = {
    start: 20,
    name: 40,
    interest: 60,
    transition: 85,
    cta: 100,
  };

  const progress = progressMap[stage] || 20;

  return (
    <header className="w-full sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-xs">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            {config.brandLogoUrl ? (
              <img
                src={config.brandLogoUrl}
                alt="F.A STORE"
                className="w-10 h-10 rounded-full object-cover shadow-xs border border-stone-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white text-base font-semibold flex items-center justify-center shadow-xs">
                {config.brandAvatar}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-stone-900 tracking-wider">
                {config.brandName && config.brandName !== 'Relógio Digital' ? config.brandName : 'F.A STORE'}
              </h1>
            </div>
            <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Atendimento Oficial
            </p>
          </div>
        </div>

        {/* Action Controls - Only Restart/Refresh Button */}
        <div className="flex items-center space-x-1">
          {/* Restart Chat */}
          <button
            onClick={onRestart}
            title="Reiniciar Conversa"
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtle Progress Bar */}
      <div className="w-full bg-stone-100 h-1 overflow-hidden">
        <div
          className="bg-stone-900 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
};
