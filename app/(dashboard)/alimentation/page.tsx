'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wheat, Plus, X, TrendingDown, Calendar, Package, DollarSign } from 'lucide-react'
import { formatFCFA } from '@/lib/format'

type Espece = 'Bovins' | 'Ovins' | 'Caprins' | 'Porcins'

interface Ration {
  id: string
  espece: Espece
  aliment: string
  quantiteKg: number
  frequence: string
  coutJour: number
}

const RATIONS_INIT: Ration[] = [
  { id: 'R-001', espece: 'Bovins',  aliment: 'Foin de brousse',      quantiteKg: 8.0,  frequence: '2x/jour', coutJour: 3200 },
  { id: 'R-002', espece: 'Bovins',  aliment: 'Maïs concassé',        quantiteKg: 3.5,  frequence: '1x/jour', coutJour: 1750 },
  { id: 'R-003', espece: 'Bovins',  aliment: 'Tourteau de soja',      quantiteKg: 1.2,  frequence: '1x/jour', coutJour:  840 },
  { id: 'R-004', espece: 'Bovins',  aliment: 'Son de blé',            quantiteKg: 2.0,  frequence: '1x/jour', coutJour:  600 },
  { id: 'R-005', espece: 'Ovins',   aliment: 'Foin de brousse',      quantiteKg: 1.5,  frequence: '2x/jour', coutJour:  600 },
  { id: 'R-006', espece: 'Ovins',   aliment: 'Maïs concassé',        quantiteKg: 0.5,  frequence: '1x/jour', coutJour:  250 },
  { id: 'R-007', espece: 'Ovins',   aliment: 'Son de blé',            quantiteKg: 0.4,  frequence: '1x/jour', coutJour:  120 },
  { id: 'R-008', espece: 'Caprins', aliment: 'Foin de brousse',      quantiteKg: 1.0,  frequence: '2x/jour', coutJour:  400 },
  { id: 'R-009', espece: 'Caprins', aliment: 'Tourteau de soja',      quantiteKg: 0.3,  frequence: '1x/jour', coutJour:  210 },
  { id: 'R-010', espece: 'Caprins', aliment: 'Maïs concassé',        quantiteKg: 0.4,  frequence: '1x/jour', coutJour:  200 },
  { id: 'R-011', espece: 'Porcins', aliment: 'Maïs concassé',        quantiteKg: 2.5,  frequence: '2x/jour', coutJour: 1250 },
  { id: 'R-012', espece: 'Porcins', aliment: 'Son de blé',            quantiteKg: 1.8,  frequence: '2x/jour', coutJour:  540 },
  { id: 'R-013', espece: 'Porcins', aliment: 'Tourteau de soja',      quantiteKg: 0.8,  frequence: '1x/jour', coutJour:  560 },
]

const ESPECES: Espece[] = ['Bovins', 'Ovins', 'Caprins', 'Porcins']

const ESPECE_COLOR: Record<Espece, string> = {
  Bovins: '#D4AF37', Ovins: '#00D4FF', Caprins: '#a78bfa', Porcins: '#fb923c',
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.04 },
  }),
}

