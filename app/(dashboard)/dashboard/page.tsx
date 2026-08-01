'use client'

import { motion } from 'framer-motion'
import { PawPrint, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react'
import AlertesSanitaires from '@/components/AlertesSanitaires'

const KPI = [
  { label: 'Effectif total',   value: '47',  unit: 'têtes',  color: '#D4AF37', icon: PawPrint     },
  { label: 'Nés ce mois',      value: '4',   unit: 'animaux',color: '#4ade80', icon: TrendingUp   },
  { label: 'Vendus ce mois',   value: '15',  unit: 'animaux',color: '#00D4FF', icon: ShieldCheck  },
  { label: 'Décédés',          value: '1',   unit: 'animal', color: '#f87171', icon: AlertTriangle },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.07 },
  }),
}

export default function DashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem' }}>Dashboard</h1>
        <p style={{ color: '#8899bb', fontSize: '0.85rem', margin: 0 }}>Août 2026 · Ferme FORGE Afrika</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {KPI.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ color: '#8899bb', fontSize: '0.75rem' }}>{k.label}</span>
              <k.icon style={{ width: 16, height: 16, color: k.color }} />
            </div>
            <p style={{ color: k.color, fontWeight: 800, fontSize: '1.75rem', margin: 0 }}>{k.value}</p>
            <p style={{ color: '#8899bb', fontSize: '0.7rem', margin: '0.2rem 0 0' }}>{k.unit}</p>
          </motion.div>
        ))}
      </div>

      {/* Alertes sanitaires */}
      <AlertesSanitaires />

      <p style={{ color: '#8899bb', fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>
        Naviguez vers <strong style={{ color: '#D4AF37' }}>Animaux</strong> pour gérer le cheptel ou <strong style={{ color: '#D4AF37' }}>Rapports</strong> pour les analyses.
      </p>
    </div>
  )
}
