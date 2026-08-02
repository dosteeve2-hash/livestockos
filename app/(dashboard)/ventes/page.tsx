'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { toast, Toaster } from 'sonner'
import { ShoppingCart, TrendingUp, Package, Plus, X, Search, CheckCircle, Clock, XCircle, FileText } from 'lucide-react'

type StatutVente = 'Confirmée' | 'En cours' | 'Annulée'
type TypeAnimal = 'Bovin' | 'Ovin' | 'Caprin' | 'Volaille' | 'Porcin'
type ModePaiement = 'Espèces' | 'Orange Money' | 'Wave' | 'Virement' | 'Crédit'

interface Vente {
  id: string; animal: string; type: TypeAnimal; quantite: number; prixUnitaire: number
  acheteur: string; telephone: string; modePaiement: ModePaiement; date: string; statut: StatutVente; notes: string
}

const VENTES_INIT: Vente[] = [
  { id: 'VTE-001', animal: 'Bovin adulte (BV-105)', type: 'Bovin', quantite: 1, prixUnitaire: 280000, acheteur: 'Ouédraogo Seydou', telephone: '+226 70 11 22 33', modePaiement: 'Espèces', date: '2026-07-28', statut: 'Confirmée', notes: 'Marché de Koubri' },
  { id: 'VTE-002', animal: 'Ovin bélier reproducteur', type: 'Ovin', quantite: 2, prixUnitaire: 75000, acheteur: 'Kaboré Ali', telephone: '+226 76 55 44 33', modePaiement: 'Orange Money', date: '2026-07-25', statut: 'Confirmée', notes: 'Préparation Tabaski' },
  { id: 'VTE-003', animal: 'Poulet de chair', type: 'Volaille', quantite: 80, prixUnitaire: 2500, acheteur: 'Traoré Mariam', telephone: '+226 65 12 00 78', modePaiement: 'Wave', date: '2026-07-22', statut: 'Confirmée', notes: 'Contrat hebdo restaurant' },
  { id: 'VTE-004', animal: 'Caprin chèvre laitière', type: 'Caprin', quantite: 3, prixUnitaire: 45000, acheteur: 'Sawadogo Issa', telephone: '+226 71 88 99 00', modePaiement: 'Crédit', date: '2026-07-30', statut: 'En cours', notes: 'Paiement échelonné 2 mois' },
  { id: 'VTE-005', animal: 'Bovin veau sevré', type: 'Bovin', quantite: 2, prixUnitaire: 120000, acheteur: 'Zongo Prosper', telephone: '+226 70 44 55 66', modePaiement: 'Virement', date: '2026-07-18', statut: 'Confirmée', notes: 'Client fidèle, remise 5%' },
  { id: 'VTE-006', animal: 'Ovin mouton engraissé', type: 'Ovin', quantite: 5, prixUnitaire: 60000, acheteur: 'Coulibaly Moussa', telephone: '+226 75 33 22 11', modePaiement: 'Espèces', date: '2026-07-15', statut: 'Confirmée', notes: 'Livraison Bobo-Dioulasso' },
  { id: 'VTE-007', animal: 'Poulet pondeuse réformée', type: 'Volaille', quantite: 40, prixUnitaire: 1800, acheteur: 'Yameogo Cécile', telephone: '+226 66 77 88 99', modePaiement: 'Orange Money', date: '2026-08-01', statut: 'En cours', notes: 'En attente de collecte' },
  { id: 'VTE-008', animal: 'Bovin adulte (BV-108)', type: 'Bovin', quantite: 1, prixUnitaire: 320000, acheteur: 'Diallo Mamadou', telephone: '+226 70 22 33 44', modePaiement: 'Espèces', date: '2026-07-10', statut: 'Annulée', notes: 'Animal trop jeune selon acheteur' },
]

const CA_DATA = [{ mois: 'Fév', ca: 420 }, { mois: 'Mar', ca: 680 }, { mois: 'Avr', ca: 510 }, { mois: 'Mai', ca: 750 }, { mois: 'Jun', ca: 890 }, { mois: 'Jul', ca: 1120 }]
const TYPE_DATA = [{ type: 'Bovin', v: 4 }, { type: 'Ovin', v: 7 }, { type: 'Caprin', v: 3 }, { type: 'Volaille', v: 12 }, { type: 'Porcin', v: 1 }]

const NAVY = '#0A1628'; const GOLD = '#D4AF37'; const CYAN = '#00D4FF'; const BORDER = 'rgba(255,255,255,0.08)'; const BG2 = '#0c1a34'
const STATUT_CFG: Record<StatutVente, { color: string; bg: string; icon: React.ElementType }> = {
  'Confirmée': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: CheckCircle },
  'En cours': { color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: Clock },
  'Annulée': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: XCircle },
}
const PAY_COLOR: Record<ModePaiement, string> = { 'Espèces': '#22c55e', 'Orange Money': '#FF6B35', 'Wave': '#4A90D9', 'Virement': CYAN, 'Crédit': '#ef4444' }

