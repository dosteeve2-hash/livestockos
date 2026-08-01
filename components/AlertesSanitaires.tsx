'use client'

import { motion } from 'framer-motion'
import { ShieldAlert, Syringe, HeartPulse, TrendingUp } from 'lucide-react'

interface Alerte {
  id: string
  type: 'vaccin' | 'maladie' | 'quota'
  titre: string
  detail: string
  priorite: 'haute' | 'moyenne' | 'info'
}

const ALERTES: Alerte[] = [
  {
    id: 'a1',
    type: 'vaccin',
    titre: 'Vaccin FMD — Bovins (lot B)',
    detail: 'Rappel préventif à effectuer avant le 10 août 2026. 8 bovins concernés.',
    priorite: 'haute',
  },
  {
    id: 'a2',
    type: 'maladie',
    titre: 'Animal malade — Bovin #BV-007',
    detail: 'Symptômes : fièvre, perte d\'appétit depuis 48h. Isolement recommandé.',
    priorite: 'haute',
  },
  {
    id: 'a3',
    type: 'quota',
    titre: 'Quota de vente atteint — Ovins',
    detail: 'Objectif mensuel 15 têtes atteint (15/15). Prochaine fenêtre : septembre.',
    priorite: 'info',
  },
]

const CFG = {
  haute:   { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
  moyenne: { color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.25)'  },
  info:    { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.2)'   },
}

const ICONS = {
  vaccin:  Syringe,
  maladie: HeartPulse,
  quota:   TrendingUp,
}

export default function AlertesSanitaires() {
  const hautes = ALERTES.filter(a => a.priorite === 'haute').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      style={{
        backgroundColor: '#111e35',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert style={{ width: 16, height: 16, color: '#f87171' }} />
          Alertes sanitaires
        </h2>
        {hautes > 0 && (
          <span style={{ backgroundColor: 'rgba(248,113,113,0.15)', color: '#f87171', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 99 }}>
            {hautes} urgente{hautes > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {ALERTES.map((alerte, i) => {
          const cfg  = CFG[alerte.priorite]
          const Icon = ICONS[alerte.type]
          return (
            <motion.div
              key={alerte.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                padding: '0.75rem 1rem', borderRadius: 12,
                backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`,
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${cfg.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: 15, height: 15, color: cfg.color }} />
              </div>
              <div>
                <p style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.8rem', margin: '0 0 0.25rem' }}>{alerte.titre}</p>
                <p style={{ color: '#8899bb', fontSize: '0.72rem', margin: 0, lineHeight: 1.4 }}>{alerte.detail}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
