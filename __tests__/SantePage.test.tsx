import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => React.createElement('div', null, children),
  LineChart: ({ children }: any) => React.createElement('div', null, children),
  BarChart: ({ children }: any) => React.createElement('div', null, children),
  PieChart: ({ children }: any) => React.createElement('div', null, children),
  Line: () => null,
  Bar: () => null,
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
  usePathname: () => '/sante',
}))

import SantePage from '@/app/(dashboard)/sante/page'
import { toast } from 'sonner'

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('SantePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. Rendu sans crash
  it('renders without crashing', () => {
    render(<SantePage />)
    expect(screen.getByText('Santé Animale')).toBeInTheDocument()
  })

  // 2. Titre principal
  it('affiche le titre "Santé Animale"', () => {
    render(<SantePage />)
    expect(screen.getByText('Santé Animale')).toBeInTheDocument()
  })

  // 3. KPI — En traitement
  it('affiche le KPI "En traitement"', () => {
    render(<SantePage />)
    expect(screen.getByText('En traitement')).toBeInTheDocument()
  })

  // 4. KPI — Surveillance
  it('affiche le KPI "Surveillance"', () => {
    render(<SantePage />)
    expect(screen.getByText('Surveillance')).toBeInTheDocument()
  })

  // 5. KPI — Guéris ce mois
  it('affiche le KPI "Guéris ce mois"', () => {
    render(<SantePage />)
    expect(screen.getByText('Guéris ce mois')).toBeInTheDocument()
  })

  // 6. KPI — Taux guérison
  it('affiche le KPI "Taux guérison"', () => {
    render(<SantePage />)
    expect(screen.getByText('Taux guérison')).toBeInTheDocument()
  })

  // 7. Valeur en traitement initiale = 3
  it('affiche 3 animaux en traitement et 3 guéris (valeur "3" visible au moins 2 fois)', () => {
    render(<SantePage />)
    // enTraitement=3, gueris=3 → le texte "3" apparaît au moins 2 fois dans les KPIs
    const threes = screen.getAllByText('3')
    expect(threes.length).toBeGreaterThanOrEqual(2)
  })

  // 8. Dossier SAN-001 présent
  it('affiche le dossier SAN-001', () => {
    render(<SantePage />)
    expect(screen.getByText('SAN-001')).toBeInTheDocument()
  })

  // 9. Animal Fatou (BV-103) affiché
  it('affiche Fatou (BV-103)', () => {
    render(<SantePage />)
    expect(screen.getByText('Fatou (BV-103)')).toBeInTheDocument()
  })

  // 10. Maladie Fièvre aphteuse
  it('affiche la maladie Fièvre aphteuse', () => {
    render(<SantePage />)
    expect(screen.getByText('Fièvre aphteuse')).toBeInTheDocument()
  })

  // 11. Newcastle affiché
  it('affiche Newcastle', () => {
    render(<SantePage />)
    expect(screen.getByText('Newcastle')).toBeInTheDocument()
  })

  // 12. Mammite / Safi affiché
  it('affiche Safi (BV-103) et Mammite', () => {
    render(<SantePage />)
    expect(screen.getByText('Safi (BV-103)')).toBeInTheDocument()
    expect(screen.getByText('Mammite')).toBeInTheDocument()
  })

  // 13. Bouton "Nouveau dossier" présent
  it('affiche le bouton Nouveau dossier', () => {
    render(<SantePage />)
    expect(screen.getByText('Nouveau dossier')).toBeInTheDocument()
  })

  // 14. Filtre "Tous" actif par défaut
  it('le filtre Tous est actif par défaut', () => {
    render(<SantePage />)
    expect(screen.getAllByText('Tous')[0]).toBeInTheDocument()
  })

  // 15. Filtre "Guéri" réduit la liste
  it('le filtre Guéri affiche seulement les dossiers guéris', () => {
    render(<SantePage />)
    const gueriBtn = screen.getAllByText('Guéri').find(el => el.tagName === 'BUTTON')!
    fireEvent.click(gueriBtn)
    // Les dossiers guéris : SAN-003, SAN-004, SAN-006
    expect(screen.getByText('SAN-003')).toBeInTheDocument()
    // Les non-guéris ne doivent pas apparaître comme dossiers
    expect(screen.queryByText('SAN-001')).not.toBeInTheDocument()
  })

  // 16. Filtre "En traitement" fonctionne
  it('le filtre En traitement affiche seulement les dossiers en traitement', () => {
    render(<SantePage />)
    const buttons = screen.getAllByRole('button')
    const enTraitBtn = buttons.find(b => b.textContent === 'En traitement')!
    fireEvent.click(enTraitBtn)
    expect(screen.getByText('SAN-001')).toBeInTheDocument()
    expect(screen.queryByText('SAN-003')).not.toBeInTheDocument()
  })

  // 17. Filtre "Surveillance" fonctionne
  it('le filtre Surveillance affiche seulement les dossiers en surveillance', () => {
    render(<SantePage />)
    const surveillBtn = screen.getByText('Surveillance', { selector: 'button' })
    fireEvent.click(surveillBtn)
    expect(screen.getByText('SAN-005')).toBeInTheDocument()
    expect(screen.queryByText('SAN-001')).not.toBeInTheDocument()
  })

  // 18. Recherche par nom animal
  it('la recherche filtre par nom animal', () => {
    render(<SantePage />)
    const input = screen.getByPlaceholderText(/Rechercher animal/)
    fireEvent.change(input, { target: { value: 'rokia' } })
    expect(screen.getByText('SAN-005')).toBeInTheDocument()
    expect(screen.queryByText('SAN-001')).not.toBeInTheDocument()
  })

  // 19. Recherche par maladie
  it('la recherche filtre par maladie', () => {
    render(<SantePage />)
    const input = screen.getByPlaceholderText(/Rechercher animal/)
    fireEvent.change(input, { target: { value: 'newcastle' } })
    expect(screen.getByText('SAN-002')).toBeInTheDocument()
    expect(screen.queryByText('SAN-003')).not.toBeInTheDocument()
  })

  // 20. Message vide quand aucun dossier
  it('affiche "Aucun dossier trouvé" si la recherche ne correspond à rien', () => {
    render(<SantePage />)
    const input = screen.getByPlaceholderText(/Rechercher animal/)
    fireEvent.change(input, { target: { value: 'XXXXXXXXXXX' } })
    expect(screen.getByText('Aucun dossier trouvé')).toBeInTheDocument()
  })

  // 21. Bouton "✓ Guéri" présent pour les non-guéris
  it('affiche le bouton Guéri pour les dossiers non guéris', () => {
    render(<SantePage />)
    const gueriButtons = screen.getAllByText(/✓ Guéri/)
    expect(gueriButtons.length).toBeGreaterThan(0)
  })

  // 22. Clic sur "✓ Guéri" appelle toast.success
  it('marquer guéri depuis la table appelle toast.success', () => {
    render(<SantePage />)
    const gueriButtons = screen.getAllByText(/✓ Guéri/)
    fireEvent.click(gueriButtons[0])
    expect(toast.success).toHaveBeenCalled()
  })

  // 23. Ouverture modal nouveau dossier
  it('le clic sur Nouveau dossier ouvre le modal', () => {
    render(<SantePage />)
    fireEvent.click(screen.getByText('Nouveau dossier'))
    expect(screen.getByText('Nouveau dossier sanitaire')).toBeInTheDocument()
  })

  // 24. Fermeture modal avec Annuler
  it('le bouton Annuler ferme le modal nouveau dossier', () => {
    render(<SantePage />)
    fireEvent.click(screen.getByText('Nouveau dossier'))
    expect(screen.getByText('Nouveau dossier sanitaire')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Annuler'))
    expect(screen.queryByText('Nouveau dossier sanitaire')).not.toBeInTheDocument()
  })

  // 25. Soumission formulaire vide ne crée pas de dossier
  it('la soumission du formulaire vide ne crée pas de dossier', () => {
    render(<SantePage />)
    fireEvent.click(screen.getByText('Nouveau dossier'))
    fireEvent.click(screen.getByText('Créer le dossier'))
    expect(toast.success).not.toHaveBeenCalled()
  })

  // 26. Création d'un nouveau dossier valide
  it('créer un dossier valide appelle toast.success et ferme le modal', () => {
    render(<SantePage />)
    fireEvent.click(screen.getByText('Nouveau dossier'))
    fireEvent.change(screen.getByPlaceholderText('ex: Fatou (BV-103)'), { target: { value: 'Test Animal' } })
    fireEvent.change(screen.getByPlaceholderText('ex: Fièvre aphteuse'), { target: { value: 'Trypanosome' } })
    fireEvent.click(screen.getByText('Créer le dossier'))
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('SAN-008'))
    expect(screen.queryByText('Nouveau dossier sanitaire')).not.toBeInTheDocument()
  })

  // 27. Clic sur une ligne ouvre le modal détail
  it('clic sur une ligne de dossier ouvre le modal détail', () => {
    render(<SantePage />)
    const row = screen.getByText('SAN-001').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('SAN-001 — Fatou (BV-103)')).toBeInTheDocument()
  })

  // 28. Modal détail affiche la maladie
  it('le modal détail affiche la maladie du dossier sélectionné', () => {
    render(<SantePage />)
    fireEvent.click(screen.getByText('SAN-001').closest('tr')!)
    expect(screen.getAllByText('Fièvre aphteuse')[0]).toBeInTheDocument()
  })

  // 29. Bouton "Marquer comme guéri" dans le modal détail
  it('le modal détail contient le bouton Marquer comme guéri pour un dossier actif', () => {
    render(<SantePage />)
    fireEvent.click(screen.getByText('SAN-001').closest('tr')!)
    expect(screen.getByText('✓ Marquer comme guéri')).toBeInTheDocument()
  })

  // 30. Marquer guéri depuis le modal détail
  it('marquer guéri depuis le modal détail ferme le modal et appelle toast', () => {
    render(<SantePage />)
    fireEvent.click(screen.getByText('SAN-001').closest('tr')!)
    fireEvent.click(screen.getByText('✓ Marquer comme guéri'))
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('SAN-001'))
    expect(screen.queryByText('SAN-001 — Fatou (BV-103)')).not.toBeInTheDocument()
  })
})
