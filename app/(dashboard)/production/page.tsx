'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ComposedChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { toast, Toaster } from 'sonner'
import {
  Activity, Milk, Egg, Plus, X, Calendar, TrendingUp, Percent,
} from 'lucide-react'

type StatutVache = 'Normale' | 'Baisse' | 'Haute'
type TypeProduction = 'Lait' | 'Œufs'

interface Vache {
  id: string
  nom: string
  race: string
  prodAujourdhui: number
  prod7jMoy: number
  statut: StatutVache
}

interface LotVolaille {
  id: string
  nom: string
  effectif: number
  oeufsJour: number
  tauxPonte: number
}

const VACHES: Vache[] = [
  { id: 'BV-101', nom: 'Fatou',   race: 'Holstein',     prodAujourdhui: 9.2,  prod7jMoy: 8.8, statut: 'Normale' },
  { id: 'BV-102', nom: 'Aminata', race: 'Montbéliarde', prodAujourdhui: 7.8,  prod7jMoy: 7.5, statut: 'Normale' },
  { id: 'BV-103', nom: 'Safi',    race: 'Zébu Peul',    prodAujourdhui: 5.1,  prod7jMoy: 5.3, statut: 'Baisse'  },
  { id: 'BV-104', nom: 'Rokia',   race: 'Holstein',     prodAujourdhui: 10.1, prod7jMoy: 9.8, statut: 'Haute'   },
  { id: 'BV-105', nom: 'Mariam',  race: 'Brune',        prodAujourdhui: 6.3,  prod7jMoy: 6.8, statut: 'Baisse'  },
  { id: 'BV-106', nom: 'Binta',   race: 'Montbéliarde', prodAujourdhui: 9.0,  prod7jMoy: 8.9, statut: 'Normale' },
]

const LOTS_VOLAILLE: LotVolaille[] = [
  { id: 'LP-A', nom: 'Lot Pondeuses A', effectif: 180, oeufsJour: 142, tauxPonte: 79 },
  { id: 'LP-B', nom: 'Lot Pondeuses B', effectif: 150, oeufsJour: 118, tauxPonte: 79 },
  { id: 'LP-M', nom: 'Lot Mixte',       effectif: 80,  oeufsJour: 52,  tauxPonte: 65 },
]

const MILK_DATA = [
  { jour: 'Lun', litres: 44.2, moyenneVache: 7.4 },
  { jour: 'Mar', litres: 45.8, moyenneVache: 7.6 },
  { jour: 'Mer', litres: 43.5, moyenneVache: 7.3 },
  { jour: 'Jeu', litres: 46.9, moyenneVache: 7.8 },
  { jour: 'Ven', litres: 45.1, moyenneVache: 7.5 },
  { jour: 'Sam', litres: 46.3, moyenneVache: 7.7 },
  { jour: 'Dim', litres: 47.5, moyenneVache: 7.9 },
]

const EGG_DATA = [
  { jour: 'Lun', oeufs: 298 },
  { jour: 'Mar', oeufs: 305 },
  { jour: 'Mer', oeufs: 300 },
  { jour: 'Jeu', oeufs: 308 },
  { jour: 'Ven', oeufs: 302 },
  { jour: 'Sam', oeufs: 306 },
  { jour: 'Dim', oeufs: 312 },
]

const STATUT_CFG: Record<StatutVache, { emoji: string; color: string; bg: string }> = {
  Normale: { emoji: '🟢', color: '#4ade80', bg: 'rgba(74,222,128,0.13)' },
  Haute:   { emoji: '🟢', color: '#4ade80', bg: 'rgba(74,222,128,0.13)' },
  Baisse:  { emoji: '🟠', color: '#fb923c', bg: 'rgba(251,146,60,0.13)' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.05 },
  }),
}

