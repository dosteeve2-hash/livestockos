/**
 * Montants en francs CFA, séparateur de milliers français.
 * Le franc CFA n'a pas de subdivision en usage : les décimales éventuelles
 * sont arrondies plutôt qu'affichées.
 */
export function formatFCFA(n: number): string {
  if (!Number.isFinite(n)) return '— FCFA'
  return Math.round(n).toLocaleString('fr-FR') + ' FCFA'
}
