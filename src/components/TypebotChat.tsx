import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowRight, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { StepStage, TypebotConfig, InterestOption, LeadData } from '../types';
import { INTEREST_OPTIONS, buildWhatsAppUrl } from '../data/typebotFlow';
import { TypingIndicator } from './TypingIndicator';
import { sounds } from '../utils/audio';

interface TypebotChatProps {
  config: TypebotConfig;
  onStageChange: (stage: StepStage) => void;
  onLeadUpdate: (lead: LeadData) => void;
  soundEnabled: boolean;
  restartKey: number;
}

interface ChatItem {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  hasProductImage?: boolean;
}

export const TypebotChat: React.FC<TypebotChatProps> = ({
  config,
  onStageChange,
  onLeadUpdate,
  soundEnabled,
  restartKey,
}) => {
  const [stage, setStage] = useState<StepStage>('start');
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Form State
  const [userName, setUserName] = useState<string>('');
  const [selectedInterest, setSelectedInterest] = useState<InterestOption | null>(null);
  const [interestLabel, setInterestLabel] = useState<string>('');
  const [leadId] = useState<string>(() => `lead_${Date.now()}`);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll helper
  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Sync stage to parent
  useEffect(() => {
    onStageChange(stage);
  }, [stage, onStageChange]);

  // Stage 1 Initialization
  useEffect(() => {
    // Reset internal state when restartKey changes
    setStage('start');
    setUserName('');
    setSelectedInterest(null);
    setInterestLabel('');
    setMessages([]);
    setIsTyping(true);

    // Initial bot greetings with typing indicator delay
    const timer1 = setTimeout(() => {
      setMessages([
        { id: 'm1', sender: 'bot', text: '👋 Oi! Seja bem-vindo(a) à F.A STORE!' },
      ]);
      sounds.playPop(soundEnabled);
      setIsTyping(true);

      const timer2 = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 'm2',
            sender: 'bot',
            text: 'Vi que você se interessou pelo nosso smartwatch.\n\nVou te mostrar como funciona de forma bem rápida!',
            hasProductImage: true,
          },
          {
            id: 'm3',
            sender: 'bot',
            text: 'Para continuar, clique em COMEÇAR abaixo 👇',
          },
        ]);
        sounds.playPop(soundEnabled);
        setIsTyping(false);
        scrollToBottom();
      }, 1200);

      return () => clearTimeout(timer2);
    }, 600);

    return () => clearTimeout(timer1);
  }, [restartKey, soundEnabled]);

  // Handle Stage 1 Start Button Click
  const handleStart = () => {
    sounds.playPop(soundEnabled);
    setMessages((prev) => [
      ...prev,
      { id: `u_start_${Date.now()}`, sender: 'user', text: 'COMEÇAR →' },
    ]);
    setStage('name');
    setIsTyping(true);
    scrollToBottom();

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `m_name_${Date.now()}`, sender: 'bot', text: 'Primeiro, como posso te chamar?' },
      ]);
      sounds.playPop(soundEnabled);
      setIsTyping(false);
      scrollToBottom();

      // Focus name input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }, 1000);
  };

  // Handle Stage 2 Name Submit
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = userName.trim();
    if (!trimmedName) return;

    sounds.playPop(soundEnabled);

    // User message
    setMessages((prev) => [
      ...prev,
      { id: `u_name_${Date.now()}`, sender: 'user', text: trimmedName },
    ]);

    setStage('interest');
    setIsTyping(true);
    scrollToBottom();

    // Bot response after typing delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `m_welcome_${Date.now()}`, sender: 'bot', text: `Prazer, ${trimmedName}! 👋` },
      ]);
      sounds.playPop(soundEnabled);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `m_question_${Date.now()}`, sender: 'bot', text: 'O que você mais quer saber sobre o smartwatch?\n\nEscolha uma das opções abaixo 👇' },
        ]);
        sounds.playPop(soundEnabled);
        setIsTyping(false);
        scrollToBottom();
      }, 900);
    }, 800);

    // Update lead record
    onLeadUpdate({
      id: leadId,
      nome: trimmedName,
      interesse: null,
      interesseLabel: '',
      startedAt: new Date(),
      whatsappClicked: false,
    });
  };

  // Handle Stage 3 Interest Selection
  const handleSelectInterest = (optionId: InterestOption, optionLabel: string, optionFullText: string) => {
    sounds.playPop(soundEnabled);
    setSelectedInterest(optionId);
    setInterestLabel(optionFullText);

    // Add user response bubble
    setMessages((prev) => [
      ...prev,
      { id: `u_interest_${Date.now()}`, sender: 'user', text: optionLabel },
    ]);

    setStage('transition');
    setIsTyping(true);
    scrollToBottom();

    // Transition messages to Stage 4 & 5
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `m_gotit_${Date.now()}`, sender: 'bot', text: `Entendi, ${userName || 'amigo(a)'}! 👍` },
      ]);
      sounds.playPop(soundEnabled);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `m_trans1_${Date.now()}`,
            sender: 'bot',
            text: 'Como você quer saber mais sobre o smartwatch, vou te encaminhar para nosso atendimento.',
          },
        ]);
        sounds.playPop(soundEnabled);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `m_trans2_${Date.now()}`,
              sender: 'bot',
              text: 'Por lá, você poderá tirar suas dúvidas e receber as informações certinhas sobre o smartwatch.',
            },
            {
              id: `m_clickbelow_${Date.now()}`,
              sender: 'bot',
              text: 'É só clicar no botão abaixo 👇',
            },
          ]);
          sounds.playSuccess(soundEnabled);
          setIsTyping(false);
          setStage('cta');
          scrollToBottom();
        }, 1100);
      }, 900);
    }, 800);

    // Update lead data
    onLeadUpdate({
      id: leadId,
      nome: userName,
      interesse: optionId,
      interesseLabel: optionLabel,
      startedAt: new Date(),
      whatsappClicked: false,
    });
  };

  // Handle WhatsApp Button Click
  const handleWhatsAppClick = () => {
    sounds.playSuccess(soundEnabled);

    // Update lead status
    onLeadUpdate({
      id: leadId,
      nome: userName,
      interesse: selectedInterest,
      interesseLabel: interestLabel,
      startedAt: new Date(),
      completedAt: new Date(),
      whatsappClicked: true,
    });

    // Build URL and open
    const url = buildWhatsAppUrl(
      config.whatsappNumber,
      userName,
      interestLabel,
      config.customMessageTemplate
    );

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-md mx-auto px-3 sm:px-4 py-4 justify-between min-h-[calc(100dvh-64px)]">
      {/* Messages Feed */}
      <div className="space-y-3.5 pb-20">
        <AnimatePresence mode="sync">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex items-start space-x-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Bot Avatar */}
              {msg.sender === 'bot' && (
                <div className="shrink-0 mt-0.5">
                  {config.brandLogoUrl ? (
                    <img
                      src={config.brandLogoUrl}
                      alt={config.brandName}
                      className="w-8 h-8 rounded-full object-cover border border-stone-800 shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs font-semibold flex items-center justify-center shadow-xs border border-stone-800">
                      {config.brandAvatar}
                    </div>
                  )}
                </div>
              )}

              {/* Bubble Body */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white font-medium rounded-tr-xs'
                    : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs'
                }`}
              >
                {/* Bot Name Label */}
                {msg.sender === 'bot' && (
                  <div className="text-[10px] font-semibold text-stone-400 mb-1 tracking-tight">
                    {config.brandName}
                  </div>
                )}

                {/* Message Text with preserved whitespace linebreaks */}
                <p className="whitespace-pre-line text-sm">{msg.text}</p>

                {/* Product Image Placeholder Presentation on Stage 1 */}
                {msg.hasProductImage && config.watchImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="mt-2.5 pt-2 border-t border-stone-100 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-xs flex items-center justify-center p-1 group">
                      <img
                        src={config.watchImageUrl}
                        alt="Smartwatch S11 Mini"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-100 text-stone-800 text-[10px] font-semibold rounded-full border border-stone-200/80">
                        <Sparkles className="w-3 h-3 text-stone-800 shrink-0" />
                        F.A STORE — Estilo em cada detalhe
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Dynamic Typing Indicator */}
        {isTyping && (
          <TypingIndicator
            avatar={config.brandAvatar}
            brandLogoUrl={config.brandLogoUrl}
            botName={config.brandName}
          />
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Interactive Controls / Input Area according to Stage */}
      <div className="sticky bottom-2 sm:bottom-4 z-20 pt-2 pb-2 bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent backdrop-blur-xs">
        {/* STAGE 1 — COMEÇAR BUTTON */}
        {stage === 'start' && !isTyping && messages.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <button
              onClick={handleStart}
              className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-base font-semibold rounded-2xl shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group border border-stone-800"
            >
              <span>COMEÇAR</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              ⚡ Leva menos de 30 segundos
            </p>
          </motion.div>
        )}

        {/* STAGE 2 — NAME INPUT FORM */}
        {stage === 'name' && !isTyping && (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleNameSubmit}
            className="w-full"
          >
            <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-md flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Digite seu primeiro nome..."
                className="flex-1 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden bg-transparent"
                maxLength={30}
                required
              />
              <button
                type="submit"
                disabled={!userName.trim()}
                className="px-5 py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>Enviar</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        )}

        {/* STAGE 3 — QUALIFICATION OPTIONS */}
        {stage === 'interest' && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2.5"
          >
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectInterest(opt.id, opt.label, opt.fullText)}
                className="w-full p-4 bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-900 text-stone-900 text-sm font-semibold rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between text-left group"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </motion.div>
        )}

        {/* STAGE 5 — FINAL WHATSAPP CTA */}
        {stage === 'cta' && !isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full space-y-3"
          >
            <button
              onClick={handleWhatsAppClick}
              className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white text-base font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 border border-emerald-500/50 group"
            >
              <MessageCircle className="w-6 h-6 fill-white shrink-0" />
              <span className="tracking-wide">QUERO FALAR NO WHATSAPP</span>
            </button>

            <div className="bg-stone-100/90 rounded-xl p-3 border border-stone-200/80 text-center">
              <p className="text-[11px] text-stone-600 flex items-center justify-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Atendimento individual e sem compromisso
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