export default function AlimentationPage() {
  const [rations,     setRations]     = useState<Ration[]>(RATIONS_INIT)
  const [filterEsp,   setFilterEsp]   = useState<Espece | 'all'>('all')
  const [showModal,   setShowModal]   = useState(false)
  const [form,        setForm]        = useState({ espece: 'Bovins' as Espece, aliment: '', quantiteKg: '', frequence: '1x/jour' })

  const filtered = filterEsp === 'all' ? rations : rations.filter(r => r.espece === filterEsp)

  const totalCoutJour = rations.reduce((s, r) => s + r.coutJour, 0)
  const totalCoutMois = totalCoutJour * 30

  function handleAdd() {
    if (!form.aliment || !form.quantiteKg) return
    const newR: Ration = {
      id: 'R-' + String(rations.length + 1).padStart(3, '0'),
      espece: form.espece,
      aliment: form.aliment,
      quantiteKg: parseFloat(form.quantiteKg) || 0,
      frequence: form.frequence,
      coutJour: Math.round((parseFloat(form.quantiteKg) || 0) * 500),
    }
    setRations(prev => [...prev, newR])
    setShowModal(false)
    setForm({ espece: 'Bovins', aliment: '', quantiteKg: '', frequence: '1x/jour' })
  }

  const kpis = [
    { label: 'Coût total journalier',    value: formatFCFA(totalCoutJour),   icon: DollarSign,   color: '#D4AF37' },
    { label: 'Stock fourrage restant',   value: '18 jours',                   icon: Package,      color: '#00D4FF' },
    { label: 'Prochaine livraison',      value: '05 août 2026',               icon: Calendar,     color: '#a78bfa' },
    { label: 'Consommation mensuelle',   value: formatFCFA(totalCoutMois),    icon: TrendingDown, color: '#4ade80' },
  ]

  return (
    <div style={{ padding: '2rem', color: '#f0f4ff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wheat style={{ width: 22, height: 22, color: '#D4AF37' }} />
            Alimentation
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.8rem', margin: 0 }}>
            {rations.length} rations · {ESPECES.length} espèces · coût/jour {formatFCFA(totalCoutJour)}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700,
          backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer',
        }}>
          <Plus style={{ width: 15, height: 15 }} />
          Ajouter ration
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {kpis.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: k.color, borderRadius: '16px 16px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.4rem' }}>{k.label}</p>
                <p style={{ color: k.color, fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{k.value}</p>
              </div>
              <k.icon style={{ width: 20, height: 20, color: k.color, opacity: 0.7 }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filtres espèce */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['all', ...ESPECES] as const).map(e => (
          <button key={e} onClick={() => setFilterEsp(e)}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', border: 'none', transition: 'all 0.15s',
              backgroundColor: filterEsp === e ? (e === 'all' ? '#D4AF37' : ESPECE_COLOR[e]) : 'rgba(255,255,255,0.06)',
              color: filterEsp === e ? '#0A1628' : '#8899bb',
            }}>{e === 'all' ? 'Toutes espèces' : e}</button>
        ))}
      </div>

      {/* Tableau rations */}
      <div style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Espèce', 'Aliment', 'Quantité (kg)', 'Fréquence', 'Coût / jour'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#8899bb', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const col = ESPECE_COLOR[r.espece]
              return (
                <motion.tr key={r.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, backgroundColor: `${col}18`, color: col }}>
                      {r.espece}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 500 }}>{r.aliment}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontFamily: 'monospace', color: '#00D4FF' }}>{r.quantiteKg.toFixed(1)} kg</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#8899bb' }}>{r.frequence}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37' }}>{formatFCFA(r.coutJour)}</td>
                </motion.tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <td colSpan={4} style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#8899bb', fontWeight: 600 }}>
                TOTAL — {filtered.length} ration{filtered.length > 1 ? 's' : ''}
              </td>
              <td style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 800, color: '#D4AF37' }}>
                {formatFCFA(filtered.reduce((s, r) => s + r.coutJour, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal Ajouter ration */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.65)' }}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '1.75rem', width: '100%', maxWidth: 420, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wheat style={{ width: 16, height: 16, color: '#D4AF37' }} />
                  Nouvelle ration
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8899bb' }}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Espèce</label>
                  <select value={form.espece} onChange={e => setForm(f => ({ ...f, espece: e.target.value as Espece }))}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none' }}>
                    {ESPECES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Aliment</label>
                  <input value={form.aliment} onChange={e => setForm(f => ({ ...f, aliment: e.target.value }))}
                    placeholder="Ex : Foin de brousse"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Quantité (kg/jour)</label>
                  <input type="number" value={form.quantiteKg} onChange={e => setForm(f => ({ ...f, quantiteKg: e.target.value }))}
                    placeholder="0.0"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Fréquence</label>
                  <select value={form.frequence} onChange={e => setForm(f => ({ ...f, frequence: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none' }}>
                    {['1x/jour', '2x/jour', '3x/jour', 'À volonté'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb', border: 'none', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={handleAdd} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer' }}>
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: '2rem' }} />
    </div>
  )
}
