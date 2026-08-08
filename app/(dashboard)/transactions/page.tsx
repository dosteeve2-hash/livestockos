'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { toast } from 'sonner'
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight,
  Search, Plus, X, FileText, Filter,
} from 'lucide-react'

/* ── Palette ─────────────────────────────────────────────────────────────── */
const NAVY   = '#0A1628'
const GOLD   = '#D4AF37'
const CYAN   = '#00D4FF'
const BG2    = '#0c1a34'
const BORDER = 'rgba(255,255,255,0.07)'
const GREEN  = '#22c55e'
const RED    = '#ef4444'
const ORANGE = '#f59e0b'
const TEXT   = '#f0f4ff'
const TEXT2  = 'rgba(240,244,255,0.55)'
const TEXT3  = 'rgba(240,244,255,0.3)'
const BG3    = '#0d1f3a'

/* ── Types ───────────────────────────────────────────────────────────────── */
type TypeTx = 'Vente animaux' | 'Vente lait' | 'Achat animaux' | 'Achat aliments' | 'Frais veto' | 'Salaires' | 'Autres'
type SensTx = 'entree' | 'sortie'

interface Transaction {
  id: string
  date: string
  libelle: string
  type: TypeTx
  sens: SensTx
  montant: number
  reference: string
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const TX: Transaction[] = [
  { id:'T01', date:'2026-08-06', libelle:'Vente 8 moutons — marche Ouaga',                  type:'Vente animaux',  sens:'entree', montant:960_000,   reference:'VT-2026-089' },
  { id:'T02', date:'2026-08-05', libelle:'Livraison lait pasteurise 320L — Hotel Laico',    type:'Vente lait',     sens:'entree', montant:384_000,   reference:'VT-2026-088' },
  { id:'T03', date:'2026-08-04', libelle:'Achat tourteau de coton 500kg — SOFITEX',         type:'Achat aliments', sens:'sortie', montant:275_000,   reference:'AC-2026-041' },
  { id:'T04', date:'2026-08-03', libelle:'Consultation veto + traitements troupeau bovin',  type:'Frais veto',     sens:'sortie', montant:85_000,    reference:'FR-2026-022' },
  { id:'T05', date:'2026-08-01', libelle:'Salaires employes aout 2026',                     type:'Salaires',       sens:'sortie', montant:450_000,   reference:'SAL-2026-08' },
  { id:'T06', date:'2026-07-28', libelle:'Vente 4 taureaux reproducteurs — eleveur Kaya',   type:'Vente animaux',  sens:'entree', montant:1_800_000, reference:'VT-2026-086' },
  { id:'T07', date:'2026-07-25', libelle:'Livraison lait 280L — Epiceries Ouaga 2000',      type:'Vente lait',     sens:'entree', montant:336_000,   reference:'VT-2026-085' },
  { id:'T08', date:'2026-07-22', libelle:'Achat 12 chevreaux base genetique — Dedougou',    type:'Achat animaux',  sens:'sortie', montant:720_000,   reference:'AC-2026-040' },
  { id:'T09', date:'2026-07-20', libelle:'Achat son de ble + concentre proteique 800kg',    type:'Achat aliments', sens:'sortie', montant:192_000,   reference:'AC-2026-039' },
  { id:'T10', date:'2026-07-18', libelle:'Vente 15 poulets de chair — marche Bobo',         type:'Vente animaux',  sens:'entree', montant:112_500,   reference:'VT-2026-084' },
  { id:'T11', date:'2026-07-15', libelle:'Reparation pompe hydraulique abreuvoir',          type:'Autres',         sens:'sortie', montant:48_000,    reference:'DP-2026-033' },
  { id:'T12', date:'2026-07-12', libelle:'Vente lait 350L — Restaurant Saveurs du Sahel',  type:'Vente lait',     sens:'entree', montant:420_000,   reference:'VT-2026-083' },
  { id:'T13', date:'2026-07-10', libelle:'Achat vaccines campagne saisonniere',             type:'Frais veto',     sens:'sortie', montant:135_000,   reference:'FR-2026-021' },
  { id:'T14', date:'2026-07-05', libelle:'Vente 20 agneaux — preparation Fete du mouton',  type:'Vente animaux',  sens:'entree', montant:2_200_000, reference:'VT-2026-081' },
  { id:'T15', date:'2026-07-01', libelle:'Salaires employes juillet 2026',                  type:'Salaires',       sens:'sortie', montant:450_000,   reference:'SAL-2026-07' },
  { id:'T16', date:'2026-06-28', libelle:'Achat foin sorgho 2 tonnes',                     type:'Achat aliments', sens:'sortie', montant:160_000,   reference:'AC-2026-038' },
  { id:'T17', date:'2026-06-25', libelle:'Livraison lait 400L — collecte groupee',          type:'Vente lait',     sens:'entree', montant:480_000,   reference:'VT-2026-080' },
  { id:'T18', date:'2026-06-22', libelle:'Frais transport animaux — camion betaillere',     type:'Autres',         sens:'sortie', montant:75_000,    reference:'DP-2026-032' },
  { id:'T19', date:'2026-06-15', libelle:'Vente 6 vaches reformees',                        type:'Vente animaux',  sens:'entree', montant:1_440_000, reference:'VT-2026-079' },
  { id:'T20', date:'2026-06-10', libelle:'Achat equipement traite mecanique',               type:'Autres',         sens:'sortie', montant:320_000,   reference:'AC-2026-037' },
]

/* ── Type colors ─────────────────────────────────────────────────────────── */
const TYPE_COLORS: Record<TypeTx, string> = {
  'Vente animaux':  GOLD,
  'Vente lait':     CYAN,
  'Achat animaux':  '#a78bfa',
  'Achat aliments': ORANGE,
  'Frais veto':     RED,
  'Salaires':       '#f97316',
  'Autres':         TEXT2,
}
const TYPES: TypeTx[] = ['Vente animaux','Vente lait','Achat animaux','Achat aliments','Frais veto','Salaires','Autres']

function fmt(n: number) { return n.toLocaleString('fr-FR') }

/* ── KpiCard ─────────────────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, color, icon: Icon, trend }:
  { label:string; value:string; sub?:string; color:string; trend?:string
    icon:React.ComponentType<{size?:number;color?:string}> }) {
  return (
    <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, padding:'18px 22px',
      display:'flex', flexDirection:'column' as const, gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:12, color:TEXT2 }}>{label}</span>
        <div style={{ background:`${color}18`, borderRadius:8, padding:8, display:'flex' }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      <div style={{ fontSize:26, fontWeight:700, color:TEXT, fontFamily:'monospace' }}>{value}</div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {sub  && <span style={{ fontSize:11, color:TEXT3 }}>{sub}</span>}
        {trend && <span style={{ fontSize:11, color, fontWeight:600 }}>{trend}</span>}
      </div>
    </div>
  )
}

/* ── Modal ───────────────────────────────────────────────────────────────── */
function ModalTx({ tx, onClose }: { tx:Transaction; onClose:()=>void }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{ position:'relative', background:BG2, border:`1px solid ${BORDER}`,
        borderRadius:18, padding:28, width:'100%', maxWidth:460, margin:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              {tx.sens==='entree' ? <ArrowUpRight size={18} color={GREEN}/> : <ArrowDownRight size={18} color={RED}/>}
              <span style={{ fontSize:15, fontWeight:700, color:TEXT }}>{tx.libelle}</span>
            </div>
            <div style={{ fontSize:12, color:TEXT2 }}>{tx.reference} · {tx.date}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:TEXT3, cursor:'pointer' }}>
            <X size={18}/>
          </button>
        </div>
        <div style={{ background: tx.sens==='entree' ? `${GREEN}10` : `${RED}10`,
          border:`1px solid ${tx.sens==='entree' ? GREEN : RED}30`,
          borderRadius:12, padding:'14px 18px', textAlign:'center' as const, marginBottom:20 }}>
          <div style={{ fontSize:12, color:TEXT2, marginBottom:4 }}>Montant</div>
          <div style={{ fontSize:28, fontWeight:800, fontFamily:'monospace',
            color: tx.sens==='entree' ? GREEN : RED }}>
            {tx.sens==='entree' ? '+' : '-'}{fmt(tx.montant)} FCFA
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {([['Type',tx.type],['Sens',tx.sens==='entree'?'Entree':'Sortie'],['Date',tx.date],['Reference',tx.reference]] as [string,string][]).map(([k,v],i) => (
            <div key={i} style={{ background:BG3, borderRadius:10, padding:'10px 14px' }}>
              <div style={{ fontSize:10, color:TEXT3, textTransform:'uppercase' as const, letterSpacing:'0.05em', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:13, color:TEXT, fontWeight:500 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ background:BG3, border:`1px solid ${BORDER}`,
            color:TEXT2, borderRadius:8, padding:'8px 16px', fontSize:12, cursor:'pointer' }}>Fermer</button>
        </div>
      </div>
    </div>
  )
}

/* ── Graphique ───────────────────────────────────────────────────────────── */
const MONTHLY = [
  { mois:'Avr', entrees:3_600_000, sorties:1_380_000 },
  { mois:'Mai', entrees:5_200_000, sorties:1_900_000 },
  { mois:'Juin', entrees:3_900_000, sorties:1_570_000 },
  { mois:'Juil', entrees:5_348_500, sorties:1_780_000 },
  { mois:'Aout', entrees:1_456_000, sorties:810_000 },
]

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function TransactionsPage() {
  const [search,      setSearch]      = useState('')
  const [filterSens,  setFilterSens]  = useState('Tous')
  const [filterType,  setFilterType]  = useState('Tous')
  const [selected,    setSelected]    = useState<Transaction | null>(null)

  const filtered = useMemo(() =>
    TX.filter(t =>
      (filterSens==='Tous' || (filterSens==='Entrees' ? t.sens==='entree' : t.sens==='sortie')) &&
      (filterType==='Tous' || t.type===filterType) &&
      (!search || t.libelle.toLowerCase().includes(search.toLowerCase()) || t.reference.toLowerCase().includes(search.toLowerCase()))
    ),[filterSens, filterType, search])

  const totalEntrees = TX.filter(t=>t.sens==='entree').reduce((s,t)=>s+t.montant,0)
  const totalSorties = TX.filter(t=>t.sens==='sortie').reduce((s,t)=>s+t.montant,0)
  const solde        = totalEntrees - totalSorties
  const txCeMois     = TX.filter(t=>t.date.startsWith('2026-08')).length

  const card: React.CSSProperties = { background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, padding:24 }
  const th: React.CSSProperties   = { padding:'10px 16px', textAlign:'left', fontSize:11, color:TEXT3,
    fontWeight:600, borderBottom:`1px solid ${BORDER}`, background:BG3, whiteSpace:'nowrap' as const }
  const td: React.CSSProperties   = { padding:'12px 16px', fontSize:13, color:TEXT, borderBottom:`1px solid ${BORDER}`, verticalAlign:'middle' }
  const fBtn = (a:boolean): React.CSSProperties => ({
    background: a?`${GOLD}20`:'transparent', color:a?GOLD:TEXT2,
    border:`1px solid ${a?GOLD:BORDER}`, borderRadius:8,
    padding:'5px 12px', fontSize:11, cursor:'pointer', fontWeight:a?700:400,
  })

  return (
    <div style={{ padding:'2rem', display:'flex', flexDirection:'column' as const, gap:24 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:TEXT, margin:0 }}>Transactions financieres</h1>
          <p style={{ fontSize:13, color:TEXT2, margin:'4px 0 0' }}>{TX.length} operations · LivestockOS</p>
        </div>
        <button onClick={()=>toast.success('Nouvelle transaction — bientot disponible')}
          style={{ display:'flex', alignItems:'center', gap:7, background:GOLD, color:NAVY,
            border:'none', borderRadius:10, padding:'10px 16px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          <Plus size={14}/> Ajouter
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        <KpiCard label='Total entrees'   value={`${(totalEntrees/1_000_000).toFixed(2)}M`} sub='FCFA cumul'   color={GREEN} icon={TrendingUp}   trend='+12% vs juil' />
        <KpiCard label='Total sorties'   value={`${(totalSorties/1_000_000).toFixed(2)}M`} sub='FCFA cumul'   color={RED}   icon={TrendingDown}  />
        <KpiCard label='Solde net'       value={`${(solde/1_000_000).toFixed(2)}M`}         sub='FCFA positif' color={GOLD}  icon={Wallet}        trend='Sain' />
        <KpiCard label='Ce mois (aout)'  value={String(txCeMois)}                           sub='transactions' color={CYAN}  icon={FileText}      />
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }}>
        <div style={card}>
          <h3 style={{ fontSize:13, fontWeight:600, color:TEXT, margin:'0 0 16px' }}>Entrees vs Sorties par mois (FCFA)</h3>
          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={MONTHLY} barGap={4} barSize={18} margin={{ top:0,right:0,bottom:0,left:-10 }}>
              <XAxis dataKey='mois' tick={{ fontSize:10, fill:TEXT3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:TEXT3 }} axisLine={false} tickLine={false}
                tickFormatter={(v)=>`${((v as number)/1_000_000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:8, fontSize:12 }}
                cursor={{ fill:'rgba(255,255,255,0.04)' }}
                formatter={(v,n)=>[`${(v as number).toLocaleString('fr-FR')} FCFA`, n==='entrees'?'Entrees':'Sorties']} />
              <Legend formatter={val=>val==='entrees'?'Entrees':'Sorties'} wrapperStyle={{ fontSize:11, color:TEXT2 }} />
              <Bar dataKey='entrees' name='entrees' fill={GREEN} radius={[4,4,0,0]} />
              <Bar dataKey='sorties' name='sorties' fill={RED}   radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <h3 style={{ fontSize:13, fontWeight:600, color:TEXT, margin:'0 0 16px' }}>Volume par type</h3>
          <div style={{ display:'flex', flexDirection:'column' as const, gap:10, marginTop:8 }}>
            {TYPES.map(type => {
              const total = TX.filter(t=>t.type===type).reduce((s,t)=>s+t.montant,0)
              const max   = Math.max(...TYPES.map(tp=>TX.filter(t=>t.type===tp).reduce((s,t)=>s+t.montant,0)))
              const pct   = Math.round((total/max)*100)
              return (
                <div key={type}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:11, color:TEXT2 }}>{type}</span>
                    <span style={{ fontSize:11, fontFamily:'monospace', color:TYPE_COLORS[type], fontWeight:700 }}>{(total/1_000).toFixed(0)}k</span>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:4, height:6 }}>
                    <div style={{ width:`${pct}%`, height:6, borderRadius:4, background:TYPE_COLORS[type] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', flexDirection:'column' as const, gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:BG2,
          border:`1px solid ${BORDER}`, borderRadius:10, padding:'8px 14px', maxWidth:400 }}>
          <Search size={14} color={TEXT3} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Libelle ou reference...'
            style={{ background:'none', border:'none', outline:'none', color:TEXT, fontSize:13, width:'100%' }} />
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const, alignItems:'center' }}>
          <Filter size={13} color={TEXT3} />
          {['Tous','Entrees','Sorties'].map(s=>(
            <button key={s} onClick={()=>setFilterSens(s)} style={fBtn(filterSens===s)}>{s}</button>
          ))}
          <span style={{ color:BORDER, margin:'0 4px' }}>|</span>
          {(['Tous',...TYPES]).map(t=>(
            <button key={t} onClick={()=>setFilterType(t)} style={fBtn(filterType===t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:14, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Date','Libelle','Type','Reference','Montant','Sens',''].map(h=>(
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 && (
                <tr><td colSpan={7} style={{ ...td, textAlign:'center', color:TEXT3, padding:48, border:'none' }}>
                  Aucune transaction
                </td></tr>
              )}
              {filtered.map((t,i)=>(
                <tr key={t.id} style={{ background:i%2===1?`${BG3}80`:'transparent' }}>
                  <td style={{ ...td, color:TEXT2, fontSize:12 }}>{t.date}</td>
                  <td style={{ ...td, maxWidth:250 }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{t.libelle}</div>
                  </td>
                  <td style={td}>
                    <span style={{ background:`${TYPE_COLORS[t.type]}18`, color:TYPE_COLORS[t.type],
                      borderRadius:5, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{t.type}</span>
                  </td>
                  <td style={{ ...td, fontFamily:'monospace', color:TEXT2, fontSize:11 }}>{t.reference}</td>
                  <td style={{ ...td, fontFamily:'monospace', fontWeight:700, color:t.sens==='entree'?GREEN:RED }}>
                    {t.sens==='entree'?'+':'-'}{fmt(t.montant)}
                  </td>
                  <td style={td}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5,
                      background:t.sens==='entree'?`${GREEN}18`:`${RED}18`,
                      color:t.sens==='entree'?GREEN:RED,
                      borderRadius:6, padding:'3px 10px', fontSize:11, fontWeight:700 }}>
                      {t.sens==='entree'?<ArrowUpRight size={11}/>:<ArrowDownRight size={11}/>}
                      {t.sens==='entree'?'Entree':'Sortie'}
                    </span>
                  </td>
                  <td style={td}>
                    <button onClick={()=>setSelected(t)}
                      style={{ display:'inline-flex', alignItems:'center', gap:5, background:`${CYAN}18`,
                        border:'none', color:CYAN, borderRadius:7, padding:'5px 11px', fontSize:11, cursor:'pointer', fontWeight:600 }}>
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 18px', borderTop:`1px solid ${BORDER}`, fontSize:11, color:TEXT3,
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>{filtered.length} transaction{filtered.length!==1?'s':''} affichee{filtered.length!==1?'s':''}</span>
          <span style={{ fontFamily:'monospace', fontWeight:700, color:GOLD }}>
            Solde filtre : {filtered.reduce((s,t)=>t.sens==='entree'?s+t.montant:s-t.montant,0).toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>

      {selected && <ModalTx tx={selected} onClose={()=>setSelected(null)} />}
    </div>
  )
}
