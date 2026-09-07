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
    expect(screen.getByText(/Août 2026 · Ferme FORGE Afrika/)).toBeInTheDocument()
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

  it('renders the "Taux mortalité" KPI label', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Taux mortalité')).toBeInTheDocument()
  })

  it('renders the mortality rate value and its unit', () => {
    render(<DashboardPage />)
    expect(screen.getByText('2.1')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
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

  it('renders the disease alert for BV-012', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Vache #BV-012')).toBeInTheDocument()
    expect(screen.getByText('Symptômes fièvre aphteuse')).toBeInTheDocument()
  })

  it('renders the injury alert for CP-034', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Chèvre #CP-034')).toBeInTheDocument()
    expect(screen.getByText('Plaie patte arrière gauche')).toBeInTheDocument()
  })

  it('renders the nutrition alert for BV-003', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Taureau #BV-003')).toBeInTheDocument()
    expect(screen.getByText('Perte de poids anormale')).toBeInTheDocument()
  })

  it('renders the urgency level of each alert', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Haute')).toBeInTheDocument()
    expect(screen.getByText('Moyenne')).toBeInTheDocument()
    expect(screen.getByText('Basse')).toBeInTheDocument()
  })

  // ── Navigation hint ───────────────────────────────────────────────────────
  it('renders the three bottom sections', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Alertes sanitaires')).toBeInTheDocument()
    expect(screen.getByText('Vaccinations')).toBeInTheDocument()
    expect(screen.getByText('Transactions récentes')).toBeInTheDocument()
  })

  it('renders the upcoming vaccination lots', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Lot Bovins A (12 têtes)')).toBeInTheDocument()
    expect(screen.getByText('FMDV — Fièvre aphteuse')).toBeInTheDocument()
  })
})
