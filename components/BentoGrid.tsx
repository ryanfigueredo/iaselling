'use client'

import { motion } from 'framer-motion'
import {
  Palette,
  Image,
  Bot,
  PenTool,
  MessageSquare,
  Video,
  Box,
  LayoutGrid,
  BarChart3,
  Crosshair,
  Music,
  Layers,
  Film,
  Ruler,
  Theater,
  Mic,
  User,
  ImagePlus,
  FileText,
  Clapperboard,
  Sparkles,
  Rocket,
  Globe,
  Package,
  Download,
  type LucideIcon,
} from 'lucide-react'

const directAccessIcons: LucideIcon[] = [
  Palette, Image, Bot, PenTool, MessageSquare, Video, Box, LayoutGrid,
  BarChart3, Crosshair, Music, Layers, Film, Ruler, Theater, Mic,
  User, ImagePlus, FileText, Clapperboard, Sparkles, Rocket, Rocket, Globe,
]

const directAccessTools = [
  'Shutterstock', 'Adobe Stock', 'ChatGPT Pro', 'Canva PRO', 'Grok', 'RenderForest',
  'Vectorizer.ai', 'Placeit', 'Gamma', 'Postermywall', 'Audiio', 'Creative Fabrica',
  'Storyblocks', 'Pacdora', 'Midjourney', 'Voice Clone', 'HeyGen', 'Picasso AI',
  'TurboScribe', 'Piclumen', 'Digen AI', 'Remini', 'SORA', 'SORA MAX', 'You.com',
]

const goVIPTools = [
  { name: 'Envato Elements', limit: '50/dia' },
  { name: 'StoryBlocks', limit: '50/dia' },
  { name: 'Artgrid', limit: '20/dia' },
  { name: 'Artlist', limit: '20/dia' },
  { name: 'Flaticon', limit: '35/dia' },
  { name: 'Iconscout', limit: '25/dia' },
  { name: 'Lordicon', limit: '35/dia' },
  { name: 'Freepik', limit: '35/dia' },
  { name: 'Pngtree', limit: '35/dia' },
  { name: 'Motion Array', limit: '50/dia' },
  { name: 'Pikbest', limit: '50/dia' },
  { name: 'Pixeden', limit: '50/dia' },
  { name: 'Lovepik', limit: '50/dia' },
  { name: 'Brusheezy', limit: '50/dia' },
  { name: 'Elegantflyer', limit: '50/dia' },
  { name: 'Vecteezy', limit: '50/dia' },
  { name: 'Epidemicsound', limit: '50/dia' },
  { name: 'Motionelements', limit: '30/dia' },
  { name: 'Deeezy', limit: '20/dia' },
  { name: 'Footagecrate', limit: '10/dia' },
  { name: 'MonsterOne', limit: '10/dia' },
  { name: 'Rawpixel', limit: '60/dia' },
  { name: 'Graphicpear', limit: '70/dia' },
  { name: 'IA Tools', limit: '20 IAs' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function BentoGrid() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
            Ferramentas Incluídas
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Acesso direto online e solicitação via GoVIP
          </p>
        </motion.div>

        {/* Direct Access Tools */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-neon-green/15 border border-neon-green/30 flex items-center justify-center">
              <Box className="w-5 h-5 text-neon-green" strokeWidth={1.75} />
            </div>
            <h3 className="font-display font-semibold text-2xl text-neon-green">
              Acesso Direto Online
            </h3>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
          >
            {directAccessTools.map((name, i) => {
              const Icon = directAccessIcons[i % directAccessIcons.length]
              return (
                <motion.div
                  key={name}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="group glass rounded-xl p-4 md:p-5 neon-border card-hover border border-white/[0.06] cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-3 group-hover:bg-neon-green/15 group-hover:border-neon-green/30 transition-colors">
                    <Icon className="w-5 h-5 text-neon-green" strokeWidth={1.75} />
                  </div>
                  <div className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors">{name}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* GoVIP Tools */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-neon-green/15 border border-neon-green/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-neon-green" strokeWidth={1.75} />
            </div>
            <h3 className="font-display font-semibold text-2xl text-neon-green">
              Solicitação Direta via GoVIP
            </h3>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
          >
            {goVIPTools.map((tool) => (
              <motion.div
                key={tool.name}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group glass rounded-xl p-4 md:p-5 neon-border card-hover border border-white/[0.06] cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-3 group-hover:bg-neon-green/15 group-hover:border-neon-green/30 transition-colors">
                  <Download className="w-5 h-5 text-neon-green" strokeWidth={1.75} />
                </div>
                <div className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors mb-1">{tool.name}</div>
                <div className="text-xs text-neon-green font-medium">{tool.limit}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
