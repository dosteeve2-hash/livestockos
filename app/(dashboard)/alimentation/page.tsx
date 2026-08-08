'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Toaster, toast } from 'sonner'
import {
  Beef, Wheat, AlertTriangle, AlertCircle,
  ShoppingCart, Plus, Search, Filter, X, CreditCard,
} from 'lucide-react'

/* ───── palette ───── */
const NAVY   = '#0A1628'
const GOLD   = '#D4AF37'
const CYAN   = '#00D4FF'
const BG2    = '#0c1a34'
const BORDER = 'rgba(255,255,255,0.08)'

/* ───── types ───── */
type Espece     = 'Bovin' | 'Ovin' | 'Caprin' | 'Volaille' | 'Porcin'
type TypeAliment = 'Fourrage' | 'Concentré' | 'Minéraux' | 'Complément' | 'Eau'
type Statut     = 'Suffisant' | 'Faible' | 'Rupture'

interface RationAlimentaire {
  id: string
  nom: string
  espece: Espece
  typeAliment: TypeAliment
  quantiteJournaliere: number
  unite: string
  coutUnitaire: number
  coutJournalier: number
  fournisseur: string
  dateAppro: string
  stockDisponible: number
  seuilAlerte: number
  statut: Statut
}

/* ───── données mock BF ───── */
const RATIONS_INIT: RationAlimentaire[] = [
  {
    id: 'RA-001', nom: 'Maïs concassé', espece: 'Bovin', typeAliment: 'Concentré',
    quantiteJournaliere: 3.5, unite: 'kg', coutUnitaire: 500, coutJournalier: 1750,
    fournisseur: 'Agro-BF Ouaga', dateAppro: '2026-07-20',
    stockDisponible: 120, seuilAlerte: 50, statut: 'Suffisant',
  },
  {
    id: 'RA-002', nom: 'Son de blé', espece: 'Bovin', typeAliment: 'Concentré',
    quantiteJournaliere: 2.0, unite: 'kg', coutUnitaire: 300, coutJournalier: 600,
    fournisseur: 'Meunerie Kossam', dateAppro: '2026-07-28',
    stockDisponible: 40, seuilAlerte: 50, statut: 'Faible',
  },
  {
    id: 'RA-003', nom: 'Foin de brousse', espece: 'Bovin', typeAliment: 'Fourrage',
    quantiteJournaliere: 8.0, unite: 'kg', coutUnitaire: 400, coutJournalier: 3200,
    fournisseur: 'Collecteur local', dateAppro: '2026-07-15',
    stockDisponible: 200, seuilAlerte: 80, statut: 'Suffisant',
  },
  {
    id: 'RA-004', nom: 'Tourteau de coton', espece: 'Bovin', typeAliment: 'Concentré',
    quantiteJournaliere: 1.5, unite: 'kg', coutUnitaire: 450, coutJournalier: 675,
    fournisseur: 'SOFITEX Bobo', dateAppro: '2026-08-01',
    stockDisponible: 0, seuilAlerte: 30, statut: 'Rupture',
  },
  {
    id: 'RA-005', nom: 'Pierre à lécher', espece: 'Bovin', typeAliment: 'Minéraux',
    quantiteJournaliere: 0.1, unite: 'kg', coutUnitaire: 2000, coutJournalier: 200,
    fournisseur: 'VetAfrik Distribution', dateAppro: '2026-06-10',
    stockDisponible: 5, seuilAlerte: 10, statut: 'Faible',
  },
  {
    id: 'RA-006', nom: 'Complément vit. A+D3', espece: 'Bovin', typeAliment: 'Complément',
    quantiteJournaliere: 0.05, unite: 'kg', coutUnitaire: 15000, coutJournalier: 750,
    fournisseur: 'VetAfrik Distribution', dateAppro: '2026-07-05',
    stockDisponible: 2, seuilAlerte: 3, statut: 'Faible',
  },
  {
    id: 'RA-007', nom: 'Aliment poulet ponte', espece: 'Volaille', typeAliment: 'Concentré',
    quantiteJournaliere: 0.12, unite: 'kg', coutUnitaire: 600, coutJournalier: 72,
    fournisseur: 'Provimi Burkina', dateAppro: '2026-08-03',
    stockDisponible: 80, seuilAlerte: 20, statut: 'Suffisant',
  },
  {
    id: 'RA-008', nom: 'Eau potable', espece: 'Bovin', typeAliment: 'Eau',
    quantiteJournaliere: 30, unite: 'L', coutUnitaire: 25, coutJournalier: 750,
    fournisseur: 'Forage municipal', dateAppro: '2026-08-08',
    stockDisponible: 5000, seuilAlerte: 500, statut: 'Suffisant',
  },
  {
    id: 'RA-009', nom: 'Concentré bovin', espece: 'Bovin', typeAliment: 'Concentré',
    quantiteJournaliere: 2.5, unite: 'kg', coutUnitaire: 550, coutJournalier: 1375,
    fournisseur: 'Agro-BF Ouaga', dateAppro: '2026-07-25',
    stockDisponible: 0, seuilAlerte: 40, statut: 'Rupture',
  },
  {
    id: 'RA-010', nom: 'Mil grains', espece: 'Ovin', typeAliment: 'Concentré',
    quantiteJournaliere: 0.4, unite: 'kg', coutUnitaire: 350, coutJournalier: 140,
    fournisseur: 'Marché de Gounghin', dateAppro: '2026-07-30',
    stockDisponible: 60, seuilAlerte: 20, statut: 'Suffisant',
  },
  {
    id: 'RA-011', nom: 'Drèches de brasserie', espece: 'Porcin', typeAliment: 'Concentré',
    quantiteJournaliere: 3.0, unite: 'kg', coutUnitaire: 150, coutJournalier: 450,
    fournisseur: 'Brasserie du Burkina', dateAppro: '2026-08-06',
    stockDisponible: 180, seuilAlerte: 60, statut: 'Suffisant',
  },
  {
    id: 'RA-012', nom: 'Farine de poisson', espece: 'Volaille', typeAliment: 'Concentré',
    quantiteJournaliere: 0.05, unite: 'kg', coutUnitaire: 3500, coutJournalier: 175,
    fournisseur: 'Import-BF Mali', dateAppro: '2026-07-18',
    stockDisponible: 8, seuilAlerte: 15, statut: 'Faible',
  },
]

