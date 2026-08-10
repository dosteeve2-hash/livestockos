'use client'

import { motion } from 'framer-motion'
import {
  PawPrint, ShieldCheck, TrendingUp, AlertTriangle,
  Syringe, DollarSign, Milk, Activity,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

// ─── Data ──────────────────────────────────────────────────────────────────
const KPI = [
  { label: 'Effectif total',  value: '47',       unit: 'tetes',   color: '#D4AF37', icon: PawPrint      },
  { label: 'Nes ce mois',     value: '4',        unit: 'animaux', color: '#4ade80', icon: TrendingUp    },
  { label: 'Vendus ce mois',  value: '15',       unit: 'animaux', color: '#00D4FF', icon: DollarSign    },
  { label: 'Alertes sante',   value: '3',        unit: 'actives', color: '#f87171', icon: AlertTriangle },
  { label: 'CA mois (FCFA)',  value: '1 875 000',unit: 'FCFA',    color: '#D4AF37', icon: ShieldCheck   },
  { label: 'Production lait', value: '284',      unit: 'litres',  color: '#818CF8', icon: Milk          },
  { label: 'Vaccinations',    value: '6',        unit: 'a faire', color: '#F97316', icon: Syringe       },
  { label: 'Taux mortalite',  value: '2.1',      unit: '%',       color: '#34D399', icon: Activity      },
]

const CHEPTEL_DATA = [
  { mois: 'Mar', bovins: 38, ovins: 22, caprins: 15 },
  { mois: 'Avr', bovins: 40, ovins: 24, caprins: 16 },
  { mois: 'Mai', bovins: 42, ovins: 25, caprins: 17 },
  { mois: 'Jun', bovins: 44, ovins: 23, caprins: 18 },
  { mois: 'Jul', bovins: 45, ovins: 24, caprins: 18 },
  { mois: 'Aou', bovins: 47, ovins: 25, caprins: 19 },
]

const PRODUCTION_DATA = [
  { mois: 'Mar', lait: 210, oeufs: 180, viande: 320 },
  { mois: 'Avr', lait: 235, oeufs: 195, viande: 290 },
  { mois: 'Mai', lait: 260, oeufs: 210, viande: 340 },
  { mois: 'Jun', lait: 248, oeufs: 220, viande: 380 },
  { mois: 'Jul', lait: 270, oeufs: 215, viande: 410 },
  { mois: 'Aou', lait: 284, oeufs: 228, viande: 395 },
]

const ALERTES = [
  { animal: 'Vache #BV-012', type: 'Maladie', desc: 'Symptomes fievre aphteuse', urgence: 'Haute',  date: '2026-08-09' },
  { animal: 'Chevre #CP-034', type: 'Blessure', desc: 'Plaie patte arriere gauche', urgence: 'Moyenne', date: '2026-08-08' },
  { animal: 'Taureau #BV-003', type: 'Nutrition', desc: 'Perte de poids anormale', urgence: 'Basse', date: '2026-08-07' },
]

const VACCINATIONS = [
  { animal: 'Lot Bovins A (12 tetes)', vaccin: 'FMDV — Fievre aphteuse', date: '2026-08-12' },
  { animal: 'Lot Ovins B (8 tetes)', vaccin: 'PPR — Peste petits ruminants', date: '2026-08-15' },
  { animal: 'Lot Caprins C (5 tetes)', vaccin: 'Pasteurellose', date: '2026-08-20' },
]

const TRANSACTIONS = [
  { type: 'Vente', desc: '3 bœufs marche Ouaga', montant: '+825 000', color: '#4ade80', date: '2026-08-08' },
  { type: 'Achat', desc: 'Aliments concentres sac 50kg x20', montant: '-180 000', color: '#f87171', date: '2026-08-07' },
  { type: 'Vente', desc: '120L lait frais livraison', montant: '+96 000', color: '#4ade80', date: '2026-08-06' },
  { type: 'Soin',  desc: 'Traitement veterinaire BV-012', montant: '-45 000', color: '#f87171', date: '2026-08-05' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem',
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.06 },
  }),
}
const URGENCE_COLOR: Record<string, string> = { 'Haute': '#ef4444', 'Moyenne': '#D4AF37', 'Basse': '#10b981' }

