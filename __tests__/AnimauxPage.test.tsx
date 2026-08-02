import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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
  usePathname: () => '/animaux',
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

import AnimauxPage from '@/app/(dashboard)/animaux/page'

// ── Suite ────────────────────────────────────────────────────────────────────
describe('AnimauxPage', () => {
  // ── Header / stats ────────────────────────────────────────────────────────
  it('renders "Cheptel" heading', () => {
    render(<AnimauxPage />)
    expect(screen.getByText('Cheptel')).toBeInTheDocument()
  })

  it('shows total animal count (12)', () => {
    render(<AnimauxPage />)
    expect(screen.getByText(/12 animaux/)).toBeInTheDocument()
  })

  it('shows count of healthy animals (9 sains)', () => {
    render(<AnimauxPage />)
    expect(screen.getByText(/9 sains/)).toBeInTheDocument()
  })

  it('shows count of animals in attention (2 en attention)', () => {
    render(<AnimauxPage />)
    expect(screen.getByText(/2 en attention/)).toBeInTheDocument()
  })

  it('shows count of sick animals (1 malade)', () => {
    render(<AnimauxPage />)
    expect(screen.getByText(/1 malade/)).toBeInTheDocument()
  })

  // ── Search & filter controls ──────────────────────────────────────────────
  it('renders the search input', () => {
    render(<AnimauxPage />)
    expect(screen.getByPlaceholderText(/Rechercher par nom ou n° oreille/)).toBeInTheDocument()
  })

  it('renders the species filter dropdown', () => {
    render(<AnimauxPage />)
    expect(screen.getByDisplayValue('Toutes espèces')).toBeInTheDocument()
  })

  it('renders the health filter dropdown', () => {
    render(<AnimauxPage />)
    expect(screen.getByDisplayValue('Tous états')).toBeInTheDocument()
  })

  it('renders "Ajouter animal" button', () => {
    render(<AnimauxPage />)
    expect(screen.getByText('Ajouter animal')).toBeInTheDocument()
  })

  // ── Animal cards ──────────────────────────────────────────────────────────
  it('renders the animal "Baobab"', () => {
    render(<AnimauxPage />)
    expect(screen.getByText('Baobab')).toBeInTheDocument()
  })

  it('renders the animal "Sahel"', () => {
    render(<AnimauxPage />)
    expect(screen.getByText('Sahel')).toBeInTheDocument()
  })

  it('renders the ear number BF-23-001', () => {
    render(<AnimauxPage />)
    expect(screen.getByText('BF-23-001')).toBeInTheDocument()
  })

  it('renders at least one "🟢 Sain" health badge', () => {
    render(<AnimauxPage />)
    const badges = screen.getAllByText('🟢 Sain')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('renders "🔴 Malade" badge for Savane', () => {
    render(<AnimauxPage />)
    expect(screen.getByText('🔴 Malade')).toBeInTheDocument()
  })

  it('renders "🟡 Attention" badge', () => {
    render(<AnimauxPage />)
    const badges = screen.getAllByText('🟡 Attention')
    expect(badges.length).toBeGreaterThan(0)
  })

  // ── Search filtering ──────────────────────────────────────────────────────
  it('filters to show only Baobab when searching "Baobab"', () => {
    render(<AnimauxPage />)
    const input = screen.getByPlaceholderText(/Rechercher par nom ou n° oreille/)
    fireEvent.change(input, { target: { value: 'Baobab' } })
    expect(screen.getByText('Baobab')).toBeInTheDocument()
    expect(screen.queryByText('Sahel')).not.toBeInTheDocument()
  })

  it('shows "Aucun animal trouvé." when search yields no results', () => {
    render(<AnimauxPage />)
    const input = screen.getByPlaceholderText(/Rechercher par nom ou n° oreille/)
    fireEvent.change(input, { target: { value: 'xyznotfound' } })
    expect(screen.getByText('Aucun animal trouvé.')).toBeInTheDocument()
  })

  it('can search by ear number (BF-23-002 shows Sahel)', () => {
    render(<AnimauxPage />)
    const input = screen.getByPlaceholderText(/Rechercher par nom ou n° oreille/)
    fireEvent.change(input, { target: { value: 'BF-23-002' } })
    expect(screen.getByText('Sahel')).toBeInTheDocument()
    expect(screen.queryByText('Baobab')).not.toBeInTheDocument()
  })

  // ── Species filter ────────────────────────────────────────────────────────
  it('filtering by "Bovin" hides non-bovine animals', () => {
    render(<AnimauxPage />)
    const select = screen.getByDisplayValue('Toutes espèces')
    fireEvent.change(select, { target: { value: 'Bovin' } })
    expect(screen.queryByText('Dioula')).not.toBeInTheDocument()  // Ovin
    expect(screen.queryByText('Ouaga')).not.toBeInTheDocument()   // Caprin
  })

  it('filtering by "Ovin" shows Dioula, Mossi, Volta', () => {
    render(<AnimauxPage />)
    const select = screen.getByDisplayValue('Toutes espèces')
    fireEvent.change(select, { target: { value: 'Ovin' } })
    expect(screen.getByText('Dioula')).toBeInTheDocument()
    expect(screen.getByText('Mossi')).toBeInTheDocument()
    expect(screen.getByText('Volta')).toBeInTheDocument()
  })

  // ── Add modal ─────────────────────────────────────────────────────────────
  it('opens the add-animal modal when clicking "Ajouter animal"', () => {
    render(<AnimauxPage />)
    fireEvent.click(screen.getByText('Ajouter animal'))
    expect(screen.getByText('Ajouter un animal')).toBeInTheDocument()
  })

  it('modal contains the Nom field', () => {
    render(<AnimauxPage />)
    fireEvent.click(screen.getByText('Ajouter animal'))
    expect(screen.getByText('Nom')).toBeInTheDocument()
  })

  it('modal contains the "Enregistrer" button', () => {
    render(<AnimauxPage />)
    fireEvent.click(screen.getByText('Ajouter animal'))
    expect(screen.getByText('Enregistrer')).toBeInTheDocument()
  })

  it('modal closes when clicking "Annuler"', () => {
    render(<AnimauxPage />)
    fireEvent.click(screen.getByText('Ajouter animal'))
    expect(screen.getByText('Ajouter un animal')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Annuler'))
    expect(screen.queryByText('Ajouter un animal')).not.toBeInTheDocument()
  })

  it('modal contains Espèce dropdown with Bovin option', () => {
    render(<AnimauxPage />)
    fireEvent.click(screen.getByText('Ajouter animal'))
    // There should be a select with Bovin option inside modal
    const options = screen.getAllByRole('option', { name: 'Bovin' })
    expect(options.length).toBeGreaterThan(0)
  })
})
