'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PawPrint, Search, Plus, X } from 'lucide-react'

type Espece = 'Bovin' | 'Ovin' | 'Caprin' | 'Porcin'
type Sante  = 'sain' | 'attention' | 'malade'

interface Animal {
  id: string
  nom: string
  espece: Espece
  numOreille: string
  ageAns: number
  poidKg: number
  sante: Sante
  dernierVaccin: string
  race: string
}

const ANIMAUX: Animal[] = [
  { id: 'BV-001', nom: 'Baobab',    espece: 'Bovin',  numOreille: 'BF-23-001', ageAns: 4, poidKg: 420, sante: 'sain',      dernierVaccin: '2026-05-12', race: 'Zébu peul'   },
  { id: 'BV-002', nom: 'Sahel',     espece: 'Bovin',  numOreille: 'BF-23-002', ageAns: 6, poidKg: 510, sante: 'sain',      dernierVaccin: '2026-05-12', race: 'Zébu peul'   },
  { id: 'BV-003', nom: 'Koudou',    espece: 'Bovin',  numOreille: 'BF-23-003', ageAns: 3, poidKg: 340, sante: 'attention', dernierVaccin: '2026-03-08', race: 'Borgou'       },
  { id: 'BV-007', nom: 'Savane',    espece: 'Bovin',  numOreille: 'BF-23-007', ageAns: 5, poidKg: 480, sante: 'malade',    dernierVaccin: '2026-04-20', race: 'Zébu peul'   },
  { id: 'OV-001', nom: 'Dioula',    espece: 'Ovin',   numOreille: 'BF-24-011', ageAns: 2, poidKg:  48, sante: 'sain',      dernierVaccin: '2026-06-01', race: 'Bali-bali'    },
  { id: 'OV-002', nom: 'Mossi',     espece: 'Ovin',   numOreille: 'BF-24-012', ageAns: 3, poidKg:  55, sante: 'sain',      dernierVaccin: '2026-06-01', race: 'Bali-bali'    },
  { id: 'OV-003', nom: 'Volta',     espece: 'Ovin',   numOreille: 'BF-24-013', ageAns: 1, poidKg:  32, sante: 'sain',      dernierVaccin: '2026-06-01', race: 'Djallonké'    },
  { id: 'CP-001', nom: 'Ouaga',     espece: 'Caprin', numOreille: 'BF-25-021', ageAns: 2, poidKg:  28, sante: 'sain',      dernierVaccin: '2026-05-20', race: 'Chèvre sahélienne' },
  { id: 'CP-002', nom: 'Pô',        espece: 'Caprin', numOreille: 'BF-25-022', ageAns: 4, poidKg:  35, sante: 'attention', dernierVaccin: '2026-02-15', race: 'Chèvre sahélienne' },
  { id: 'CP-003', nom: 'Manga',     espece: 'Caprin', numOreille: 'BF-25-023', ageAns: 1, poidKg:  19, sante: 'sain',      dernierVaccin: '2026-06-10', race: 'Chèvre naine' },
  { id: 'PC-001', nom: 'Banfora',   espece: 'Porcin', numOreille: 'BF-26-031', ageAns: 1, poidKg:  90, sante: 'sain',      dernierVaccin: '2026-06-15', race: 'Porc local'   },
  { id: 'PC-002', nom: 'Cascades',  espece: 'Porcin', numOreille: 'BF-26-032', ageAns: 2, poidKg: 130, sante: 'sain',      dernierVaccin: '2026-06-15', race: 'Large White'  },
]

const ESPECES: Espece[] = ['Bovin', 'Ovin', 'Caprin', 'Porcin']

const SANTE_CFG: Record<Sante, { label: string; color: string; bg: string; dot: string }> = {
  sain:      { label: '🟢 Sain',      color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  dot: '#4ade80' },
  attention: { label: '🟡 Attention', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  dot: '#fbbf24' },
  malade:    { label: '🔴 Malade',    color: '#f87171', bg: 'rgba(248,113,113,0.12)', dot: '#f87171' },
}

const ESPECE_COLOR: Record<Espece, string> = {
  Bovin: '#D4AF37', Ovin: '#00D4FF', Caprin: '#a78bfa', Porcin: '#fb923c',
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.05 },
  }),
}

