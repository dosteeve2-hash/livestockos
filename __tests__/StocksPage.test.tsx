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
  usePathname: () => '/stocks',
}))

import StocksPage from '@/app/(dashboard)/stocks/page'
import { toast } from 'sonner'

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('StocksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. Rendu sans crash
  it('renders without crashing', () => {
    render(<StocksPage />)
    expect(screen.getByText('Gestion des Stocks')).toBeInTheDocument()
  })

  // 2. Titre principal
  it('affiche le titre Gestion des Stocks', () => {
    render(<StocksPage />)
    expect(screen.getByText('Gestion des Stocks')).toBeInTheDocument()
  })

  // 3. KPI Références
  it('affiche le KPI Références', () => {
    render(<StocksPage />)
    expect(screen.getByText('Références')).toBeInTheDocument()
  })

  // 4. KPI Ruptures stock
  it('affiche le KPI Ruptures stock', () => {
    render(<StocksPage />)
    expect(screen.getByText('Ruptures stock')).toBeInTheDocument()
  })

  // 5. KPI Niveaux faibles
  it('affiche le KPI Niveaux faibles', () => {
    render(<StocksPage />)
    expect(screen.getByText('Niveaux faibles')).toBeInTheDocument()
  })

  // 6. KPI Valeur stock
  it('affiche le KPI Valeur stock', () => {
    render(<StocksPage />)
    expect(screen.getByText('Valeur stock')).toBeInTheDocument()
  })

  // 7. Bannière d'alerte ruptures/faibles
  it('affiche la bannière d\'alerte si ruptures ou faibles', () => {
    render(<StocksPage />)
    // STK-006 (Vaccin Newcastle) = 0 → Rupture ; STK-003, STK-005 <= seuil → Faibles
    expect(screen.getByText(/réapprovisionnement urgent recommandé/)).toBeInTheDocument()
  })

  // 8. STK-001 Maïs concassé présent
  it('affiche STK-001 Maïs concassé', () => {
    render(<StocksPage />)
    expect(screen.getByText('STK-001')).toBeInTheDocument()
    expect(screen.getByText('Maïs concassé')).toBeInTheDocument()
  })

  // 9. Vaccin Newcastle (rupture) présent
  it('affiche Vaccin Newcastle ND', () => {
    render(<StocksPage />)
    expect(screen.getByText('Vaccin Newcastle ND')).toBeInTheDocument()
  })

  // 10. Statut Rupture affiché
  it('affiche le statut Rupture pour Vaccin Newcastle', () => {
    render(<StocksPage />)
    expect(screen.getAllByText('Rupture').length).toBeGreaterThan(0)
  })

  // 11. Statut Faible affiché
  it('affiche le statut Faible pour les stocks sous le seuil', () => {
    render(<StocksPage />)
    expect(screen.getAllByText('Faible').length).toBeGreaterThan(0)
  })

  // 12. Statut OK affiché
  it('affiche le statut OK pour les stocks suffisants', () => {
    render(<StocksPage />)
    expect(screen.getAllByText('OK').length).toBeGreaterThan(0)
  })

  // 13. Onglet Inventaire actif par défaut
  it('l\'onglet Inventaire est actif par défaut', () => {
    render(<StocksPage />)
    expect(screen.getByText('Inventaire')).toBeInTheDocument()
  })

  // 14. Onglet Mouvements présent
  it('l\'onglet Mouvements est présent', () => {
    render(<StocksPage />)
    expect(screen.getByText('Mouvements')).toBeInTheDocument()
  })

  // 15. Basculer sur l'onglet Mouvements
  it('basculer sur Mouvements affiche les mouvements', () => {
    render(<StocksPage />)
    fireEvent.click(screen.getByText('Mouvements'))
    expect(screen.getByText('MV-001')).toBeInTheDocument()
  })

  // 16. Type Entrée dans les mouvements
  it('affiche les mouvements de type Entrée', () => {
    render(<StocksPage />)
    fireEvent.click(screen.getByText('Mouvements'))
    expect(screen.getAllByText('Entrée').length).toBeGreaterThan(0)
  })

  // 17. Type Sortie dans les mouvements
  it('affiche les mouvements de type Sortie', () => {
    render(<StocksPage />)
    fireEvent.click(screen.getByText('Mouvements'))
    expect(screen.getAllByText('Sortie').length).toBeGreaterThan(0)
  })

  // 18. Filtre catégorie Vaccin
  it('le filtre Vaccin affiche seulement les vaccins', () => {
    render(<StocksPage />)
    const vaccinBtn = screen.getByText('Vaccin', { selector: 'button' })
    fireEvent.click(vaccinBtn)
    expect(screen.getByText('Vaccin Newcastle ND')).toBeInTheDocument()
    expect(screen.queryByText('Maïs concassé')).not.toBeInTheDocument()
  })

  // 19. Filtre catégorie Médicament
  it('le filtre Médicament affiche seulement les médicaments', () => {
    render(<StocksPage />)
    const medBtn = screen.getByText('Médicament', { selector: 'button' })
    fireEvent.click(medBtn)
    expect(screen.getByText('Oxytétracycline 20%')).toBeInTheDocument()
    expect(screen.queryByText('Maïs concassé')).not.toBeInTheDocument()
  })

  // 20. Filtre catégorie Aliment
  it('le filtre Aliment affiche seulement les aliments', () => {
    render(<StocksPage />)
    const alimentBtn = screen.getByText('Aliment', { selector: 'button' })
    fireEvent.click(alimentBtn)
    expect(screen.getByText('Maïs concassé')).toBeInTheDocument()
    expect(screen.queryByText('Vaccin Newcastle ND')).not.toBeInTheDocument()
  })

  // 21. Recherche produit
  it('la recherche filtre les produits', () => {
    render(<StocksPage />)
    const input = screen.getByPlaceholderText(/Rechercher produit/)
    fireEvent.change(input, { target: { value: 'imidocarbe' } })
    expect(screen.getByText('Imidocarbe (Imizol)')).toBeInTheDocument()
    expect(screen.queryByText('Maïs concassé')).not.toBeInTheDocument()
  })

  // 22. Recherche sans résultat
  it('la recherche sans résultat affiche Aucun produit trouvé', () => {
    render(<StocksPage />)
    const input = screen.getByPlaceholderText(/Rechercher produit/)
    fireEvent.change(input, { target: { value: 'XXXXXXXXXXX' } })
    expect(screen.getByText('Aucun produit trouvé')).toBeInTheDocument()
  })

  // 23. Bouton Nouveau produit
  it('affiche le bouton Nouveau produit', () => {
    render(<StocksPage />)
    expect(screen.getByText('Nouveau produit')).toBeInTheDocument()
  })

  // 24. Ouverture modal nouveau produit
  it('clic sur Nouveau produit ouvre le modal', () => {
    render(<StocksPage />)
    fireEvent.click(screen.getByText('Nouveau produit'))
    expect(screen.getByText('Nouveau produit en stock')).toBeInTheDocument()
  })

  // 25. Fermeture modal Annuler
  it('le bouton Annuler ferme le modal nouveau produit', () => {
    render(<StocksPage />)
    fireEvent.click(screen.getByText('Nouveau produit'))
    fireEvent.click(screen.getByText('Annuler'))
    expect(screen.queryByText('Nouveau produit en stock')).not.toBeInTheDocument()
  })

  // 26. Soumission formulaire vide ne crée pas
  it('soumission vide ne crée pas de produit', () => {
    render(<StocksPage />)
    fireEvent.click(screen.getByText('Nouveau produit'))
    fireEvent.click(screen.getByText('Ajouter'))
    expect(toast.success).not.toHaveBeenCalled()
  })

  // 27. Création d'un nouveau produit valide
  it('créer un produit valide appelle toast.success', () => {
    render(<StocksPage />)
    fireEvent.click(screen.getByText('Nouveau produit'))
    fireEvent.change(screen.getByPlaceholderText('ex: Maïs concassé'), { target: { value: 'Soja broyé' } })
    fireEvent.change(screen.getByPlaceholderText('ex: 500'), { target: { value: '300' } })
    fireEvent.click(screen.getByText('Ajouter'))
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('STK-013'))
  })

  // 28. Barre de progression présente
  it('affiche des barres de progression dans la table', () => {
    render(<StocksPage />)
    // Les barres sont des divs avec height:4
    const bars = document.querySelectorAll('[style*="height: 4"]')
    expect(bars.length).toBeGreaterThan(0)
  })

  // 29. Filtre Matériel
  it('le filtre Matériel affiche les items matériels', () => {
    render(<StocksPage />)
    const materielBtn = screen.getByText('Matériel', { selector: 'button' })
    fireEvent.click(materielBtn)
    expect(screen.getByText('Auge en plastique 30L')).toBeInTheDocument()
  })

  // 30. Retour au filtre Tous
  it('le filtre Tous réaffiche tous les produits', () => {
    render(<StocksPage />)
    fireEvent.click(screen.getByText('Vaccin', { selector: 'button' }))
    fireEvent.click(screen.getByText('Tous', { selector: 'button' }))
    expect(screen.getByText('Maïs concassé')).toBeInTheDocument()
    expect(screen.getByText('Vaccin Newcastle ND')).toBeInTheDocument()
  })
})
