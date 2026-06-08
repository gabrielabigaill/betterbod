'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/admin',                icon: '⊞' },
  { label: 'Orders',          href: '/admin/orders',         icon: '🛍' },
  { label: 'Products',        href: '/admin/products',       icon: '📦' },
  { label: 'Programs',        href: '/admin/programs',       icon: '🏋' },
  { label: 'Bundles',         href: '/admin/bundles',        icon: '🎁' },
  { label: 'Users',           href: '/admin/users',          icon: '👥' },
  { label: 'Stride Club',     href: '/admin/stride',         icon: '👟' },
  { label: 'Coupons',         href: '/admin/coupons',        icon: '🏷' },
  { label: 'Reviews',         href: '/admin/reviews',        icon: '⭐' },
  { label: 'Subscribers',     href: '/admin/subscribers',    icon: '📧' },
  { label: 'Email Templates', href: '/admin/email-templates',icon: '✉' },
  { label: 'Settings',        href: '/admin/settings',       icon: '⚙' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">

      {/* ── Sidebar ── */}
      <aside className={clsx(
        'flex flex-col bg-[#1a1a2e] text-white transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight">
              Better<span className="text-[#FF6357]">Body</span>
              <span className="ml-2 text-xs font-normal text-white/40 uppercase tracking-widest">Admin</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto text-white/50 hover:text-white transition-colors p-1 rounded"
            aria-label="Toggle sidebar"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  active
                    ? 'bg-[#FF6357]/20 text-[#FF6357] border-r-2 border-[#FF6357]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: back to site */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors"
            title={collapsed ? 'View Site' : undefined}
          >
            <span className="shrink-0">↗</span>
            {!collapsed && <span>View Site</span>}
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-semibold text-[#1a1a2e]">
            {NAV_ITEMS.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label ?? 'Admin'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-[#00B4A0] inline-block" />
            <span>Live</span>
            <span className="font-medium text-[#1a1a2e]">Judith</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