const ESPECES: Espece[]      = ['Bovin', 'Ovin', 'Caprin', 'Volaille', 'Porcin']
const TYPES: TypeAliment[]   = ['Fourrage', 'Concentré', 'Minéraux', 'Complément', 'Eau']
const FREQ_OPTIONS           = ['1x/jour', '2x/jour', '3x/jour', 'À volonté']

const ESPECE_COLOR: Record<Espece, string> = {
  Bovin: GOLD, Ovin: CYAN, Caprin: '#a78bfa', Volaille: '#fb923c', Porcin: '#4ade80',
}

const TYPE_COLOR: Record<TypeAliment, string> = {
  Fourrage: '#22c55e', Concentré: GOLD, Minéraux: '#a78bfa', Complément: CYAN, Eau: '#38bdf8',
}

const STATUT_STYLE: Record<Statut, { bg: string; color: string }> = {
  Suffisant: { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80' },
  Faible:    { bg: 'rgba(251,146,60,0.15)',  color: '#fb923c' },
  Rupture:   { bg: 'rgba(239,68,68,0.15)',   color: '#f87171' },
}

function fmt(n: number) { return n.toLocaleString('fr-FR') + ' FCFA' }

/* ───── nouveau aliment form ───── */
const FORM_DEFAULT = {
  nom: '', espece: 'Bovin' as Espece, typeAliment: 'Concentré' as TypeAliment,
  quantiteJournaliere: '', unite: 'kg', coutUnitaire: '', fournisseur: '',
  dateAppro: '', stockDisponible: '', seuilAlerte: '',
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AlimentationPage() {
  const [rations, setRations]       = useState<RationAlimentaire[]>(RATIONS_INIT)
  const [filterEsp, setFilterEsp]   = useState<Espece | 'all'>('all')
  const [filterType, setFilterType] = useState<TypeAliment | 'all'>('all')
  const [search, setSearch]         = useState('')
  const [detailRation, setDetailRation] = useState<RationAlimentaire | null>(null)
  const [showAdd, setShowAdd]       = useState(false)
  const [form, setForm]             = useState(FORM_DEFAULT)

  /* ── dérivés ── */
  const filtered = useMemo(() => rations.filter(r => {
    if (filterEsp  !== 'all' && r.espece     !== filterEsp)  return false
    if (filterType !== 'all' && r.typeAliment !== filterType) return false
    if (search && !r.nom.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [rations, filterEsp, filterType, search])

  const coutJourTotal   = rations.reduce((s, r) => s + r.coutJournalier, 0)
  const especesNourries = new Set(rations.map(r => r.espece)).size
  const enRupture       = rations.filter(r => r.statut === 'Rupture').length
  const stockFaible     = rations.filter(r => r.statut === 'Faible').length
  const alertActive     = enRupture > 0 || stockFaible > 0

  /* ── données graphiques ── */
  const barData = useMemo(() => {
    const map: Record<string, number> = {}
    rations.forEach(r => { map[r.espece] = (map[r.espece] || 0) + r.coutJournalier })
    return Object.entries(map).map(([espece, cout]) => ({ espece, cout }))
  }, [rations])

  const pieData = useMemo(() => {
    const map: Record<string, number> = {}
    rations.forEach(r => { map[r.typeAliment] = (map[r.typeAliment] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [rations])

  /* ── handlers ── */
  function handleCommander(r: RationAlimentaire) {
    toast.success(`Commande envoyée — ${r.nom}`, {
      description: `${r.fournisseur} · ${r.quantiteJournaliere * 30} ${r.unite} pour 30 j`,
    })
  }

  function handleAdd() {
    const q = parseFloat(form.quantiteJournaliere) || 0
    const cu = parseFloat(form.coutUnitaire) || 0
    const stock = parseFloat(form.stockDisponible) || 0
    const seuil = parseFloat(form.seuilAlerte) || 0
    const statut: Statut = stock === 0 ? 'Rupture' : stock <= seuil ? 'Faible' : 'Suffisant'
    const newR: RationAlimentaire = {
      id: 'RA-' + String(rations.length + 1).padStart(3, '0'),
      nom: form.nom, espece: form.espece, typeAliment: form.typeAliment,
      quantiteJournaliere: q, unite: form.unite, coutUnitaire: cu,
      coutJournalier: Math.round(q * cu),
      fournisseur: form.fournisseur, dateAppro: form.dateAppro,
      stockDisponible: stock, seuilAlerte: seuil, statut,
    }
    setRations(prev => [...prev, newR])
    setShowAdd(false)
    setForm(FORM_DEFAULT)
    toast.success('Aliment ajouté', { description: newR.nom })
  }

  /* ── styles communs ── */
  const card: React.CSSProperties = {
    backgroundColor: '#111e35', border: `1px solid ${BORDER}`,
    borderRadius: 16, padding: '1.25rem',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.5rem 0.75rem', backgroundColor: NAVY,
    border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 8,
    color: '#f0f4ff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
  }

  /* ════════════════════════════ RENDU ════════════════════════════ */
  return (
    <div style={{ padding: '2rem', color: '#f0f4ff', minHeight: '100vh' }}>
      <Toaster position="bottom-right" richColors />

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Beef style={{ width: 24, height: 24, color: GOLD }} />
            Alimentation
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.8rem', margin: 0 }}>
            {rations.length} aliments · {especesNourries} espèces · coût/jour {fmt(coutJourTotal)}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700,
            backgroundColor: GOLD, color: NAVY, border: 'none', cursor: 'pointer',
          }}
        >
          <Plus style={{ width: 15, height: 15 }} />
          Nouvel aliment
        </button>
      </div>

      {/* ── Bannière alerte ── */}
      {alertActive && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12, padding: '0.9rem 1.25rem', marginBottom: '1.5rem',
        }}>
          <AlertTriangle style={{ width: 18, height: 18, color: '#f87171', flexShrink: 0 }} />
          <span style={{ fontSize: '0.85rem', color: '#fca5a5' }}>
            {enRupture > 0 && <><strong>{enRupture} aliment{enRupture > 1 ? 's' : ''} en rupture</strong>{stockFaible > 0 ? ' · ' : ''}</>}
            {stockFaible > 0 && <><strong>{stockFaible} en stock faible</strong></>}
            {' '}— Commandez dès maintenant pour éviter l&apos;interruption des rations.
          </span>
        </div>
      )}

      {/* ── KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Coût alimentation/jour', value: fmt(coutJourTotal), icon: CreditCard, color: GOLD },
          { label: 'Espèces nourries',        value: `${especesNourries} espèces`,        icon: Beef,          color: CYAN },
          { label: 'Aliments en rupture',     value: `${enRupture} aliment${enRupture !== 1 ? 's' : ''}`,  icon: AlertTriangle, color: '#f87171' },
          { label: 'Stock faible',            value: `${stockFaible} aliment${stockFaible !== 1 ? 's' : ''}`, icon: AlertCircle, color: '#fb923c' },
        ].map(k => (
          <div key={k.label} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: k.color, borderRadius: '16px 16px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.4rem' }}>{k.label}</p>
                <p style={{ color: k.color, fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{k.value}</p>
              </div>
              <k.icon style={{ width: 20, height: 20, color: k.color, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
        {/* BarChart coût par espèce */}
        <div style={card}>
          <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 1rem', fontWeight: 600 }}>
            Coût journalier par espèce (FCFA)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
              <XAxis dataKey="espece" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                tickFormatter={v => (v / 1000).toFixed(0) + 'k'} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111e35', border: `1px solid ${BORDER}`, borderRadius: 10, color: '#f0f4ff', fontSize: 12 }}
                formatter={(v: number) => [fmt(v), 'Coût/jour']}
              />
              <Bar dataKey="cout" fill={GOLD} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PieChart répartition types */}
        <div style={card}>
          <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 1rem', fontWeight: 600 }}>
            Répartition par type d&apos;aliment
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={38}>
                {pieData.map(entry => (
                  <Cell key={entry.name} fill={TYPE_COLOR[entry.name as TypeAliment] ?? GOLD} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8}
                formatter={(v) => <span style={{ color: '#8899bb', fontSize: 11 }}>{v}</span>} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111e35', border: `1px solid ${BORDER}`, borderRadius: 10, color: '#f0f4ff', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Filtres ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Recherche */}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#8899bb' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un aliment…"
            style={{ ...inputStyle, paddingLeft: '2rem' }}
          />
        </div>
        {/* Filtre espèce */}
        <div style={{ position: 'relative' }}>
          <Filter style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#8899bb' }} />
          <select value={filterEsp} onChange={e => setFilterEsp(e.target.value as Espece | 'all')}
            style={{ ...inputStyle, paddingLeft: '2rem', width: 'auto', appearance: 'none', cursor: 'pointer' }}>
            <option value="all">Toutes espèces</option>
            {ESPECES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        {/* Filtre type */}
        <select value={filterType} onChange={e => setFilterType(e.target.value as TypeAliment | 'all')}
          style={{ ...inputStyle, width: 'auto', appearance: 'none', cursor: 'pointer' }}>
          <option value="all">Tous types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      <div style={{ ...card, padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Aliment', 'Espèce', 'Type', 'Qté/jour', 'Stock dispo', 'Coût/jour', 'Statut', 'Remplissage'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const ecol = ESPECE_COLOR[r.espece]
              const tcol = TYPE_COLOR[r.typeAliment]
              const ss   = STATUT_STYLE[r.statut]
              const pct  = r.seuilAlerte > 0
                ? Math.min(100, Math.round((r.stockDisponible / (r.seuilAlerte * 3)) * 100))
                : 100
              return (
                <tr
                  key={r.id}
                  onClick={() => setDetailRation(r)}
                  style={{
                    borderBottom: `1px solid rgba(255,255,255,0.04)`,
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                    backgroundColor: i % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent')}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.85rem' }}>{r.nom}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, backgroundColor: `${ecol}18`, color: ecol }}>
                      {r.espece}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, backgroundColor: `${tcol}18`, color: tcol }}>
                      {r.typeAliment}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontFamily: 'monospace', color: CYAN }}>
                    {r.quantiteJournaliere % 1 === 0 ? r.quantiteJournaliere.toFixed(0) : r.quantiteJournaliere} {r.unite}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontFamily: 'monospace', color: r.statut === 'Rupture' ? '#f87171' : '#f0f4ff' }}>
                    {r.stockDisponible} {r.unite}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: GOLD }}>
                    {fmt(r.coutJournalier)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.7rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, backgroundColor: ss.bg, color: ss.color }}>
                      {r.statut}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', minWidth: 100 }}>
                    <div style={{ height: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`, borderRadius: 99,
                        backgroundColor: pct < 20 ? '#f87171' : pct < 40 ? '#fb923c' : '#4ade80',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#8899bb', marginTop: 2, display: 'block' }}>{pct}%</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: `2px solid rgba(255,255,255,0.1)`, backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <td colSpan={6} style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#8899bb', fontWeight: 600 }}>
                TOTAL — {filtered.length} aliment{filtered.length > 1 ? 's' : ''}
              </td>
              <td colSpan={2} style={{ padding: '0.85rem 1rem', fontSize: '0.95rem', fontWeight: 800, color: GOLD }}>
                {fmt(filtered.reduce((s, r) => s + r.coutJournalier, 0))} / jour
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ═══ Modal Détail ration ═══ */}
      {detailRation && (
        <div
          onClick={() => setDetailRation(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: '#111e35', border: `1px solid rgba(255,255,255,0.14)`, borderRadius: 20, padding: '1.75rem', width: '100%', maxWidth: 460, position: 'relative' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wheat style={{ width: 16, height: 16, color: GOLD }} />
                {detailRation.nom}
              </h2>
              <button onClick={() => setDetailRation(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8899bb' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* statut badge */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ padding: '0.3rem 0.9rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, ...STATUT_STYLE[detailRation.statut] }}>
                {detailRation.statut}
              </span>
            </div>

            {/* infos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem', fontSize: '0.83rem' }}>
              {[
                ['Espèce',         detailRation.espece],
                ['Type',           detailRation.typeAliment],
                ['Qté / jour',     `${detailRation.quantiteJournaliere} ${detailRation.unite}`],
                ['Coût unitaire',  `${detailRation.coutUnitaire.toLocaleString('fr-FR')} FCFA/${detailRation.unite}`],
                ['Coût journalier', fmt(detailRation.coutJournalier)],
                ['Fournisseur',    detailRation.fournisseur],
                ['Stock dispo',    `${detailRation.stockDisponible} ${detailRation.unite}`],
                ['Seuil alerte',   `${detailRation.seuilAlerte} ${detailRation.unite}`],
                ['Dernier appro',  detailRation.dateAppro],
              ].map(([l, v]) => (
                <div key={l}>
                  <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.4, margin: '0 0 0.15rem', fontWeight: 600 }}>{l}</p>
                  <p style={{ color: '#f0f4ff', fontWeight: 600, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>

            {/* barre stock */}
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ color: '#8899bb', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.4, margin: '0 0 0.4rem', fontWeight: 600 }}>Niveau de stock</p>
              <div style={{ height: 8, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                {(() => {
                  const pct = detailRation.seuilAlerte > 0
                    ? Math.min(100, Math.round((detailRation.stockDisponible / (detailRation.seuilAlerte * 3)) * 100)) : 100
                  return <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, backgroundColor: pct < 20 ? '#f87171' : pct < 40 ? '#fb923c' : '#4ade80' }} />
                })()}
              </div>
            </div>

            {/* boutons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setDetailRation(null)}
                style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb', border: 'none', cursor: 'pointer' }}
              >
                Fermer
              </button>
              <button
                onClick={() => { handleCommander(detailRation); setDetailRation(null) }}
                style={{ flex: 2, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, backgroundColor: GOLD, color: NAVY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <ShoppingCart style={{ width: 15, height: 15 }} />
                Commander
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal Nouvel aliment ═══ */}
      {showAdd && (
        <div
          onClick={() => setShowAdd(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: '#111e35', border: `1px solid rgba(255,255,255,0.14)`, borderRadius: 20, padding: '1.75rem', width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus style={{ width: 16, height: 16, color: GOLD }} />
                Nouvel aliment
              </h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8899bb' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* Nom */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Nom de l&apos;aliment *</label>
                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex : Maïs concassé" style={inputStyle} />
              </div>

              {/* Espèce */}
              <div>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Espèce</label>
                <select value={form.espece} onChange={e => setForm(f => ({ ...f, espece: e.target.value as Espece }))} style={{ ...inputStyle, appearance: 'none' }}>
                  {ESPECES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              {/* Type */}
              <div>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Type d&apos;aliment</label>
                <select value={form.typeAliment} onChange={e => setForm(f => ({ ...f, typeAliment: e.target.value as TypeAliment }))} style={{ ...inputStyle, appearance: 'none' }}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Quantité */}
              <div>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Qté journalière *</label>
                <input type="number" value={form.quantiteJournaliere} onChange={e => setForm(f => ({ ...f, quantiteJournaliere: e.target.value }))} placeholder="0.0" style={inputStyle} />
              </div>

              {/* Unité */}
              <div>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Unité</label>
                <select value={form.unite} onChange={e => setForm(f => ({ ...f, unite: e.target.value }))} style={{ ...inputStyle, appearance: 'none' }}>
                  {['kg', 'L', 'g', 'unité'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              {/* Coût unitaire */}
              <div>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Coût unitaire (FCFA)</label>
                <input type="number" value={form.coutUnitaire} onChange={e => setForm(f => ({ ...f, coutUnitaire: e.target.value }))} placeholder="500" style={inputStyle} />
              </div>

              {/* Stock dispo */}
              <div>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Stock disponible</label>
                <input type="number" value={form.stockDisponible} onChange={e => setForm(f => ({ ...f, stockDisponible: e.target.value }))} placeholder="100" style={inputStyle} />
              </div>

              {/* Seuil alerte */}
              <div>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Seuil alerte</label>
                <input type="number" value={form.seuilAlerte} onChange={e => setForm(f => ({ ...f, seuilAlerte: e.target.value }))} placeholder="20" style={inputStyle} />
              </div>

              {/* Fournisseur */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Fournisseur</label>
                <input value={form.fournisseur} onChange={e => setForm(f => ({ ...f, fournisseur: e.target.value }))} placeholder="Agro-BF Ouaga" style={inputStyle} />
              </div>

              {/* Date appro */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Date dernier appro</label>
                <input type="date" value={form.dateAppro} onChange={e => setForm(f => ({ ...f, dateAppro: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb', border: 'none', cursor: 'pointer' }}>
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.nom || !form.quantiteJournaliere}
                style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, backgroundColor: form.nom && form.quantiteJournaliere ? GOLD : 'rgba(212,175,55,0.4)', color: NAVY, border: 'none', cursor: form.nom && form.quantiteJournaliere ? 'pointer' : 'not-allowed' }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
