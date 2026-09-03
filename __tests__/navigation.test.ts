import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { navItems } from '@/app/(dashboard)/layout'

const appDir = join(process.cwd(), 'app', '(dashboard)')

/** Une entrée de nav n'est légitime que si la page correspondante existe. */
function pageExists(href: string): boolean {
  return existsSync(join(appDir, href.replace(/^\//, ''), 'page.tsx'))
}

describe('navigation du tableau de bord', () => {
  // Trois entrées pointaient vers des routes inexistantes : cliquer dessus
  // renvoyait un 404 nu, sur un dépôt public avec une démo en ligne. Ce test
  // lie la barre latérale à l'arborescence réelle des pages.
  it.each(navItems.filter((i) => !('soon' in i && i.soon)).map((i) => [i.label, i.href]))(
    'le lien actif « %s » (%s) correspond à une page existante',
    (_label, href) => {
      expect(pageExists(href)).toBe(true)
    },
  )

  it.each(navItems.filter((i) => 'soon' in i && i.soon).map((i) => [i.label, i.href]))(
    '« %s » (%s) est marqué à venir tant que la page n\'existe pas',
    (_label, href) => {
      expect(pageExists(href)).toBe(false)
    },
  )

  it('expose au moins une section active', () => {
    expect(navItems.some((i) => !('soon' in i && i.soon))).toBe(true)
  })
})
