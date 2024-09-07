'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useRef } from 'react'
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

type Link = { label: string; href: string; onMobile: boolean }
const isRoot = (url: string) => url === '/'
const isLinkActive = (link: Link, currentPathname: string) =>
  isRoot(link.href) ? currentPathname === link.href : currentPathname.startsWith(link.href)

const Layout = ({ children, isBgDark }: PropsWithChildren<{ isBgDark: boolean }>) => {
  const ref = useRef()
  const pathname = usePathname()

  const links: Array<Link> = [
    { label: 'Lubbock', href: '/', onMobile: true },
    { label: 'Carousel', href: '/carousel', onMobile: false },
    { label: 'Gallery', href: '/gallery', onMobile: true },
    { label: 'Grid', href: '/grid', onMobile: true },
  ]

  return (
    <div
      id='layout'
      ref={ref}
      className={
        'relative size-full touch-auto overflow-auto ' + (isBgDark ? 'bg-black text-white' : 'bg-white text-black')
      }
    >
      <main className='relative flex min-h-svh items-start gap-4 px-4 pt-8 md:gap-8 md:px-8'>
        <nav className='text-body sticky top-8 z-50 flex w-24 shrink-0 flex-col'>
          {links.map((link, index) => (
            <Link
              key={index}
              aria-current={isLinkActive(link, pathname) ? 'page' : false}
              className={'group flex items-center ' + (!link.onMobile ? 'max-md:hidden' : '')}
              href={link.href}
            >
              <span
                className={
                  'block h-px w-0 transition-all duration-100 group-aria-current-page:w-5 ' +
                  (isBgDark ? 'bg-white' : 'bg-black')
                }
              ></span>
              <span className='block h-px w-0 transition-all duration-100 group-aria-current-page:w-2'></span>
              <span className={isLinkActive(link, pathname) ? '' : 'link'}>{link.label}</span>
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
