import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// ── Mocks ────────────────────────────────────────────────────────────────────
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, onClick }: any) =>
      React.createElement('div', { style, className, onClick }, children),
    span: ({ children, style }: any) =>
      React.createElement('span', { style }, children),
  },
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => React.createElement('div', null, children),
  LineChart: ({ children }: any) => React.createElement('div', null, children),
  BarChart: ({ children }: any) => React.createElement('div', null, children),
  PieChart: ({ children }: any) => React.createElement('div', null, children),
  AreaChart: ({ children }: any) => React.createElement('div', null, children),
  ComposedChart: ({ children }: any) => React.createElement('div', null, children),
  Line: () => null, Bar: () => null, Area: () => null,
  Pie: () => null, Cell: () => null,
  XAxis: () => null, YAxis: () => null,
  CartesianGrid: () => null, Tooltip: () => null, Legend: () => null,
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

import DashboardPage from '@/app/(dashboard)/dashboard/page'

// ── Suite ────────────────────────────────────────────────────────────────────
describe('DashboardPage', () => {
  // ── Page structure ────────────────────────────────────────────────────────
  it('renders the "Dashboard" heading', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders the farm subtitle', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Août 2026 · Ferme FORGE Afrika')).toBeInTheDocument()
  })

  // ── KPI cards ─────────────────────────────────────────────────────────────
  it('renders "Effectif total" KPI label', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Effectif total')).toBeInTheDocument()
  })

  it('renders KPI value 47 (total livestock)', () => {
    render(<DashboardPage />)
    expect(screen.getByText('47')).toBeInTheDocument()
  })

  it('renders "Nés ce mois" KPI label', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Nés ce mois')).toBeInTheDocument()
  })

  it('renders KPI value 4 (born this month)', () => {
    render(<DashboardPage />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders "Vendus ce mois" KPI label', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Vendus ce mois')).toBeInTheDocument()
  })

  it('renders KPI value 15 (sold this month)', () => {
    render(<DashboardPage />)
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('renders "Décédés" KPI label', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Décédés')).toBeInTheDocument()
  })

  it('renders KPI value 1 (deaths)', () => {
    render(<DashboardPage />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders "têtes" unit for Effectif total', () => {
    render(<DashboardPage />)
    expect(screen.getByText('têtes')).toBeInTheDocument()
  })

  // ── AlertesSanitaires ─────────────────────────────────────────────────────
  it('renders "Alertes sanitaires" section heading', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Alertes sanitaires')).toBeInTheDocument()
  })

  it('renders the FMD vaccine alert', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Vaccin FMD — Bovins (lot B)')).toBeInTheDocument()
  })

  it('renders detail text for FMD alert', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/Rappel préventif à effectuer avant le 10 août 2026/)).toBeInTheDocument()
  })

  it('renders the sick animal alert for BV-007', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Animal malade — Bovin #BV-007')).toBeInTheDocument()
  })

  it('renders the sales quota alert for ovines', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Quota de vente atteint — Ovins')).toBeInTheDocument()
  })

  it('renders the "2 urgentes" badge for high-priority alerts', () => {
    render(<DashboardPage />)
    expect(screen.getByText('2 urgentes')).toBeInTheDocument()
  })

  // ── Navigation hint ───────────────────────────────────────────────────────
  it('renders navigation hint mentioning Animaux', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Animaux')).toBeInTheDocument()
  })

  it('renders navigation hint mentioning Rapports', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Rapports')).toBeInTheDocument()
  })
})
