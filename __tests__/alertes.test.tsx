import { render, screen } from '@testing-library/react'
import AlertesSanitaires from '@/components/AlertesSanitaires'

describe('AlertesSanitaires', () => {
  it('affiche chaque alerte avec son détail', () => {
    render(<AlertesSanitaires />)
    expect(screen.getByText('Vaccin FMD — Bovins (lot B)')).toBeInTheDocument()
    expect(screen.getByText('Animal malade — Bovin #BV-007')).toBeInTheDocument()
    expect(screen.getByText('Quota de vente atteint — Ovins')).toBeInTheDocument()
  })

  // Le badge compte les alertes « haute » ; il y en a deux dans le jeu par
  // défaut. On cible le badge et pas un /2/ nu, qui matche aussi « 2026 »
  // dans le détail d'une alerte.
  it('compte les alertes de priorité haute dans le badge', () => {
    render(<AlertesSanitaires />)
    expect(screen.getByText(/urgente/).textContent).toContain('2')
  })
})