const TOTAL_OEUFS = EGG_DATA[EGG_DATA.length - 1].oeufs
const OEUFS_CASSES = 12
const OEUFS_VENTE = 250
const OEUFS_INCUBATION = TOTAL_OEUFS - OEUFS_CASSES - OEUFS_VENTE
const TAUX_CASSE = Math.round((OEUFS_CASSES / TOTAL_OEUFS) * 100)

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#0A1628',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f0f4ff',
  fontSize: '0.85rem', outline: 'none',
}
const labelStyle: React.CSSProperties = {
  color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem',
}

export default function ProductionPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    type: 'Lait' as TypeProduction,
    cible: VACHES[0].nom,
    quantite: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })

  function handleTypeChange(type: TypeProduction) {
    setForm(f => ({ ...f, type, cible: type === 'Lait' ? VACHES[0].nom : LOTS_VOLAILLE[0].nom }))
  }

  function handleSubmit() {
    if (!form.quantite) return
    toast.success('Production enregistrée ✅', {
      style: { background: '#111e35', border: '1px solid #4ade80', color: '#f0f4ff' },
    })
    setShowModal(false)
    setForm({ type: 'Lait', cible: VACHES[0].nom, quantite: '', date: new Date().toISOString().slice(0, 10), notes: '' })
  }

  function saisirProductionVache(nom: string) {
    toast.success(`Production de ${nom} enregistrée ✅`, {
      style: { background: '#111e35', border: '1px solid #4ade80', color: '#f0f4ff' },
    })
  }

  function enregistrerCollecte(nom: string) {
    toast.success(`Collecte du ${nom} enregistrée ✅`, {
      style: { background: '#111e35', border: '1px solid #4ade80', color: '#f0f4ff' },
    })
  }

  const kpis = [
    { label: 'Production Lait Aujourd\'hui',  value: '47.5 L',       icon: Milk,       color: '#D4AF37' },
    { label: 'Production Œufs Aujourd\'hui',  value: '312 unités',   icon: Egg,        color: '#D4AF37' },
    { label: 'Rendement Moyen Lait',          value: '8.2 L/vache',  icon: TrendingUp, color: '#D4AF37' },
    { label: 'Taux de Ponte',                 value: '78 %',         icon: Percent,    color: '#D4AF37' },
  ]

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ padding: '2rem', color: '#f0f4ff' }}>
      <Toaster position="top-right" />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity style={{ width: 22, height: 22, color: '#D4AF37' }} />
            Production Animale
          </h1>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.7rem',
            borderRadius: 99, fontSize: '0.75rem', fontWeight: 600, color: '#00D4FF',
            backgroundColor: 'rgba(0,212,255,0.12)', textTransform: 'capitalize',
          }}>
            <Calendar style={{ width: 12, height: 12 }} />
            {today}
          </span>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700,
          backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer',
        }}>
          <Plus style={{ width: 15, height: 15 }} />
          Nouvelle saisie production
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            style={{ backgroundColor: '#0A1628', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: k.color, borderRadius: '16px 16px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.4rem' }}>{k.label}</p>
                <p style={{ color: k.color, fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>{k.value}</p>
              </div>
              <k.icon style={{ width: 20, height: 20, color: k.color, opacity: 0.7 }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section Lait */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Milk style={{ width: 18, height: 18, color: '#D4AF37' }} />
          Lait — Vaches laitières
        </h2>

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.25rem', color: '#f0f4ff' }}>Production laitière — 7 derniers jours</p>
          <p style={{ color: '#8899bb', fontSize: '0.75rem', margin: '0 0 1.25rem' }}>Volume total du troupeau (L) et rendement moyen par vache (L/vache)</p>

          {mounted && (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={MILK_DATA} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="jour" tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8899bb', paddingTop: 12 }} />
                <Bar yAxisId="left" dataKey="litres" name="Total troupeau (L)" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="moyenneVache" name="Moyenne / vache (L)" stroke="#00D4FF" strokeWidth={2.5} dot={{ r: 3, fill: '#00D4FF' }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <div style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['N°', 'Nom', 'Race', 'Production Aujourd\'hui', 'Production 7j moy', 'Statut', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#8899bb', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VACHES.map((v, i) => {
                const sCfg = STATUT_CFG[v.statut]
                return (
                  <motion.tr key={v.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', fontFamily: 'monospace', color: '#8899bb' }}>{v.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}>{v.nom}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#8899bb' }}>{v.race}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontFamily: 'monospace', color: '#00D4FF' }}>{v.prodAujourdhui.toFixed(1)} L</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#8899bb' }}>{v.prod7jMoy.toFixed(1)} L/j</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, backgroundColor: sCfg.bg, color: sCfg.color }}>
                        {sCfg.emoji} {v.statut}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button onClick={() => saisirProductionVache(v.nom)}
                        style={{ padding: '0.35rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', cursor: 'pointer' }}>
                        Saisir production
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section Œufs */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Egg style={{ width: 18, height: 18, color: '#D4AF37' }} />
          Œufs — Volailles
        </h2>

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
          style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.25rem', color: '#f0f4ff' }}>Collecte d&apos;œufs — 7 derniers jours</p>
          <p style={{ color: '#8899bb', fontSize: '0.75rem', margin: '0 0 1.25rem' }}>Nombre total d&apos;œufs collectés par jour, tous lots confondus</p>

          {mounted && (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={EGG_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="jour" tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: 12 }}
                  formatter={(v: number) => [`${v} œufs`]}
                />
                <Line type="monotone" dataKey="oeufs" name="Œufs collectés" stroke="#00D4FF" strokeWidth={2.5} dot={{ r: 3, fill: '#00D4FF' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Résumé collecte */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Total collecté',      value: `${TOTAL_OEUFS} œufs` },
            { label: 'Cassés / rejetés',    value: `${OEUFS_CASSES} (${TAUX_CASSE}%)` },
            { label: 'Destinés à la vente', value: `${OEUFS_VENTE} œufs` },
            { label: 'À incuber',           value: `${OEUFS_INCUBATION} œufs` },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1rem' }}>
              <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.35rem' }}>{s.label}</p>
              <p style={{ color: '#00D4FF', fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Lot', 'Effectif', 'Œufs / jour', 'Taux de ponte', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#8899bb', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOTS_VOLAILLE.map((l, i) => (
                <motion.tr key={l.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}>{l.nom}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#8899bb' }}>{l.effectif} têtes</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontFamily: 'monospace', color: '#00D4FF' }}>{l.oeufsJour} œufs</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37' }}>{l.tauxPonte} %</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button onClick={() => enregistrerCollecte(l.nom)}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', cursor: 'pointer' }}>
                      Enregistrer collecte
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle saisie production */}
      {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.65)' }}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '1.75rem', width: '100%', maxWidth: 440, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity style={{ width: 16, height: 16, color: '#D4AF37' }} />
                  Nouvelle saisie production
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8899bb' }}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle} htmlFor="production-type-1">Type</label>
                  <select id="production-type-1" value={form.type} onChange={e => handleTypeChange(e.target.value as TypeProduction)} style={inputStyle}>
                    <option value="Lait">Lait</option>
                    <option value="Œufs">Œufs</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="production-cible-2">{form.type === 'Lait' ? 'Animal' : 'Lot'}</label>
                  <select id="production-cible-2" value={form.cible} onChange={e => setForm(f => ({ ...f, cible: e.target.value }))} style={inputStyle}>
                    {(form.type === 'Lait' ? VACHES.map(v => v.nom) : LOTS_VOLAILLE.map(l => l.nom)).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="production-quantite-3">Quantité ({form.type === 'Lait' ? 'litres' : 'unités'})</label>
                  <input id="production-quantite-3" type="number" value={form.quantite} onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))}
                    placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="production-date-4">Date</label>
                  <input id="production-date-4" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="production-notes-5">Notes</label>
                  <textarea id="production-notes-5" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Observations éventuelles..." rows={3}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb', border: 'none', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={handleSubmit} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer' }}>
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
      )}

      <div style={{ height: '2rem' }} />
    </div>
  )
}
