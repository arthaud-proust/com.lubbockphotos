'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

const Layout = ({ children }) => {
  const ref = useRef()
  const pathname = usePathname()

  const links: Array<{ label: string; href: string }> = [
    { label: 'Lubbock', href: '/' },
    { label: 'Carousel', href: '/carousel' },
    { label: 'Grid', href: '/grid' },
    { label: 'Gallery', href: '/gallery' },
  ]

  return (
    <div id='layout' ref={ref} className='relative size-full touch-auto overflow-auto'>
      <main className='flex min-h-screen items-start gap-4 px-4 pt-8 md:gap-8 md:px-8'>
        <nav className='text-body sticky top-8 z-50 w-24 shrink-0'>
          {links.map((link, index) => (
            <Link
              key={index}
              aria-disabled={link.href === '/' ? pathname === link.href : pathname.startsWith(link.href)}
              className='group flex items-center underline-offset-2 hover:underline'
              href={link.href}
            >
              <span className='block h-px w-0 bg-black transition-all duration-100 group-aria-disabled:w-5'></span>
              <span className='block h-px w-0 transition-all duration-100 group-aria-disabled:w-2'></span>
              {link.label}
            </Link>
          ))}
        </nav>

        {children}
      </main>

      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventSource={ref}
        eventPrefix='client'
      />
    </div>
  )
}

export { Layout }
