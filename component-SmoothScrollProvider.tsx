// components/providers/SmoothScrollProvider.tsx
'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Init Lenis smooth scroll
    const lenis = new Lenis({
      duration:   1.2,
      easing:     (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Scroll progress bar
    const progressBar = document.getElementById('scroll-progress')
    if (progressBar) {
      lenis.on('scroll', ({ progress }: { progress: number }) => {
        progressBar.style.width = `${progress * 100}%`
      })
    }

    // Custom cursor
    const cursor = document.getElementById('custom-cursor')
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
      let mouseX = 0, mouseY = 0
      let curX = 0, curY = 0

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
      })

      // Smooth cursor follow
      const animateCursor = () => {
        curX += (mouseX - curX) * 0.15
        curY += (mouseY - curY) * 0.15
        cursor.style.left = `${curX}px`
        cursor.style.top  = `${curY}px`
        requestAnimationFrame(animateCursor)
      }
      animateCursor()

      // Hovering state on interactive elements
      const addHover    = () => cursor.classList.add('hovering')
      const removeHover = () => cursor.classList.remove('hovering')
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    }

    // GSAP scroll-triggered reveals
    const setupRevealAnimations = () => {
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start:   'top 85%',
              once:    true,
            },
          }
        )
      })
    }
    setupRevealAnimations()

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <>
      <div id="scroll-progress" style={{ position: 'fixed', top: 0, left: 0, height: '3px', background: 'var(--coral)', zIndex: 9999, width: '0%', transformOrigin: 'left' }} />
      <div id="custom-cursor" />
      {children}
    </>
  )
}
