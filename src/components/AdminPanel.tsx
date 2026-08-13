import React, { useState } from 'react';
import {
  X,
  Phone,
  BarChart3,
  Copy,
  Check,
  ExternalLink,
  Save,
  MessageSquare,
  Sparkles,
  Users,
  MousePointerClick,
  Code
} from 'lucide-react';
import { LeadData, TypebotConfig } from '../types';
import { buildWhatsAppUrl } from '../data/typebotFlow';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: TypebotConfig;
  onUpdateConfig: (newConfig: TypebotConfig) => void;
  leads: LeadData[];
  onClearLeads: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  leads,
  onClearLeads,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'leads' | 'embed'>('config');
  const [phone, setPhone] = useState(config.whatsappNumber);
  const [template, setTemplate] = useState(config.customMessageTemplate);
  const [brandName, setBrandName] = useState(config.brandName);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      whatsappNumber: phone,
      customMessageTemplate: template,
      brandName: brandName,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Metrics
  const totalVisits = Math.max(leads.length, 1);
  const namesGiven = leads.filter((l) => l.nome).length;
  const interestsChosen = leads.filter((l) => l.interesse).length;
  const whatsappClicks = leads.filter((l) => l.whatsappClicked).length;
  const conversionRate = ((whatsappClicks / totalVisits) * 100).toFixed(1);

  // Test URL preview
  const testUrl = buildWhatsAppUrl(
    phone,
    'João Silva',
    'saber como funciona',
    template
  );

  const embedCode = `<iframe
  src="${window.location.origin}"
  width="100%"
  height="700px"
  style="border:none; border-radius:16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
  title="Typebot F.A STORE"
></iframe>`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-stone-900 text-white rounded-lg shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">Painel do Typebot</h2>
              <p className="text-xs text-stone-500">Configuração de atendimento & conversão WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-100 bg-stone-50/50 px-6 pt-2 space-x-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            WhatsApp & Marca
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'leads'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Leads & Funil ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'embed'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Código & Embed
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-stone-800 space-y-6">
          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Número do WhatsApp de Atendimento
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 text-xs">
                    +
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="5511999999999 (Código do país + DDD + número)"
                    className="w-full pl-7 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white text-stone-900 font-mono"
                    required
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Exemplo: 5511999998888 (Apenas números).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome da Marca / Loja
                </label>
                <div className="flex items-center gap-3">
                  {config.brandLogoUrl && (
                    <img
                      src={config.brandLogoUrl}
                      alt="Logo F.A STORE"
                      className="w-10 h-10 rounded-full border border-stone-800 object-cover shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="flex-1 px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white text-stone-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Template da Mensagem do WhatsApp
                </label>
                <textarea
                  rows={3}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white text-stone-900 font-mono"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Variáveis disponíveis: <code className="bg-stone-100 px-1 rounded text-stone-800">{"{{nome}}"}</code> e <code className="bg-stone-100 px-1 rounded text-stone-800">{"{{resposta}}"}</code>
                </p>
              </div>

              {/* Preview Test Action */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-900">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium">Testar envio no WhatsApp real</span>
                </div>
                <a
                  href={testUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                >
                  Testar Link
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Submit & Status */}
              <div className="flex items-center justify-between pt-2">
                {savedSuccess ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Alterações salvas com sucesso!
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400">Clique para atualizar as configurações</span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar Configurações
                </button>
              </div>
            </form>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Funnel Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl">
                  <div className="flex items-center text-stone-500 text-[11px] font-medium gap-1 mb-1">
                    <Users className="w-3.5 h-3.5" /> Visitas/Inícios
                  </div>
                  <div className="text-lg font-bold text-stone-900">{totalVisits}</div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl">
                  <div className="flex items-center text-stone-500 text-[11px] font-medium gap-1 mb-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Nome Dado
                  </div>
                  <div className="text-lg font-bold text-stone-900">{namesGiven}</div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl">
                  <div className="flex items-center text-stone-500 text-[11px] font-medium gap-1 mb-1">
                    <MousePointerClick className="w-3.5 h-3.5" /> Qualificados
                  </div>
                  <div className="text-lg font-bold text-stone-900">{interestsChosen}</div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center text-emerald-700 text-[11px] font-medium gap-1 mb-1">
                    🟢 Clicks WhatsApp
                  </div>
                  <div className="text-lg font-bold text-emerald-900">
                    {whatsappClicks} <span className="text-xs font-normal text-emerald-700">({conversionRate}%)</span>
                  </div>
                </div>
              </div>

              {/* Leads List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                    Histórico de Qualificação ({leads.length})
                  </h3>
                  {leads.length > 0 && (
                    <button
                      onClick={onClearLeads}
                      className="text-[11px] text-stone-400 hover:text-red-600 cursor-pointer"
                    >
                      Limpar registros
                    </button>
                  )}
                </div>

                {leads.length === 0 ? (
                  <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    <p className="text-xs text-stone-500">Nenhum lead registrado nesta sessão ainda.</p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Interaja com o Typebot no simulador para gerar registros de qualificação.
                    </p>
                  </div>
                ) : (
                  <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-stone-100/80 text-stone-600 font-semibold border-b border-stone-200">
                        <tr>
                          <th className="p-2.5">Nome</th>
                          <th className="p-2.5">Interesse / Qualificação</th>
                          <th className="p-2.5">Horário</th>
                          <th className="p-2.5 text-right">Status WA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-stone-50/80">
                            <td className="p-2.5 font-medium text-stone-900">
                              {lead.nome || 'Pendente'}
                            </td>
                            <td className="p-2.5 text-stone-600">
                              <span className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
                                {lead.interesseLabel || 'Não selecionou'}
                              </span>
                            </td>
                            <td className="p-2.5 text-stone-400 text-[11px]">
                              {new Date(lead.startedAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="p-2.5 text-right font-medium">
                              {lead.whatsappClicked ? (
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                                  🟢 Clicou no CTA
                                </span>
                              ) : (
                                <span className="text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full text-[11px]">
                                  Pendente
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Código Iframe para incorporar no seu site / Landing Page
                </label>
                <div className="relative">
                  <textarea
                    readOnly
                    rows={5}
                    value={embedCode}
                    className="w-full p-3 text-xs bg-stone-900 text-stone-200 rounded-xl font-mono focus:outline-hidden"
                  />
                  <button
                    onClick={() => copyToClipboard(embedCode, setCopiedEmbed)}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-stone-700"
                  >
                    {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedEmbed ? 'Copiado!' : 'Copiar Iframe'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Link Direto da Experiência
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800"
                  />
                  <button
                    onClick={() => copyToClipboard(window.location.href, setCopiedLink)}
                    className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'Copiado' : 'Copiar URL'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
