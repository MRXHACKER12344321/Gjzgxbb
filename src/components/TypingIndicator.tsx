import React from 'react';
import { motion } from 'motion/react';

interface TypingIndicatorProps {
  avatar?: string;
  brandLogoUrl?: string;
  botName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  avatar = '⌚',
  brandLogoUrl,
  botName = 'F.A STORE',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-start space-x-2.5 my-2 max-w-[85%]"
    >
      {brandLogoUrl ? (
        <img
          src={brandLogoUrl}
          alt={botName}
          className="w-8 h-8 rounded-full object-cover shrink-0 shadow-xs border border-stone-800"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs font-semibold flex items-center justify-center shrink-0 shadow-sm border border-stone-800">
          {avatar}
        </div>
      )}
      <div className="bg-white border border-stone-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
        <div className="text-[10px] font-medium text-stone-400 mb-1">{botName}</div>
        <div className="flex items-center space-x-1.5 h-4">
          <motion.span
            className="w-1.5 h-1.5 bg-stone-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="w-1.5 h-1.5 bg-stone-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: 0.2, ease: 'easeInOut' }}
          />
          <motion.span
            className="w-1.5 h-1.5 bg-stone-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};
