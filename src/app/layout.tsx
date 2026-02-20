import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { QueryProvider } from '@/components/QueryProvider'

export const metadata: Metadata = {
  title: 'Sentinelle – Veille Cybersécurité',
  description: 'Tableau de bord de surveillance des incidents de cybersécurité en temps réel : ransomwares, fuites de données, vulnérabilités CVE.',
  keywords: ['cybersécurité', 'ransomware', 'data leak', 'CVE', 'OSINT', 'threat intelligence'],
  authors: [{ name: 'Sentinelle' }],
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-cyber-bg text-cyber-text min-h-screen grid-bg">
        <QueryProvider>
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-cyber-border mt-16 py-6 text-center text-cyber-muted text-sm">
            <p>Sentinelle &copy; {new Date().getFullYear()} – Veille Cybersécurité en Continu</p>
          </footer>
        </QueryProvider>
      </body>
    </html>
  )
}
