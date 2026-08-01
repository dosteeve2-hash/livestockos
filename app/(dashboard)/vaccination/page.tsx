'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Syringe, CheckCircle, Clock, AlertTriangle, Shield } from 'lucide-react'
import { toast, Toaster } from 'sonner'

type Espece = 'Bovin' | 'Ovin' | 'Caprin' | 'Porcin'
type Statut = 'Planifié' | 'Fait' | 'En retard'

interface Vaccination {
  id: string
  animalId: string
  espece: Espece
  vaccin: string
  datePrevue: string
  statut: Statut
}

const INIT: Vaccination[] = [
  { id: 'V-001', animalId: 'BV-001', espece: 'Bovin',  vaccin: 'CBPP (Péripneumonie)',      datePrevue: '2026-08-10', statut: 'Planifié'   },
  { id: 'V-002', animalId: 'BV-002', espece: 'Bovin',  vaccin: 'FMD (Fièvre aphteuse)',     datePrevue: '2026-08-12', statut: 'Planifié'   },
  { id: 'V-003', animalId: 'BV-003', espece: 'Bovin',  vaccin: 'CBPP (Péripneumonie)',      datePrevue: '2026-07-15', statut: 'En retard'  },
  { id: 'V-004', animalId: 'OV-001', espece: 'Ovin',   vaccin: 'PPR (Peste des petits rumin.)', datePrevue: '2026-08-05', statut: 'Planifié' },
  { id: 'V-005', animalId: 'OV-002', espece: 'Ovin',   vaccin: 'PPR (Peste des petits rumin.)', datePrevue: '2026-07-20', statut: 'En retard' },
  { id: 'V-006', animalId: 'CP-001', espece: 'Caprin', vaccin: 'PPR (Peste des petits rumin.)', datePrevue: '2026-06-28', statut: 'Fait'     },
  { id: 'V-007', animalId: 'PC-001', espece: 'Porcin', vaccin: 'PPA (Peste porcine africaine)', datePrevue: '2026-07-01', statut: 'Fait'     },
  { id: 'V-008', animalId: 'PC-002', espece: 'Porcin', vaccin: 'CSF (Rouget du porc)',      datePrevue: '2026-08-20', statut: 'Planifié'   },
]

const ESPECES: Espece[] = ['Bovin', 'Ovin', 'Caprin', 'Porcin']

const STATUT_CFG: Record<Statut, { color: string; bg: string; icon: React.ElementType }> = {
  'Planifié':  { color: '#00D4FF', bg: 'rgba(0,212,255,0.13)',    icon: Clock         },
  'Fait':      { color: '#4ade80', bg: 'rgba(74,222,128,0.13)',   icon: CheckCircle   },
  'En retard': { color: '#f87171', bg: 'rgba(248,113,113,0.13)',  icon: AlertTriangle },
}

const ESPECE_COLOR: Record<Espece, string> = {
  Bovin: '#D4AF37', Ovin: '#00D4FF', Caprin: '#a78bfa', Porcin: '#fb923c',
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.04 },
  }),
}

export default function VaccinationPage() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(INIT)
  const [filterStatut, setFilterStatut] = useState<Statut | 'all'>('all')
  const [filterEsp,    setFilterEsp]    = useState<Espece | 'all'>('all')

  const filtered = vaccinations.filter(v => {
    const matchS = filterStatut === 'all' || v.statut === filterStatut
    const matchE = filterEsp    === 'all' || v.espece === filterEsp
    return matchS && matchE
  })

  function marquerFait(id: string) {
    setVaccinations(prev => prev.map(v => v.id === id ? { ...v, statut: 'Fait' } : v))
    toast.success('Vaccination marquée comme faite ✅', {
      style: { background: '#111e35', border: '1px solid #4ade80', color: '#f0f4ff' },
    })
  }

  const total       = vaccinations.length
  const faits       = vaccinations.filter(v => v.statut === 'Fait').length
  const couverture  = Math.round((faits / total) * 100)
  const cettesSemaine = vaccinations.filter(v => {
    if (v.statut === 'Fait') return false
    const d = new Date(v.datePrevue)
    const now = new Date()
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  }).length
  const enRetard = vaccinations.filter(v => v.statut === 'En retard').length

  const kpis = [
    { label: 'Couverture vaccinale',   value: `${couverture} %`,          icon: Shield,         color: '#4ade80'  },
    { label: 'À faire cette semaine',  value: String(cettesSemaine),       icon: Clock,          color: '#00D4FF'  },
    { label: 'En retard',              value: String(enRetard),            icon: AlertTriangle,  color: '#f87171'  },
  ]

  return (
    <div style={{ padding: '2rem', color: '#f0f4ff' }}>
      <Toaster position="top-right" />

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Syringe style={{ width: 22, height: 22, color: '#D4AF37' }} />
          Vaccination
        </h1>
        <p style={{ color: '#8899bb', fontSize: '0.8rem', margin: 0 }}>
          {total} actes planifiés · {faits} réalisés · couverture {couverture}%
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {kpis.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: k.color, borderRadius: '16px 16px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.4rem' }}>{k.label}</p>
                <p style={{ color: k.color, fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{k.value}</p>
              </div>
              <k.icon style={{ width: 20, height: 20, color: k.color, opacity: 0.7 }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['all', 'Planifié', 'Fait', 'En retard'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatut(s)}
              style={{
                padding: '0.35rem 0.8rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                backgroundColor: filterStatut === s
                  ? (s === 'all' ? '#D4AF37' : STATUT_CFG[s as Statut].color)
                  : 'rgba(255,255,255,0.06)',
                color: filterStatut === s ? '#0A1628' : '#8899bb',
              }}>{s === 'all' ? 'Tous statuts' : s}</button>
          ))}
        </div>
        <select value={filterEsp} onChange={e => setFilterEsp(e.target.value as Espece | 'all')}
          style={{ padding: '0.4rem 0.75rem', backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.82rem', outline: 'none' }}>
          <option value="all">Toutes espèces</option>
          {ESPECES.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <div style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Animal ID', 'Espèce', 'Vaccin', 'Date prévue', 'Statut', 'Action'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#8899bb', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => {
              const sCfg = STATUT_CFG[v.statut]
              const eCol = ESPECE_COLOR[v.espece]
              const StatusIcon = sCfg.icon
              return (
                <motion.tr key={v.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', fontFamily: 'monospace', color: '#8899bb' }}>{v.animalId}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 99, fontSize: '0.68rem', fontWeight: 700, backgroundColor: `${eCol}18`, color: eCol }}>{v.espece}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.83rem', fontWeight: 500 }}>{v.vaccin}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#8899bb' }}>{new Date(v.datePrevue).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, backgroundColor: sCfg.bg, color: sCfg.color }}>
                      <StatusIcon style={{ width: 11, height: 11 }} />
                      {v.statut}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {v.statut !== 'Fait' && (
                      <button onClick={() => marquerFait(v.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.7rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', cursor: 'pointer' }}>
                        <CheckCircle style={{ width: 12, height: 12 }} />
                        Marquer fait
                      </button>
                    )}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#8899bb', padding: '2.5rem', fontSize: '0.85rem' }}>Aucune vaccination trouvée.</div>
        )}
      </div>

      <div style={{ height: '2rem' }} />
    </div>
  )
}