export default function AnimauxPage() {
  const [search,      setSearch]      = useState('')
  const [filterEsp,   setFilterEsp]   = useState<Espece | 'all'>('all')
  const [filterSante, setFilterSante] = useState<Sante | 'all'>('all')
  const [showModal,   setShowModal]   = useState(false)

  const filtered = ANIMAUX.filter(a => {
    const matchSearch = a.nom.toLowerCase().includes(search.toLowerCase()) ||
                        a.numOreille.toLowerCase().includes(search.toLowerCase())
    const matchEsp    = filterEsp   === 'all' || a.espece === filterEsp
    const matchSante  = filterSante === 'all' || a.sante  === filterSante
    return matchSearch && matchEsp && matchSante
  })

  const stats = {
    total:   ANIMAUX.length,
    sains:   ANIMAUX.filter(a => a.sante === 'sain').length,
    alerte:  ANIMAUX.filter(a => a.sante === 'attention').length,
    malades: ANIMAUX.filter(a => a.sante === 'malade').length,
  }

  return (
    <div style={{ padding: '2rem', color: '#f0f4ff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PawPrint style={{ width: 22, height: 22, color: '#D4AF37' }} />
            Cheptel
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.8rem', margin: 0 }}>
            {stats.total} animaux · {stats.sains} sains · {stats.alerte} en attention · {stats.malades} malade(s)
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700,
          backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer',
        }}>
          <Plus style={{ width: 15, height: 15 }} />
          Ajouter animal
        </button>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#8899bb' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou n° oreille…"
            style={{
              width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none',
            }}
          />
        </div>
        <select value={filterEsp} onChange={e => setFilterEsp(e.target.value as Espece | 'all')}
          style={{ padding: '0.5rem 0.75rem', backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none' }}>
          <option value="all">Toutes espèces</option>
          {ESPECES.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <select value={filterSante} onChange={e => setFilterSante(e.target.value as Sante | 'all')}
          style={{ padding: '0.5rem 0.75rem', backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none' }}>
          <option value="all">Tous états</option>
          <option value="sain">Sain</option>
          <option value="attention">Attention</option>
          <option value="malade">Malade</option>
        </select>
      </div>

      {/* Grille animaux */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((animal, i) => {
          const santeC = SANTE_CFG[animal.sante]
          const espC   = ESPECE_COLOR[animal.espece]
          return (
            <motion.div key={animal.id} custom={i} variants={fadeUp} initial="hidden" animate="show"
              style={{ backgroundColor: '#111e35', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 16, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              {/* Accent top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: espC, borderRadius: '16px 16px 0 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 0.2rem', color: '#f0f4ff' }}>{animal.nom}</p>
                  <p style={{ color: '#8899bb', fontSize: '0.7rem', margin: 0, fontFamily: 'monospace' }}>{animal.numOreille}</p>
                </div>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.65rem', fontWeight: 700, backgroundColor: `${espC}18`, color: espC }}>
                  {animal.espece}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.875rem' }}>
                {[
                  { label: 'Âge',    value: `${animal.ageAns} an${animal.ageAns > 1 ? 's' : ''}` },
                  { label: 'Poids',  value: `${animal.poidKg} kg` },
                  { label: 'Race',   value: animal.race },
                  { label: 'Vaccin', value: animal.dernierVaccin },
                ].map(item => (
                  <div key={item.label} style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.4rem 0.6rem' }}>
                    <p style={{ color: '#8899bb', fontSize: '0.62rem', margin: '0 0 0.15rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</p>
                    <p style={{ color: '#f0f4ff', fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 600, backgroundColor: santeC.bg, color: santeC.color }}>
                {santeC.label}
              </span>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#8899bb', padding: '3rem 0' }}>
            Aucun animal trouvé.
          </div>
        )}
      </div>

      {/* Modal Ajouter */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.65)' }}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '1.75rem', width: '100%', maxWidth: 440, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus style={{ width: 16, height: 16, color: '#D4AF37' }} />
                  Ajouter un animal
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8899bb' }}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Nom', placeholder: 'Ex : Baobab' },
                  { label: 'N° oreille', placeholder: 'BF-26-XXX' },
                  { label: 'Race', placeholder: 'Ex : Zébu peul' },
                  { label: 'Poids (kg)', placeholder: '0' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>{f.label}</label>
                    <input placeholder={f.placeholder} style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none' }} />
                  </div>
                ))}
                <div>
                  <label style={{ color: '#8899bb', fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>Espèce</label>
                  <select style={{ width: '100%', padding: '0.5rem 0.75rem', backgroundColor: '#0A1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f0f4ff', fontSize: '0.85rem', outline: 'none' }}>
                    {ESPECES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.06)', color: '#8899bb', border: 'none', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer' }}>
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
