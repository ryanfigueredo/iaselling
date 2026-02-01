"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Check,
  Sparkles,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import CheckoutModal from "./CheckoutModal";

// Preço de venda (ajuste aqui quando necessário)
const SELLING_PRICE = 80.0;

const WHATSAPP_LINK =
  process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/5521997624873";

interface PricingProps {
  hasPaid?: boolean;
  onPaymentSuccess: () => void;
  onWhatsAppClick?: () => void;
}

export default function Pricing({
  hasPaid = false,
  onPaymentSuccess,
  onWhatsAppClick,
}: PricingProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handlePurchase = () => {
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = () => {
    onPaymentSuccess();
    setIsCheckoutOpen(false);
  };

  const notes = [
    "Todos os sites do Plano BETA são testados e monitorados constantemente.",
    "Alguns serviços podem ser ajustados ou removidos conforme limitações.",
    "Adobe Stock e Shutterstock sob observação; arquivos podem ser solicitados via solicitação direta.",
    "A assinatura não inclui licenças estendidas ou aprimoradas.",
  ];

  return (
    <section id="pricing" className="py-24 px-4 relative">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-8 md:p-12 neon-border-strong border border-white/[0.08] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            {hasPaid ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center py-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-neon-green/20 border-2 border-neon-green/50 flex items-center justify-center mb-6">
                  <CheckCircle2
                    className="w-10 h-10 text-neon-green"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="heading-display text-2xl md:text-3xl text-white mb-2">
                  Pagamento aprovado!
                </h2>
                <p className="text-gray-400 mb-8 max-w-sm">
                  Retire seu acesso através do WhatsApp. Clique no botão abaixo
                  para falar com nossa equipe.
                </p>
                <motion.a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onWhatsAppClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-[#25D366] text-white font-display font-semibold text-lg hover:bg-[#20BA5A] transition-colors shadow-lg"
                >
                  <MessageCircle className="w-6 h-6" strokeWidth={2} />
                  Abrir WhatsApp e retirar acesso
                </motion.a>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Sparkles
                    className="w-5 h-5 text-neon-green"
                    strokeWidth={1.75}
                  />
                  <span className="text-sm font-medium text-neon-green uppercase tracking-wider">
                    Plano Beta
                  </span>
                </div>
                <h2 className="heading-display text-4xl md:text-5xl text-center mb-2 text-white">
                  Acesso IA
                </h2>
                <p className="text-center text-gray-400 mb-4">
                  Acesso completo às ferramentas
                </p>
                <p className="text-center text-neon-green/90 text-sm font-medium mb-8">
                  ChatGPT Pro • Midjourney • Canva PRO • Adobe Stock •
                  Shutterstock • HeyGen • SORA • Grok • Gamma + 20+ IAs
                </p>

                <div className="flex flex-col items-center mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl md:text-6xl font-display font-bold text-neon-green">
                      R$ {SELLING_PRICE.toFixed(0)}
                    </span>
                    <span className="text-2xl text-gray-500">,00</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Acesso Mensal</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePurchase}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-neon-green text-dark-bg font-display font-semibold text-lg hover:bg-neon-green-dark transition-colors shadow-neon"
                >
                  <CreditCard className="w-5 h-5" strokeWidth={2} />
                  Comprar Agora
                </motion.button>

                <div className="mt-12 pt-8 border-t border-white/[0.06]">
                  <h3 className="font-display font-semibold text-lg text-neon-green mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5" strokeWidth={2} />
                    Observações
                  </h3>
                  <ul className="space-y-3 text-gray-400 text-sm leading-relaxed">
                    {notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-neon-green mt-1.5 shrink-0">
                          •
                        </span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={SELLING_PRICE}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </section>
  );
}
