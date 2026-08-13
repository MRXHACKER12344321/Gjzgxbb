import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceSimulatorProps {
  isMobileFrame: boolean;
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  isMobileFrame,
  children,
}) => {
  if (!isMobileFrame) {
    return <div className="w-full min-h-[100dvh] flex flex-col items-center bg-stone-50/60">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-stone-900/90 py-6 sm:py-10 px-2 flex items-center justify-center">
      {/* Smartphone Outer Frame */}
      <div className="w-full max-w-[430px] bg-stone-950 rounded-[44px] p-3 shadow-2xl border-4 border-stone-800/80 relative">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-900 rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-stone-950 rounded-full mr-2" />
          <div className="w-2 h-2 bg-blue-900/40 rounded-full" />
        </div>

        {/* Screen Content Container */}
        <div className="bg-stone-50 rounded-[34px] overflow-hidden flex flex-col min-h-[780px] max-h-[840px] relative border border-stone-200/50">
          {/* Mobile Status Bar */}
          <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-stone-900 z-40 bg-white/80 backdrop-blur-xs select-none">
            <span>09:41</span>
            <div className="flex items-center space-x-1.5">
              <Signal className="w-3 h-3 text-stone-800" />
              <Wifi className="w-3 h-3 text-stone-800" />
              <Battery className="w-3.5 h-3.5 text-stone-800" />
            </div>
          </div>

          {/* Children Viewport */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {children}
          </div>

          {/* iOS Bottom Indicator */}
          <div className="w-full py-2 bg-white flex justify-center shrink-0 border-t border-stone-100">
            <div className="w-32 h-1 bg-stone-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