export default function VentesPage() {
  const [ventes, setVentes] = useState<Vente[]>(VENTES_INIT)
  const [search, setSearch] = useState('')
  const [filtre, setFiltre] = useState<StatutVente | 'Tous'>('Tous')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<Vente | null>(null)
  const [form, setForm] = useState({ animal: '', type: 'Bovin' as TypeAnimal, quantite: '1', prixUnitaire: '', acheteur: '', telephone: '', modePaiement: 'Espèces' as ModePaiement, notes: '' })

  const filtered = useMemo(() => ventes.filter(v => {
    const q = search.toLowerCase()
    return (filtre === 'Tous' || v.statut === filtre) && (v.animal.toLowerCase().includes(q) || v.acheteur.toLowerCase().includes(q) || v.id.toLowerCase().includes(q))
  }), [ventes, search, filtre])

  const caTotal = ventes.filter(v => v.statut === 'Confirmée').reduce((s, v) => s + v.quantite * v.prixUnitaire, 0)
  const nbConf = ventes.filter(v => v.statut === 'Confirmée').length
  const nbEnCours = ventes.filter(v => v.statut === 'En cours').length
  const ticket = nbConf > 0 ? Math.round(caTotal / nbConf) : 0

  const act = (id: string, statut: StatutVente) => {
    setVentes(p => p.map(v => v.id === id ? { ...v, statut } : v))
    toast[statut === 'Confirmée' ? 'success' : 'error'](`Vente ${id} ${statut.toLowerCase()}`)
    setSelected(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.animal || !form.acheteur || !form.prixUnitaire) return
    const v: Vente = { id: `VTE-${String(ventes.length + 1).padStart(3, '0')}`, ...form, quantite: Number(form.quantite) || 1, prixUnitaire: Number(form.prixUnitaire), date: new Date().toISOString().slice(0, 10), statut: 'En cours' }
    setVentes(p => [v, ...p])
    toast.success(`Vente ${v.id} enregistrée`)
    setShowModal(false)
    setForm({ animal: '', type: 'Bovin', quantite: '1', prixUnitaire: '', acheteur: '', telephone: '', modePaiement: 'Espèces', notes: '' })
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto', color: '#f0f4ff' }}>
      <Toaster position="bottom-right" richColors />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: GOLD, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShoppingCart size={22} /> Ventes Animales</h1>
          <p style={{ color: 'rgba(240,244,255,0.45)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>Suivi des transactions — {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: GOLD, color: NAVY, border: 'none', borderRadius: 8, padding: '0.65rem 1.1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}><Plus size={16} /> Nouvelle vente</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'CA confirmé', value: `${(caTotal / 1000).toFixed(0)}k FCFA`, color: GOLD, icon: TrendingUp },
          { label: 'Ventes confirmées', value: String(nbConf), color: '#22c55e', icon: CheckCircle },
          { label: 'En cours', value: String(nbEnCours), color: '#f97316', icon: Clock },
          { label: 'Ticket moyen', value: `${(ticket / 1000).toFixed(0)}k FCFA`, color: CYAN, icon: Package },
        ].map(k => (
          <div key={k.label} style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'rgba(240,244,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{k.label}</p>
              <k.icon size={15} style={{ color: k.color }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: k.color, margin: 0 }}>{k.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1.25rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f4ff', margin: '0 0 1rem' }}>CA mensuel (milliers FCFA)</h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={CA_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="mois" tick={{ fill: 'rgba(240,244,255,0.4)', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(240,244,255,0.4)', fontSize: 11 }} tickLine={false} />
              <Tooltip contentStyle={{ background: NAVY, border: `1px solid ${BORDER}`, borderRadius: 8 }} formatter={(v) => [`${v}k`, 'CA']} />
              <Line type="monotone" dataKey="ca" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1.25rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f4ff', margin: '0 0 1rem' }}>Ventes par espèce</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={TYPE_DATA} layout="vertical" barSize={12}>
              <XAxis type="number" tick={{ fill: 'rgba(240,244,255,0.4)', fontSize: 11 }} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fill: 'rgba(240,244,255,0.4)', fontSize: 11 }} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: NAVY, border: `1px solid ${BORDER}`, borderRadius: 8 }} formatter={(v) => [v, 'ventes']} />
              <Bar dataKey="v" fill={CYAN} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,244,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher animal, acheteur, N°…"
            style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f4ff', fontSize: '0.875rem' }} />
        </div>
        {(['Tous', 'Confirmée', 'En cours', 'Annulée'] as const).map(s => (
          <button key={s} onClick={() => setFiltre(s)} style={{ padding: '0.4rem 0.85rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', background: filtre === s ? GOLD : BG2, color: filtre === s ? NAVY : 'rgba(240,244,255,0.5)' }}>{s}</button>
        ))}
      </div>
      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: 800 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
              {['N°', 'Animal', 'Qté × Prix', 'Total', 'Acheteur', 'Paiement', 'Date', 'Statut'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(240,244,255,0.35)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => {
              const cfg = STATUT_CFG[v.statut]; const SI = cfg.icon
              return (
                <tr key={v.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer' }}
                  onClick={() => setSelected(v)}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '0.75rem 1rem', color: GOLD, fontWeight: 700, fontSize: '0.8rem' }}>{v.id}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{v.animal}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(240,244,255,0.4)' }}>{v.type}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(240,244,255,0.6)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{v.quantite} × {v.prixUnitaire.toLocaleString('fr-FR')}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{(v.quantite * v.prixUnitaire).toLocaleString('fr-FR')} FCFA</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{v.acheteur}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(240,244,255,0.4)' }}>{v.telephone}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', fontWeight: 600, color: PAY_COLOR[v.modePaiement] }}>{v.modePaiement}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'rgba(240,244,255,0.5)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{v.date}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}><SI size={11} />{v.statut}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(240,244,255,0.3)' }}>Aucune vente trouvée</div>}
      </div>
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0f1f3d', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 500, position: 'relative' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(240,244,255,0.5)' }}><X size={18} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <FileText size={20} style={{ color: GOLD }} />
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f0f4ff', margin: 0 }}>{selected.id}</h2>
                <p style={{ fontSize: '0.75rem', color: 'rgba(240,244,255,0.4)', margin: 0 }}>{selected.animal} · {selected.type}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Acheteur', value: selected.acheteur, color: '#f0f4ff' },
                { label: 'Téléphone', value: selected.telephone, color: 'rgba(240,244,255,0.6)' },
                { label: 'Quantité', value: `${selected.quantite} tête(s)`, color: '#f0f4ff' },
                { label: 'Total', value: `${(selected.quantite * selected.prixUnitaire).toLocaleString('fr-FR')} FCFA`, color: GOLD },
                { label: 'Paiement', value: selected.modePaiement, color: PAY_COLOR[selected.modePaiement] },
                { label: 'Date', value: selected.date, color: 'rgba(240,244,255,0.6)' },
                { label: 'Notes', value: selected.notes || '—', color: 'rgba(240,244,255,0.5)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ minWidth: 100, fontSize: '0.75rem', fontWeight: 700, color: 'rgba(240,244,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em', paddingTop: 2 }}>{label}</span>
                  <span style={{ fontSize: '0.875rem', color }}>{value}</span>
                </div>
              ))}
            </div>
            {selected.statut === 'En cours' && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => act(selected.id, 'Annulée')} style={{ flex: 1, padding: '0.65rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}>Annuler</button>
                <button onClick={() => act(selected.id, 'Confirmée')} style={{ flex: 1, padding: '0.65rem', background: '#22c55e', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Confirmer</button>
              </div>
            )}
          </div>
        </div>
      )}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0f1f3d', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(240,244,255,0.5)' }}><X size={18} /></button>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f0f4ff', marginBottom: '1.5rem' }}>Nouvelle vente</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Animal vendu', key: 'animal', placeholder: 'ex: Bovin adulte (BV-105)' },
                { label: 'Quantité', key: 'quantite', placeholder: '1', type: 'number' },
                { label: 'Prix unitaire (FCFA)', key: 'prixUnitaire', placeholder: 'ex: 280000', type: 'number' },
                { label: 'Acheteur', key: 'acheteur', placeholder: 'Nom complet' },
                { label: 'Téléphone', key: 'telephone', placeholder: '+226 70 00 00 00' },
                { label: 'Notes', key: 'notes', placeholder: 'Lieu, conditions…' },
              ].map(f => (
                <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(240,244,255,0.45)' }}>{f.label}</span>
                  <input type={f.type ?? 'text'} placeholder={f.placeholder} value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ padding: '0.6rem 0.75rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f4ff', fontSize: '0.875rem' }} />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(240,244,255,0.45)' }}>Espèce</span>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as TypeAnimal }))}
                  style={{ padding: '0.6rem 0.75rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f4ff', fontSize: '0.875rem' }}>
                  {(['Bovin', 'Ovin', 'Caprin', 'Volaille', 'Porcin'] as TypeAnimal[]).map(o => <option key={o}>{o}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(240,244,255,0.45)' }}>Mode de paiement</span>
                <select value={form.modePaiement} onChange={e => setForm(p => ({ ...p, modePaiement: e.target.value as ModePaiement }))}
                  style={{ padding: '0.6rem 0.75rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#f0f4ff', fontSize: '0.875rem' }}>
                  {(['Espèces', 'Orange Money', 'Wave', 'Virement', 'Crédit'] as ModePaiement[]).map(o => <option key={o}>{o}</option>)}
                </select>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.65rem', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: 'rgba(240,244,255,0.6)', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
                <button type="submit" style={{ flex: 1, padding: '0.65rem', background: GOLD, border: 'none', borderRadius: 8, color: NAVY, cursor: 'pointer', fontWeight: 700 }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
