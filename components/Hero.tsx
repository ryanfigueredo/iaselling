"use client";

import { motion } from "framer-motion";
import { Sparkles, Shield, Zap } from "lucide-react";

// Cole aqui a URL do vídeo (YouTube, Vimeo, ou link direto)
const VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || "";

function getEmbedUrl(url: string): string {
  if (url.includes("youtube.com/watch")) {
    const match = url.match(/v=([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : url;
  }
  return url;
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,255,136,0.15),transparent)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-green rounded-full blur-[120px] opacity-20 animate-pulse-neon" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-green rounded-full blur-[100px] opacity-15 animate-pulse-neon"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-green/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-medium text-gray-300">
              Plano Beta • Acesso Imediato
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="heading-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-[1.05]"
          >
            <span className="gradient-text">Acesso</span>
            <br />
            <span className="text-white">Premium</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Navegação anônima, segura e controlada para mais de 30 plataformas
            premium. Acesso enviado via WhatsApp após aprovação.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-5 h-5 text-neon-green/80" />
              <span className="text-sm font-medium">Anônimo & Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-neon-green/80" />
              <span className="text-sm font-medium">Acesso via WhatsApp</span>
            </div>
          </motion.div>
        </div>

        {/* Vídeo - Como funciona */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full max-w-3xl mx-auto mb-12"
        >
          <div className="glass rounded-2xl overflow-hidden neon-border aspect-video">
            {VIDEO_URL ? (
              VIDEO_URL.includes("youtube") ||
              VIDEO_URL.includes("youtu.be") ||
              VIDEO_URL.includes("vimeo") ? (
                <iframe
                  src={getEmbedUrl(VIDEO_URL)}
                  title="Como funciona"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full min-h-[280px]"
                />
              ) : (
                <video
                  src={VIDEO_URL}
                  controls
                  className="w-full h-full"
                  poster=""
                >
                  Seu navegador não suporta vídeo.
                </video>
              )
            ) : (
              <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center text-gray-500 p-8">
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Vídeo explicativo</p>
                <p className="text-xs mt-1 text-gray-600">Video em breve</p>
              </div>
            )}
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Como funciona
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="glass rounded-2xl p-6 md:p-8 max-w-2xl mx-auto neon-border text-left"
        >
          <p className="text-gray-300 leading-relaxed">
            Acesso direto e seguro a plataformas online através de nossa
            infraestrutura. Após aprovação do pagamento, seu acesso será enviado
            via WhatsApp.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
