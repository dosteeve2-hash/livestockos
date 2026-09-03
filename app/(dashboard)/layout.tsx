'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PawPrint, FileBarChart2, Stethoscope, Package, DollarSign, Wheat, Syringe, Activity } from 'lucide-react'

// `soon: true` marque une section prévue mais dont la page n'existe pas encore.
// Ces entrées étaient de simples <Link> : cliquer dessus menait à un 404 nu, sur
// un dépôt public avec démo en ligne. Elles restent visibles — elles disent où
// va le produit — mais ne sont plus cliquables et l'annoncent.
export const navItems = [
  { href: '/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/animaux',      label: 'Animaux',       icon: PawPrint        },
  { href: '/production',   label: 'Production',    icon: Activity        },
  { href: '/alimentation', label: 'Alimentation',  icon: Wheat           },
  { href: '/vaccination',  label: 'Vaccination',   icon: Syringe         },
  { href: '/sante',        label: 'Santé',         icon: Stethoscope,     soon: true },
  { href: '/stocks',       label: 'Stocks',        icon: Package,         soon: true },
  { href: '/ventes',       label: 'Ventes',        icon: DollarSign,      soon: true },
  { href: '/rapports',     label: 'Rapports',      icon: FileBarChart2   },
] as const

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0A1628' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', paddingTop: '1.5rem',
        backgroundColor: '#0c1a34', borderRight: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 1.25rem', marginBottom: '2rem' }}>
          <PawPrint style={{ width: 22, height: 22, color: '#D4AF37' }} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f0f4ff' }}>LivestockOS</span>
        </div>

        <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const { href, label, icon: Icon } = item
            const soon = 'soon' in item && item.soon
            const active = pathname === href

            const base = {
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.875rem', borderRadius: 10, fontSize: '0.875rem', fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.15s',
              backgroundColor: active ? 'rgba(212,175,55,0.14)' : 'transparent',
              color: active ? '#D4AF37' : 'rgba(240,244,255,0.55)',
              borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
            } as const

            if (soon) {
              return (
                <span
                  key={href}
                  aria-disabled="true"
                  title="Section à venir"
                  style={{ ...base, color: 'rgba(240,244,255,0.28)', cursor: 'not-allowed' }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                  {label}
                  <span style={{
                    marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em',
                    padding: '0.1rem 0.4rem', borderRadius: 99,
                    backgroundColor: 'rgba(240,244,255,0.06)', color: 'rgba(240,244,255,0.4)',
                  }}>
                    BIENTÔT
                  </span>
                </span>
              )
            }

            return (
              <Link key={href} href={href} style={base}>
                <Icon style={{ width: 16, height: 16 }} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '1rem' }}>
          <p style={{ color: 'rgba(240,244,255,0.25)', fontSize: '0.7rem', margin: 0 }}>FORGE Afrika · v0.1</p>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
    </div>
  )
}
