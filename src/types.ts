export type InterestOption = 'conhecer' | 'funcionamento' | 'valor';

export interface InterestDetails {
  id: InterestOption;
  label: string;
  fullText: string;
  icon: string;
}

export interface LeadData {
  id: string;
  nome: string;
  interesse: InterestOption | null;
  interesseLabel: string;
  startedAt: Date;
  completedAt?: Date;
  whatsappClicked: boolean;
}

export interface TypebotConfig {
  whatsappNumber: string;
  brandName: string;
  brandAvatar: string;
  brandLogoUrl?: string;
  watchImageUrl: string;
  watchTitle: string;
  customMessageTemplate: string;
  soundEnabled: boolean;
  accentColor: string;
}

export type StepStage = 'start' | 'name' | 'interest' | 'transition' | 'cta';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  stage?: StepStage;
  hasProductImage?: boolean;
}

export interface AnalyticsStats {
  views: number;
  starts: number;
  namesGiven: number;
  interestsSelected: number;
  whatsappClicks: number;
}
