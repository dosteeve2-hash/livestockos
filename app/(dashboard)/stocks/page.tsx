'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { toast, Toaster } from 'sonner'
import {
  Package, AlertTriangle, TrendingDown, Plus, X, Search, Filter,
  ArrowUpRight, ArrowDownRight, Boxes, Warehouse,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Categorie = 'Aliment' | 'Médicament' | 'Matériel' | 'Vaccin' | 'Désinfectant'
type Statut = 'OK' | 'Faible' | 'Rupture'

interface StockItem {
  id: string
  nom: string
  categorie: Categorie
  quantite: number
  unite: string
  seuilAlerte: number
  prixUnitaire: number
  fournisseur: string
  dateExpiration: string | null
  dernierMouvement: string
}

interface Mouvement {
  id: string
  produit: string
  type: 'Entrée' | 'Sortie'
  quantite: number
  date: string
  note: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STOCKS_INIT: StockItem[] = [
  { id: 'STK-001', nom: 'Maïs concassé',          categorie: 'Aliment',       quantite: 850,  unite: 'kg',     seuilAlerte: 200,  prixUnitaire: 180,    fournisseur: 'Grain BF SARL',    dateExpiration: null,       dernierMouvement: '2026-07-30' },
  { id: 'STK-002', nom: 'Son de blé',              categorie: 'Aliment',       quantite: 320,  unite: 'kg',     seuilAlerte: 100,  prixUnitaire: 120,    fournisseur: 'Grain BF SARL',    dateExpiration: null,       dernierMouvement: '2026-07-28' },
  { id: 'STK-003', nom: 'Tourteau de coton',       categorie: 'Aliment',       quantite: 60,   unite: 'kg',     seuilAlerte: 80,   prixUnitaire: 210,    fournisseur: 'AgroSupply BF',    dateExpiration: null,       dernierMouvement: '2026-07-25' },
  { id: 'STK-004', nom: 'Oxytétracycline 20%',    categorie: 'Médicament',    quantite: 12,   unite: 'flacons', seuilAlerte: 5,   prixUnitaire: 4500,   fournisseur: 'PharmVet Ouaga',   dateExpiration: '2027-03-01', dernierMouvement: '2026-07-20' },
  { id: 'STK-005', nom: 'Imidocarbe (Imizol)',     categorie: 'Médicament',    quantite: 3,    unite: 'flacons', seuilAlerte: 5,   prixUnitaire: 8200,   fournisseur: 'PharmVet Ouaga',   dateExpiration: '2026-12-01', dernierMouvement: '2026-07-30' },
  { id: 'STK-006', nom: 'Vaccin Newcastle ND',     categorie: 'Vaccin',        quantite: 0,    unite: 'doses',  seuilAlerte: 50,   prixUnitaire: 250,    fournisseur: 'LNSP-Vét BF',      dateExpiration: '2026-10-01', dernierMouvement: '2026-07-26' },
  { id: 'STK-007', nom: 'Vaccin PPCB',             categorie: 'Vaccin',        quantite: 80,   unite: 'doses',  seuilAlerte: 30,   prixUnitaire: 350,    fournisseur: 'LNSP-Vét BF',      dateExpiration: '2027-01-01', dernierMouvement: '2026-07-15' },
  { id: 'STK-008', nom: 'Auge en plastique 30L',   categorie: 'Matériel',      quantite: 14,   unite: 'unités', seuilAlerte: 5,   prixUnitaire: 2500,   fournisseur: 'Plastique BF',     dateExpiration: null,        dernierMouvement: '2026-07-01' },
  { id: 'STK-009', nom: 'Corde d\'attache',         categorie: 'Matériel',      quantite: 45,   unite: 'mètres', seuilAlerte: 20,  prixUnitaire: 150,    fournisseur: 'Quincaillerie Yam', dateExpiration: null,       dernierMouvement: '2026-07-10' },
  { id: 'STK-010', nom: 'Formol 40% (Formaline)',  categorie: 'Désinfectant',  quantite: 8,    unite: 'litres', seuilAlerte: 3,   prixUnitaire: 1800,   fournisseur: 'PharmVet Ouaga',   dateExpiration: '2028-01-01', dernierMouvement: '2026-07-22' },
  { id: 'STK-011', nom: 'Mineral Mix bovin',        categorie: 'Aliment',       quantite: 22,   unite: 'kg',     seuilAlerte: 15,  prixUnitaire: 1200,   fournisseur: 'AgroSupply BF',    dateExpiration: null,        dernierMouvement: '2026-07-29' },
  { id: 'STK-012', nom: 'Seringues 20ml',           categorie: 'Matériel',      quantite: 38,   unite: 'unités', seuilAlerte: 20,  prixUnitaire: 200,    fournisseur: 'PharmVet Ouaga',   dateExpiration: null,        dernierMouvement: '2026-07-18' },
]

const MOUVEMENTS_INIT: Mouvement[] = [
  { id: 'MV-001', produit: 'Maïs concassé',      type: 'Entrée',  quantite: 500, date: '2026-07-30', note: 'Livraison Grain BF' },
  { id: 'MV-002', produit: 'Vaccin Newcastle ND', type: 'Sortie',  quantite: 100, date: '2026-07-26', note: 'Vaccination lot Pondeuses B (épuisé)' },
  { id: 'MV-003', produit: 'Oxytétracycline 20%', type: 'Sortie',  quantite: 2,   date: '2026-07-25', note: 'Traitement lot Ovins C' },
  { id: 'MV-004', produit: 'Son de blé',           type: 'Entrée',  quantite: 200, date: '2026-07-28', note: 'Réapprovisionnement' },
  { id: 'MV-005', produit: 'Imidocarbe (Imizol)',  type: 'Sortie',  quantite: 1,   date: '2026-07-30', note: 'Traitement Rokia (BV-104)' },
]

const CONSOMMATION_DATA = [
  { mois: 'Fév', kg: 1200 }, { mois: 'Mar', kg: 980 }, { mois: 'Avr', kg: 1050 },
  { mois: 'Mai', kg: 890 }, { mois: 'Jun', kg: 1150 }, { mois: 'Jul', kg: 1020 },
]

const NAVY = '#0A1628'; const GOLD = '#D4AF37'; const CYAN = '#00D4FF'
const BORDER = 'rgba(255,255,255,0.08)'; const BG2 = '#0c1a34'

function getStatut(item: StockItem): Statut {
  if (item.quantite === 0) return 'Rupture'
  if (item.quantite <= item.seuilAlerte) return 'Faible'
  return 'OK'
}

const STATUT_STYLE: Record<Statut, { color: string; bg: string; label: string }> = {
  OK:      { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   label: 'OK' },
  Faible:  { color: '#f97316', bg: 'rgba(249,115,22,0.12)',  label: 'Faible' },
  Rupture: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Rupture' },
}

export default function StocksPage() {
  const [stocks, setStocks]       = useState<StockItem[]>(STOCKS_INIT)
  const [mouvements]              = useState<Mouvement[]>(MOUVEMENTS_INIT)
  const [search, setSearch]       = useState('')
  const [catFiltre, setCatFiltre] = useState<Categorie | 'Tous'>('Tous')
  const [onglet, setOnglet]       = useState<'stocks' | 'mouvements'>('stocks')
  const [showModal, setShowModal] = useState(false)
  const [newItem, setNewItem]     = useState({ nom: '', categorie: 'Aliment' as Categorie, quantite: '', unite: 'kg', seuilAlerte: '', prixUnitaire: '', fournisseur: '' })

  const filtered = useMemo(() => stocks.filter(s => {
    const q = search.toLowerCase()
    const matchC = catFiltre === 'Tous' || s.categorie === catFiltre
    const matchQ = s.nom.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.fournisseur.toLowerCase().includes(q)
    return matchC && matchQ
  }), [stocks, search, catFiltre])

  const ruptures = stocks.filter(s => getStatut(s) === 'Rupture').length
  const faibles  = stocks.filter(s => getStatut(s) === 'Faible').length
  const valeurTotale = stocks.reduce((acc, s) => acc + s.quantite * s.prixUnitaire, 0)
  const references = stocks.length

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newItem.nom || !newItem.quantite) return
    const item: StockItem = {
      id: `STK-${String(stocks.length + 1).padStart(3, '0')}`,
      nom: newItem.nom,
      categorie: newItem.categorie,
      quantite: Number(newItem.quantite),
      unite: newItem.unite,
      seuilAlerte: Number(newItem.seuilAlerte) || 10,
      prixUnitaire: Number(newItem.prixUnitaire) || 0,
      fournisseur: newItem.fournisseur,
      dateExpiration: null,
      dernierMouvement: new Date().toISOString().slice(0, 10),
    }
    setStocks(prev => [item, ...prev])
    toast.success(`${item.id} ajouté au stock`)
    setShowModal(false)
    setNewItem({ nom: '', categorie: 'Aliment', quantite: '', unite: 'kg', seuilAlerte: '', prixUnitaire: '', fournisseur: '' })
  }

  const CATEGORIES: (Categorie | 'Tous')[] = ['Tous', 'Aliment', 'Médicament', 'Vaccin', 'Matériel', 'Désinfectant']

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto', color: '#f0f4ff' }}>
      <Toaster position="bottom-right" richColors />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: GOLD, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Warehouse size={22} /> Gestion des Stocks
          </h1>
          <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
            Intrants, médicaments, matériel — {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: GOLD, color: NAVY, border: 'none', borderRadius: 8, padding: '0.65rem 1.1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
          <Plus size={16} /> Nouveau produit
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Références',      value: references.toString(), color: CYAN,      icon: Boxes },
          { label: 'Ruptures stock',  value: ruptures.toString(),   color: '#ef4444', icon: TrendingDown },
          { label: 'Niveaux faibles', value: faibles.toString(),    color: '#f97316', icon: AlertTriangle },
          { label: 'Valeur stock',    value: `${(valeurTotale / 1000).toFixed(0)}k FCFA`, color: GOLD, icon: Package },
        ].map(k => (
          <div key={k.label} style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'rgba(240,244,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{k.label}</p>
              <k.icon size={15} style={{ color: k.color }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: k.color, margin: 0 }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Chart consommation aliments */}
      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f4ff', margin: '0 0 1rem' }}>Consommation alimentaire mensuelle (kg)</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={CONSOMMATION_DATA} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="mois" tick={{ fill: 'rgba(240,244,255,0.4)', fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(240,244,255,0.4)', fontSize: 11 }} tickLine={false} />
            <Tooltip contentStyle={{ background: NAVY, border: `1px solid ${BORDER}`, borderRadius: 8 }} formatter={(v) => [`${v} kg`, 'Consommé']} />
            <Bar dataKey="kg" fill={GOLD} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: `1px solid ${BORDER}`, paddingBottom: '0.5rem' }}>
        {(['stocks', 'mouvements'] as const).map(o => (
          <button key={o} onClick={() => setOnglet(o)}
            style={{ padding: '0.4rem 1rem', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', border: 'none', textTransform: 'capitalize',
              background: onglet === o ? GOLD : 'transparent',
              color: onglet === o ? NAVY : 'rgba(240,244,255,0.5)' }}>
            {o === 'stocks' ? 'Inventaire' : 'Mouvements'}
          </button>
        ))}
      </div>

      {onglet === 'stocks' && (
        <>
          {/* Filtres */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,244,255,0.3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher produit, fournisseur…"
                style={{ width: '100%', paddingLeft: '2.2rem', padding: '0.5rem 0.75rem 0.5rem 2.2rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f4ff', fontSize: '0.875rem' }} />
            </div>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFiltre(c)}
                style={{ padding: '0.4rem 0.85rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                  background: catFiltre === c ? CYAN : BG2,
                  color: catFiltre === c ? NAVY : 'rgba(240,244,255,0.5)' }}>
                {c}
              </button>
            ))}
          </div>

          {/* Alertes */}
          {(ruptures > 0 || faibles > 0) && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <AlertTriangle size={15} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ color: '#fca5a5' }}>
                {ruptures > 0 && <strong>{ruptures} rupture(s)</strong>}{ruptures > 0 && faibles > 0 && ' et '}{faibles > 0 && <strong>{faibles} stock(s) faible(s)</strong>} — réapprovisionnement urgent recommandé
              </span>
            </div>
          )}

          {/* Table stocks */}
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
                  {['N°', 'Produit', 'Catégorie', 'Quantité', 'Seuil alerte', 'Prix unit.', 'Fournisseur', 'Expiration', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(240,244,255,0.35)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const statut = getStatut(s)
                  const st = STATUT_STYLE[statut]
                  const pct = Math.min(100, (s.quantite / Math.max(s.seuilAlerte * 3, 1)) * 100)
                  return (
                    <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ padding: '0.75rem 1rem', color: GOLD, fontWeight: 700, fontSize: '0.8rem' }}>{s.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f0f4ff' }}>{s.nom}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: 'rgba(0,212,255,0.1)', color: CYAN }}>{s.categorie}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 100 }}>
                          <span style={{ fontWeight: 700, color: statut === 'Rupture' ? '#ef4444' : '#f0f4ff' }}>{s.quantite} {s.unite}</span>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: statut === 'OK' ? '#22c55e' : statut === 'Faible' ? '#f97316' : '#ef4444', borderRadius: 2 }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'rgba(240,244,255,0.5)', fontSize: '0.8rem' }}>{s.seuilAlerte} {s.unite}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'rgba(240,244,255,0.6)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{s.prixUnitaire.toLocaleString('fr-FR')} FCFA</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'rgba(240,244,255,0.5)', fontSize: '0.8rem' }}>{s.fournisseur}</td>
                      <td style={{ padding: '0.75rem 1rem', color: s.dateExpiration ? 'rgba(240,244,255,0.5)' : 'rgba(240,244,255,0.2)', fontSize: '0.78rem' }}>{s.dateExpiration ?? '—'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(240,244,255,0.3)' }}>Aucun produit trouvé</div>
            )}
          </div>
        </>
      )}

      {onglet === 'mouvements' && (
        <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
                {['N°', 'Produit', 'Type', 'Quantité', 'Date', 'Note'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(240,244,255,0.35)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mouvements.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: i < mouvements.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <td style={{ padding: '0.75rem 1rem', color: GOLD, fontWeight: 700, fontSize: '0.8rem' }}>{m.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f0f4ff' }}>{m.produit}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700,
                      background: m.type === 'Entrée' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: m.type === 'Entrée' ? '#22c55e' : '#ef4444' }}>
                      {m.type === 'Entrée' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {m.type}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#f0f4ff' }}>{m.quantite}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(240,244,255,0.5)', fontSize: '0.8rem' }}>{m.date}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(240,244,255,0.55)', fontSize: '0.85rem' }}>{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nouveau produit */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0f1f3d', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(240,244,255,0.5)' }}><X size={18} /></button>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f0f4ff', marginBottom: '1.5rem' }}>Nouveau produit en stock</h2>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Nom du produit', key: 'nom', placeholder: 'ex: Maïs concassé' },
                { label: 'Quantité initiale', key: 'quantite', placeholder: 'ex: 500', type: 'number' },
                { label: 'Unité', key: 'unite', placeholder: 'kg, litres, doses…' },
                { label: 'Seuil alerte', key: 'seuilAlerte', placeholder: 'ex: 100', type: 'number' },
                { label: 'Prix unitaire (FCFA)', key: 'prixUnitaire', placeholder: 'ex: 180', type: 'number' },
                { label: 'Fournisseur', key: 'fournisseur', placeholder: 'ex: Grain BF SARL' },
              ].map(f => (
                <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(240,244,255,0.45)' }}>{f.label}</span>
                  <input type={f.type ?? 'text'} placeholder={f.placeholder}
                    value={(newItem as Record<string, string>)[f.key]}
                    onChange={e => setNewItem(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ padding: '0.6rem 0.75rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f4ff', fontSize: '0.875rem' }} />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(240,244,255,0.45)' }}>Catégorie</span>
                <select value={newItem.categorie} onChange={e => setNewItem(p => ({ ...p, categorie: e.target.value as Categorie }))}
                  style={{ padding: '0.6rem 0.75rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f4ff', fontSize: '0.875rem' }}>
                  {(['Aliment', 'Médicament', 'Vaccin', 'Matériel', 'Désinfectant'] as Categorie[]).map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '0.65rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: 'rgba(240,244,255,0.6)', cursor: 'pointer', fontWeight: 600 }}>
                  Annuler
                </button>
                <button type="submit"
                  style={{ flex: 1, padding: '0.65rem', background: GOLD, border: 'none', borderRadius: 8, color: NAVY, cursor: 'pointer', fontWeight: 700 }}>
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
