import { InterestDetails, TypebotConfig } from '../types';
import watchImage from '../assets/images/s11_mini_exact_photo_1786588238922.jpg';
import faLogo from '../assets/images/fa_store_official_profile_logo_1786587542939.jpg';

export const DEFAULT_CONFIG: TypebotConfig = {
  whatsappNumber: '5586981280344',
  brandName: 'F.A STORE',
  brandAvatar: '⌚',
  brandLogoUrl: faLogo,
  watchImageUrl: watchImage,
  watchTitle: 'Smartwatch S11 Mini 41mm',
  customMessageTemplate: 'Oi! Vim pelo atendimento e quero saber mais.',
  soundEnabled: true,
  accentColor: '#18181b', // Slate-900 premium dark accent
};

export const INTEREST_OPTIONS: InterestDetails[] = [
  {
    id: 'conhecer',
    label: 'Quero conhecer o smartwatch',
    fullText: 'saber mais sobre o smartwatch e conhecer os detalhes',
    icon: '⌚',
  },
  {
    id: 'funcionamento',
    label: 'Quero saber como funciona',
    fullText: 'saber como funciona e quais as principais funções',
    icon: '⚙️',
  },
  {
    id: 'valor',
    label: 'Quero saber o valor',
    fullText: 'saber o valor e condições de aquisição',
    icon: '💰',
  },
];

/**
 * Builds clean WhatsApp API URL with encoded personalized greeting
 */
export function buildWhatsAppUrl(
  phone: string,
  nome: string,
  interesseLabel: string,
  template = DEFAULT_CONFIG.customMessageTemplate
): string {
  // Clean phone number (remove non-digits)
  const cleanPhone = phone.replace(/\D/g, '');

  let message = template
    .replace('{{nome}}', nome.trim() || 'Cliente')
    .replace('{{resposta}}', interesseLabel || 'saber mais');

  const encodedMsg = encodeURIComponent(message);
  
  // Return standard WhatsApp web / mobile deep link
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}
