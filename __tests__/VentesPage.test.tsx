import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => React.createElement('div', null, children),
  BarChart: ({ children }: any) => React.createElement('div', null, children),
  Bar: () => null,
  LineChart: ({ children }: any) => React.createElement('div', null, children),
  Line: () => null,
  PieChart: ({ children }: any) => React.createElement('div', null, children),
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/ventes',
}))

import VentesPage from '@/app/(dashboard)/ventes/page'
import { toast } from 'sonner'

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('VentesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. Rendu sans crash
  it('renders without crashing', () => {
    render(<VentesPage />)
    expect(screen.getByText('Ventes Animales')).toBeInTheDocument()
  })

  // 2. Titre principal
  it('affiche le titre Ventes Animales', () => {
    render(<VentesPage />)
    expect(screen.getByText('Ventes Animales')).toBeInTheDocument()
  })

  // 3. KPI CA confirmé
  it('affiche le KPI CA confirmé', () => {
    render(<VentesPage />)
    expect(screen.getByText('CA confirmé')).toBeInTheDocument()
  })

  // 4. KPI Ventes confirmées
  it('affiche le KPI Ventes confirmées', () => {
    render(<VentesPage />)
    expect(screen.getByText('Ventes confirmées')).toBeInTheDocument()
  })

  // 5. KPI En cours
  it('affiche le KPI En cours', () => {
    render(<VentesPage />)
    expect(screen.getByText('En cours')).toBeInTheDocument()
  })

  // 6. KPI Ticket moyen
  it('affiche le KPI Ticket moyen', () => {
    render(<VentesPage />)
    expect(screen.getByText('Ticket moyen')).toBeInTheDocument()
  })

  // 7. Vente VTE-001 présente
  it('affiche la vente VTE-001', () => {
    render(<VentesPage />)
    expect(screen.getByText('VTE-001')).toBeInTheDocument()
  })

  // 8. Animal bovin VTE-001
  it('affiche Bovin adulte (BV-105)', () => {
    render(<VentesPage />)
    expect(screen.getByText('Bovin adulte (BV-105)')).toBeInTheDocument()
  })

  // 9. Vente ovin présente
  it('affiche la vente d\'ovin bélier reproducteur', () => {
    render(<VentesPage />)
    expect(screen.getByText('Ovin bélier reproducteur')).toBeInTheDocument()
  })

  // 10. Vente volaille présente
  it('affiche la vente de poulets de chair', () => {
    render(<VentesPage />)
    expect(screen.getByText('Poulet de chair')).toBeInTheDocument()
  })

  // 11. Statuts confirmée affichés
  it('affiche les statuts Confirmée', () => {
    render(<VentesPage />)
    expect(screen.getAllByText('Confirmée').length).toBeGreaterThan(0)
  })

  // 12. Statut En cours affiché
  it('affiche les statuts En cours', () => {
    render(<VentesPage />)
    // VTE-004 et VTE-007 sont En cours
    const enCours = screen.getAllByText('En cours')
    expect(enCours.length).toBeGreaterThan(1) // KPI + badge(s)
  })

  // 13. Statut Annulée affiché
  it('affiche le statut Annulée', () => {
    render(<VentesPage />)
    expect(screen.getAllByText('Annulée').length).toBeGreaterThan(0)
  })

  // 14. Filtre Confirmée
  it('le filtre Confirmée n\'affiche que les ventes confirmées', () => {
    render(<VentesPage />)
    const buttons = screen.getAllByRole('button')
    const confirmeBtn = buttons.find(b => b.textContent === 'Confirmée')!
    fireEvent.click(confirmeBtn)
    expect(screen.getByText('VTE-001')).toBeInTheDocument()
    expect(screen.queryByText('VTE-004')).not.toBeInTheDocument()
  })

  // 15. Filtre En cours
  it('le filtre En cours n\'affiche que les ventes en cours', () => {
    render(<VentesPage />)
    const buttons = screen.getAllByRole('button')
    const enCoursBtn = buttons.find(b => b.textContent === 'En cours')!
    fireEvent.click(enCoursBtn)
    expect(screen.getByText('VTE-004')).toBeInTheDocument()
    expect(screen.queryByText('VTE-001')).not.toBeInTheDocument()
  })

  // 16. Filtre Annulée
  it('le filtre Annulée n\'affiche que les ventes annulées', () => {
    render(<VentesPage />)
    const annuleeBtn = screen.getByText('Annulée', { selector: 'button' })
    fireEvent.click(annuleeBtn)
    expect(screen.getByText('VTE-008')).toBeInTheDocument()
    expect(screen.queryByText('VTE-001')).not.toBeInTheDocument()
  })

  // 17. Recherche par animal
  it('la recherche filtre par animal', () => {
    render(<VentesPage />)
    const input = screen.getByPlaceholderText(/Rechercher animal/)
    fireEvent.change(input, { target: { value: 'veau' } })
    expect(screen.getByText('VTE-005')).toBeInTheDocument()
    expect(screen.queryByText('VTE-001')).not.toBeInTheDocument()
  })

  // 18. Recherche par acheteur
  it('la recherche filtre par acheteur', () => {
    render(<VentesPage />)
    const input = screen.getByPlaceholderText(/Rechercher animal/)
    fireEvent.change(input, { target: { value: 'kaboré ali' } })
    expect(screen.getByText('VTE-002')).toBeInTheDocument()
    expect(screen.queryByText('VTE-001')).not.toBeInTheDocument()
  })

  // 19. Aucune vente trouvée
  it('affiche Aucune vente trouvée si la recherche ne correspond à rien', () => {
    render(<VentesPage />)
    const input = screen.getByPlaceholderText(/Rechercher animal/)
    fireEvent.change(input, { target: { value: 'XXXXXXXXXX' } })
    expect(screen.getByText('Aucune vente trouvée')).toBeInTheDocument()
  })

  // 20. Bouton Nouvelle vente présent
  it('affiche le bouton Nouvelle vente', () => {
    render(<VentesPage />)
    expect(screen.getByText('Nouvelle vente')).toBeInTheDocument()
  })

  // 21. Ouverture modal nouvelle vente
  it('clic sur Nouvelle vente ouvre le modal', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('Nouvelle vente'))
    expect(screen.getByText('Nouvelle vente', { selector: 'h2' })).toBeInTheDocument()
  })

  // 22. Fermeture modal Annuler
  it('le bouton Annuler ferme le modal nouvelle vente', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('Nouvelle vente'))
    const cancelBtn = screen.getByText('Annuler')
    fireEvent.click(cancelBtn)
    expect(screen.queryByRole('heading', { name: 'Nouvelle vente' })).not.toBeInTheDocument()
  })

  // 23. Soumission formulaire vide ne crée pas
  it('soumission formulaire vide ne crée pas de vente', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('Nouvelle vente'))
    fireEvent.click(screen.getByText('Enregistrer'))
    expect(toast.success).not.toHaveBeenCalled()
  })

  // 24. Création vente valide
  it('créer une vente valide appelle toast.success', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('Nouvelle vente'))
    fireEvent.change(screen.getByPlaceholderText('ex: Bovin adulte (BV-105)'), { target: { value: 'Ovin engraissé' } })
    fireEvent.change(screen.getByPlaceholderText('ex: 280000'), { target: { value: '55000' } })
    fireEvent.change(screen.getByPlaceholderText('Nom complet'), { target: { value: 'Diallo Test' } })
    fireEvent.click(screen.getByText('Enregistrer'))
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('VTE-009'))
  })

  // 25. Clic sur ligne ouvre modal détail
  it('clic sur une ligne de vente ouvre le modal détail', () => {
    render(<VentesPage />)
    const row = screen.getByText('VTE-001').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('VTE-001')).toBeInTheDocument()
    expect(screen.getByText('Ouédraogo Seydou')).toBeInTheDocument()
  })

  // 26. Modal détail — acheteur affiché
  it('le modal détail affiche l\'acheteur', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('VTE-002').closest('tr')!)
    expect(screen.getByText('Kaboré Ali')).toBeInTheDocument()
  })

  // 27. Modal détail — mode paiement Orange Money
  it('le modal détail affiche le mode de paiement', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('VTE-002').closest('tr')!)
    expect(screen.getAllByText('Orange Money').length).toBeGreaterThan(0)
  })

  // 28. Bouton Confirmer dans le modal pour vente En cours
  it('le modal détail d\'une vente En cours affiche le bouton Confirmer', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('VTE-004').closest('tr')!)
    expect(screen.getByText('Confirmer')).toBeInTheDocument()
  })

  // 29. Confirmer une vente En cours appelle toast.success
  it('confirmer une vente appelle toast.success', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('VTE-004').closest('tr')!)
    fireEvent.click(screen.getByText('Confirmer'))
    expect(toast.success).toHaveBeenCalled()
  })

  // 30. Annuler une vente En cours appelle toast.error
  it('annuler une vente appelle toast.error', () => {
    render(<VentesPage />)
    fireEvent.click(screen.getByText('VTE-004').closest('tr')!)
    fireEvent.click(screen.getByText('Annuler'))
    expect(toast.error).toHaveBeenCalled()
  })
})
