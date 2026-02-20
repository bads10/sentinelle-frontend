'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, LayoutDashboard, List, AlertTriangle, Activity, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/incidents', label: 'Incidents', icon: List },
  { href: '/alerts', label: 'Alertes', icon: AlertTriangle },
  { href: '/stats', label: 'Statistiques', icon: Activity },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-b border-cyber-border bg-cyber-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg flex items-center justify-center group-hover:border-cyber-primary transition-colors">
              <Shield className="w-4 h-4 text-cyber-primary" />
            </div>
            <span className="font-bold text-xl text-cyber-text">
              <span className="text-cyber-primary">Senti</span>nelle
            </span>
            <span className="hidden sm:inline-flex text-xs bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20 rounded px-1.5 py-0.5 font-mono">LIVE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20'
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-card'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-cyber-accent">
              <span className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
              Système opérationnel
            </div>
          </div>

          <button className="md:hidden p-2 text-cyber-muted hover:text-cyber-text" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-cyber-border bg-cyber-surface">
          <div className="px-4 py-2 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href ? 'bg-cyber-primary/10 text-cyber-primary' : 'text-cyber-muted hover:text-cyber-text')}
              >
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
