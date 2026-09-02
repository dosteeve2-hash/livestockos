'use client'

import { useSyncExternalStore } from 'react'

// Aucun abonnement : la valeur ne change qu'une fois, à l'hydratation.
const subscribe = () => () => {}

/**
 * `false` pendant le rendu serveur et la première passe d'hydratation,
 * `true` ensuite. Remplace le couple `useState(false)` + `useEffect(() =>
 * setMounted(true), [])`, qui provoque un rendu en cascade.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
