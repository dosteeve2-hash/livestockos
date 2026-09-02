import { formatFCFA } from '@/lib/format'

// L'ICU utilise une espace insécable étroite (U+202F) comme séparateur de
// milliers en fr-FR ; on normalise pour que l'assertion reste lisible.
const normalise = (s: string) => s.replace(/ | /g, ' ')

describe('formatFCFA', () => {
  it('sépare les milliers à la française', () => {
    expect(normalise(formatFCFA(1250000))).toBe('1 250 000 FCFA')
  })

  it('laisse les petits montants intacts', () => {
    expect(normalise(formatFCFA(0))).toBe('0 FCFA')
    expect(normalise(formatFCFA(750))).toBe('750 FCFA')
  })

  // Les coûts sont des sommes de rations : une division peut produire des
  // centimes, qui n'existent pas en franc CFA.
  it('arrondit les décimales', () => {
    expect(normalise(formatFCFA(1250.4))).toBe('1 250 FCFA')
    expect(normalise(formatFCFA(999.6))).toBe('1 000 FCFA')
  })

  it('ne rend pas « NaN FCFA »', () => {
    expect(formatFCFA(NaN)).toBe('— FCFA')
    expect(formatFCFA(Infinity)).toBe('— FCFA')
  })
})
