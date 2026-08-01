'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { FileBarChart2, PawPrint, Baby, ShoppingCart, Skull, Download } from 'lucide-react'

const KPI = [
  { label: 'Effectif total',   value: 47,  unit: 'têtes',   color: '#D4AF37', icon: PawPrint    },
  { label: 'Nés ce mois',      value: 4,   unit: 'animaux', color: '#4ade80', icon: Baby        },
  { label: 'Vendus ce mois',   value: 15,  unit: 'animaux', color: '#00D4FF', icon: ShoppingCart },
  { label: 'Décédés ce mois',  value: 1,   unit: 'animal',  color: '#f87171', icon: Skull       },
]

const BAR_DATA = [
  { espece: 'Bovins',  effectif: 18 },
  { espece: 'Ovins',   effectif: 14 },
  { espece: 'Caprins', effectif: 11 },
  { espece: 'Porcins', effectif: 4  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18, delay: i * 0.07 },
  }),
}

export default function RapportsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  async function exportPDF() {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    // Header Navy
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 0, 210, 40, 'F')

    // Gold accent bar
    doc.setFillColor(212, 175, 55)
    doc.rect(0, 0, 210, 4, 'F')

    // Titre
    doc.setTextColor(212, 175, 55)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('LivestockOS', 14, 20)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(200, 210, 230)
    doc.text('Rapport mensuel — Août 2026 · FORGE Afrika', 14, 30)

    // KPIs section
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(240, 244, 255)
    doc.text('Indicateurs clés', 14, 55)

    const kpiY = 62
    KPI.forEach((k, i) => {
      const x = 14 + i * 48
      doc.setFillColor(17, 30, 53)
      doc.roundedRect(x, kpiY, 44, 24, 3, 3, 'F')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(136, 153, 187)
      doc.text(k.label, x + 4, kpiY + 7)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(212, 175, 55)
      doc.text(String(k.value), x + 4, kpiY + 18)
    })

    // Effectif par espèce
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(240, 244, 255)
    doc.text('Effectif par espèce', 14, 102)

    const espColors: [number, number, number][] = [
      [212, 175, 55], [0, 188, 212], [167, 139, 250], [251, 146, 60],
    ]
    BAR_DATA.forEach((row, i) => {
      const y = 108 + i * 14
      const barW = row.effectif * 5
      doc.setFillColor(...espColors[i])
      doc.roundedRect(14, y, barW, 9, 2, 2, 'F')
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(200, 210, 230)
      doc.text(`${row.espece}  ${row.effectif} têtes`, 16 + barW, y + 6.5)
    })

    // Footer
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 280, 210, 17, 'F')
    doc.setFontSize(8)
    doc.setTextColor(100, 120, 160)
    doc.text('Généré par LivestockOS · FORGE Afrika · ' + new Date().toLocaleDateString('fr-FR'), 14, 290)

    doc.save('rapport-livestock-aout-2026.pdf')
  }

  return (
    <div style={{ padding: '2rem', color: '#f0f4ff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileBarChart2 style={{ width: 22, height: 22, color: '#D4AF37' }} />
            Rapports
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.8rem', margin: 0 }}>Bilan mensuel · Août 2026</p>
        </div>
        <button onClick={exportPDF} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700,
          backgroundColor: '#D4AF37', color: '#0A1628', border: 'none', cursor: 'pointer',
        }}>
          <Download style={{ width: 15, height: 15 }} />
          Export PDF
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {KPI.map((k, i) => (
          <motion.div key={k.label} custom={i} variants={fadeUp} initial="hidden" animate="show"
            style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ color: '#8899bb', fontSize: '0.72rem', lineHeight: 1.3 }}>{k.label}</span>
              <k.icon style={{ width: 15, height: 15, color: k.color, flexShrink: 0 }} />
            </div>
            <p style={{ color: k.color, fontWeight: 800, fontSize: '2rem', margin: 0, lineHeight: 1 }}>{k.value}</p>
            <p style={{ color: '#8899bb', fontSize: '0.68rem', margin: '0.3rem 0 0' }}>{k.unit}</p>
          </motion.div>
        ))}
      </div>

      {/* BarChart effectif par espèce */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
        style={{ backgroundColor: '#111e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem' }}>
        <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.25rem', color: '#f0f4ff' }}>Effectif par espèce</p>
        <p style={{ color: '#8899bb', fontSize: '0.75rem', margin: '0 0 1.25rem' }}>Août 2026 · {BAR_DATA.reduce((s, r) => s + r.effectif, 0)} têtes total</p>

        {mounted && (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={BAR_DATA} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="espece" tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899bb', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f4ff', fontSize: 12 }}
                formatter={(v: number) => [`${v} têtes`]}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#8899bb', paddingTop: 12 }} />
              <Bar dataKey="effectif" name="Effectif" fill="#D4AF37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <div style={{ height: '2rem' }} />
    </div>
  )
}