// ─── Page ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div style={{ padding: '1.5rem', color: 'white' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem' }}>Dashboard</h1>
        <p style={{ color: '#8899bb', fontSize: '0.85rem', margin: 0 }}>Aout 2026 · Ferme FORGE Afrika — 47 tetes</p>
      </div>

      {/* KPIs 4x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {KPI.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show" style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ color: '#8899bb', fontSize: '0.7rem' }}>{k.label}</span>
              <k.icon style={{ width: 14, height: 14, color: k.color }} />
            </div>
            <p style={{ color: k.color, fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>{k.value}</p>
            <p style={{ color: '#8899bb', fontSize: '0.65rem', margin: '0.15rem 0 0' }}>{k.unit}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* Evolution cheptel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            Evolution du cheptel (6 mois)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CHEPTEL_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                {[['bovins', '#D4AF37'], ['ovins', '#00D4FF'], ['caprins', '#10b981']].map(([k, c]) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#8899bb' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8899bb' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: 'white' }} />
              <Area type="monotone" dataKey="bovins" stroke="#D4AF37" strokeWidth={2} fill="url(#grad-bovins)" />
              <Area type="monotone" dataKey="ovins"  stroke="#00D4FF" strokeWidth={2} fill="url(#grad-ovins)" />
              <Area type="monotone" dataKey="caprins" stroke="#10b981" strokeWidth={2} fill="url(#grad-caprins)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {[['Bovins', '#D4AF37'], ['Ovins', '#00D4FF'], ['Caprins', '#10b981']].map(([l, c]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#8899bb' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />{l}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Production */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            Production mensuelle (unites)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={PRODUCTION_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#8899bb' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8899bb' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: 'white' }} />
              <Bar dataKey="lait"   fill="#818CF8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="oeufs"  fill="#D4AF37" radius={[3, 3, 0, 0]} />
              <Bar dataKey="viande" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {[['Lait (L)', '#818CF8'], ['Oeufs', '#D4AF37'], ['Viande (kg)', '#10b981']].map(([l, c]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#8899bb' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0 }} />{l}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row: alertes + vaccinations + transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

        {/* Alertes sanitaires */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle style={{ width: 14, height: 14, color: '#ef4444' }} />
            Alertes sanitaires
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ALERTES.map((a, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#f0f4ff' }}>{a.animal}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 8,
                    background: URGENCE_COLOR[a.urgence] + '22', color: URGENCE_COLOR[a.urgence] }}>
                    {a.urgence}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#8899bb', margin: 0 }}>{a.desc}</p>
                <p style={{ fontSize: 10, color: '#5a6a85', margin: '4px 0 0' }}>{a.date}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vaccinations a venir */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Syringe style={{ width: 14, height: 14, color: '#F97316' }} />
            Vaccinations a venir
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {VACCINATIONS.map((v, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#F97316', margin: '0 0 3px' }}>{v.date}</p>
                <p style={{ fontSize: 11, color: '#f0f4ff', margin: '0 0 3px' }}>{v.vaccin}</p>
                <p style={{ fontSize: 10, color: '#8899bb', margin: 0 }}>{v.animal}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transactions recentes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <DollarSign style={{ width: 14, height: 14, color: '#D4AF37' }} />
            Transactions recentes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TRANSACTIONS.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p style={{ fontSize: 11, color: '#f0f4ff', fontWeight: 600, margin: '0 0 2px' }}>{t.desc}</p>
                  <p style={{ fontSize: 10, color: '#5a6a85', margin: 0 }}>{t.type} · {t.date}</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: t.color, whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {t.montant}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
