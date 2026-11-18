import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  CSSProperties,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent,
} from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Activity,
  Award,
  Check,
  ChevronDown,
  Copy,
  Cpu,
  DoorOpen,
  Download,
  Github,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Search,
  Sun,
  X,
  Zap,
} from 'lucide-react'
import {
  awards,
  certifications,
  doors,
  education,
  facts,
  internship,
  profile,
  projects,
  skillGroups,
  tooltips,
  type Door,
  type Project,
} from './data/content'
import { IntroLoader, PortraitSlot, PullCord } from './components/SignatureInteractions'

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.2, 0.7, 0.2, 1] } },
}

function useLocalTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date()),
      )
    update()
    const interval = window.setInterval(update, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  return time
}

function Header({ dark, onThemeToggle, onCommandOpen }: { dark: boolean; onThemeToggle: () => void; onCommandOpen: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('doors')
  const time = useLocalTime()
  const links = [
    ['Work', '#doors'],
    ['About', '#story'],
    ['Skills', '#toolbox'],
    ['Contact', '#contact'],
  ]

  useEffect(() => {
    const sectionIds = ['doors', 'story', 'toolbox', 'contact']
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (current) setActiveSection(current.target.id)
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="site-header">
      <a className="header-brand" href="#top" aria-label="Bharath Bhat, back to top">
        <span className="brand-mark">B.</span>
        <span>BHARATH BHAT</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className={href === `#${activeSection}` ? 'nav-active' : ''}
            aria-current={href === `#${activeSection}` ? 'location' : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <span className="ist-clock"><span className="live-dot" /> {time || '--:--'} IST</span>
        <button className="command-trigger" type="button" aria-label="Open quick navigation" aria-keyshortcuts="Control+K Meta+K" onClick={onCommandOpen}>
          <Search size={14} /><span>Explore</span><kbd>CTRL K</kbd>
        </button>
        <button className="theme-button" type="button" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={dark} onClick={onThemeToggle}>
          <span className="theme-glyph"><Sun size={15} /><Moon size={14} /></span>
          <span>{dark ? 'Dark' : 'Light'}</span>
        </button>
        <a className="resume-link" href={profile.resume} download="Bharath_Bhat_Resume.pdf">
          <Download size={14} /> Resume
        </a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={15} /> : <Menu size={15} />}
          {menuOpen ? 'Close' : 'Menu'}
          <ChevronDown className={menuOpen ? 'chevron-open' : ''} size={13} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={14} /></a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

type PaletteEntry = {
  id: string
  label: string
  detail: string
  group: string
  kind: 'navigate' | 'room' | 'theme' | 'resume'
  target?: string
}

function CommandPalette({
  onClose,
  onOpenRoom,
  onToggleTheme,
}: {
  onClose: () => void
  onOpenRoom: (id: string) => void
  onToggleTheme: () => void
}) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([])
  const reduced = useReducedMotion()
  const entries: PaletteEntry[] = [
    { id: 'signal', label: 'Signal Lab', detail: '3D circuit and signal controls', group: 'JUMP TO', kind: 'navigate', target: 'signal-lab' },
    { id: 'work', label: 'Work and projects', detail: 'Explore the four project rooms', group: 'JUMP TO', kind: 'navigate', target: 'doors' },
    { id: 'story', label: 'The story so far', detail: 'Education, internship, and awards', group: 'JUMP TO', kind: 'navigate', target: 'story' },
    { id: 'toolbox', label: 'The toolbox', detail: 'Search skills and technologies', group: 'JUMP TO', kind: 'navigate', target: 'toolbox' },
    { id: 'learning', label: 'Learning in progress', detail: 'Education and certifications', group: 'JUMP TO', kind: 'navigate', target: 'learning' },
    { id: 'contact', label: 'Say hello', detail: 'Contact details and message form', group: 'JUMP TO', kind: 'navigate', target: 'contact' },
    ...doors.map((door) => ({
      id: door.id,
      label: door.title,
      detail: `Open room ${door.number}`,
      group: 'OPEN A ROOM',
      kind: 'room' as const,
      target: door.id,
    })),
    { id: 'theme', label: 'Toggle appearance', detail: 'Switch between light and dark', group: 'ACTIONS', kind: 'theme' },
    { id: 'resume', label: 'Download resume', detail: 'Save Bharath_Bhat_Resume.pdf', group: 'ACTIONS', kind: 'resume' },
  ]
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = entries.filter((entry) =>
    `${entry.label} ${entry.detail} ${entry.group}`.toLowerCase().includes(normalizedQuery),
  )

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    inputRef.current?.focus()
    return () => previousFocus?.focus()
  }, [])

  useEffect(() => setActiveIndex(0), [query])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (filtered.length) {
        setActiveIndex((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length)
      }
    } else if (event.key === 'Enter' && filtered[activeIndex]) {
      event.preventDefault()
      resultRefs.current[activeIndex]?.click()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
  }

  return (
    <motion.div
      className="command-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        className="command-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-title"
        initial={reduced ? false : { opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? undefined : { opacity: 0, y: -8, scale: 0.99 }}
        transition={{ duration: reduced ? 0 : 0.2 }}
      >
        <div className="command-heading">
          <span id="command-title">QUICK NAVIGATION</span>
          <button type="button" aria-label="Close quick navigation" onClick={onClose}>ESC</button>
        </div>
        <label className="command-search">
          <Search size={18} />
          <span className="sr-only">Search pages, rooms, and actions</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Where do you want to go?"
            aria-controls="command-results"
            aria-activedescendant={filtered[activeIndex] ? `command-result-${filtered[activeIndex].id}` : undefined}
          />
          <kbd>ESC</kbd>
        </label>
        <div className="command-results" id="command-results" role="listbox" aria-label="Quick navigation results">
          {filtered.map((entry, index) => {
            const resultClass = `command-result ${index === activeIndex ? 'command-result-active' : ''}`
            const resultContent = (
              <>
                <span className="command-result-mark" aria-hidden="true">
                  {entry.kind === 'room' ? '0' + (doors.findIndex((door) => door.id === entry.target) + 1) : entry.kind === 'navigate' ? '↗' : '⌘'}
                </span>
                <span className="command-result-copy"><strong>{entry.label}</strong><small>{entry.detail}</small></span>
                <span className="command-result-group">{entry.group}</span>
              </>
            )
            if (entry.kind === 'navigate' || entry.kind === 'resume') {
              return (
                <a
                  key={entry.id}
                  id={`command-result-${entry.id}`}
                  ref={(element) => { resultRefs.current[index] = element }}
                  className={resultClass}
                  href={entry.kind === 'resume' ? profile.resume : `#${entry.target}`}
                  download={entry.kind === 'resume' ? 'Bharath_Bhat_Resume.pdf' : undefined}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={onClose}
                >
                  {resultContent}
                </a>
              )
            }
            return (
              <button
                key={entry.id}
                id={`command-result-${entry.id}`}
                ref={(element) => { resultRefs.current[index] = element }}
                className={resultClass}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  if (entry.kind === 'room' && entry.target) onOpenRoom(entry.target)
                  if (entry.kind === 'theme') onToggleTheme()
                  onClose()
                }}
              >
                {resultContent}
              </button>
            )
          })}
          {filtered.length === 0 && <p className="command-empty">No matches. Try a room, skill, or section.</p>}
        </div>
        <div className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> TO NAVIGATE</span><span><kbd>↵</kbd> TO SELECT</span><span>ESC TO CLOSE</span></div>
      </motion.div>
    </motion.div>
  )
}

function Calendar() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const interval = window.setInterval(() => setActive((current) => (current + 1) % profile.roles.length), 3600)
    return () => window.clearInterval(interval)
  }, [reduced])

  return (
    <div className="calendar" aria-label={`I build ${profile.roles[active]}`}>
      <div className="calendar-rings" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
      </div>
      <div className="calendar-pages" aria-hidden="true" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          className="calendar-page"
          initial={reduced ? false : { opacity: 0.65, rotateX: -78, rotate: -2 }}
          animate={{ opacity: 1, rotateX: 0, rotate: -2 }}
          exit={reduced ? undefined : { opacity: 0.65, rotateX: 78 }}
          transition={{ duration: 0.42, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ transformOrigin: 'top center' }}
        >
          <span className="calendar-label">CURRENTLY BUILDING</span>
          <p>I build</p>
          <div className="calendar-role">
            <motion.strong
              key={profile.roles[active]}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : 0.18 }}
            >
              {profile.roles[active]}
            </motion.strong>
          </div>
          <span className="calendar-page-number">{String(active + 1).padStart(2, '0')} / {String(profile.roles.length).padStart(2, '0')}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const pointerFrame = useRef(0)
  const magneticFrame = useRef(0)
  const reduced = useReducedMotion()

  useEffect(() => () => {
    window.cancelAnimationFrame(pointerFrame.current)
    window.cancelAnimationFrame(magneticFrame.current)
  }, [])

  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === 'touch') return
    const hero = heroRef.current
    if (!hero || pointerFrame.current) return
    const { clientX, clientY } = event
    pointerFrame.current = window.requestAnimationFrame(() => {
      pointerFrame.current = 0
      const bounds = hero.getBoundingClientRect()
      const x = clientX - bounds.left
      const y = clientY - bounds.top
      hero.style.setProperty('--hero-x', `${x}px`)
      hero.style.setProperty('--hero-y', `${y}px`)
      hero.style.setProperty('--object-x', `${((x / bounds.width) - 0.5) * -10}px`)
      hero.style.setProperty('--object-y', `${((y / bounds.height) - 0.5) * -8}px`)
    })
  }

  const resetSpotlight = () => {
    if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current)
    pointerFrame.current = 0
    heroRef.current?.style.setProperty('--object-x', '0px')
    heroRef.current?.style.setProperty('--object-y', '0px')
  }

  const moveMagneticButton = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType === 'touch' || magneticFrame.current) return
    const button = event.currentTarget
    const { clientX, clientY } = event
    magneticFrame.current = window.requestAnimationFrame(() => {
      magneticFrame.current = 0
      const bounds = button.getBoundingClientRect()
      button.style.setProperty('--magnet-x', `${(clientX - bounds.left - bounds.width / 2) * 0.12}px`)
      button.style.setProperty('--magnet-y', `${(clientY - bounds.top - bounds.height / 2) * 0.12}px`)
    })
  }

  const resetMagneticButton = (event: PointerEvent<HTMLAnchorElement>) => {
    window.cancelAnimationFrame(magneticFrame.current)
    magneticFrame.current = 0
    event.currentTarget.style.setProperty('--magnet-x', '0px')
    event.currentTarget.style.setProperty('--magnet-y', '0px')
  }

  return (
    <section ref={heroRef} id="top" className="hero-section" onPointerMove={moveSpotlight} onPointerLeave={resetSpotlight}>
      <svg className="hero-traces" viewBox="0 0 760 520" fill="none" aria-hidden="true">
        <path d="M470 44h104v76h80v67h62M530 270h97v-54h89M463 468h92v-77h92v-54h78M714 120v35h48M583 391v-42h-63" />
        <path d="M470 44h104v76h80v67h62M530 270h97v-54h89M463 468h92v-77h92v-54h78M714 120v35h48M583 391v-42h-63" className="hero-trace-pulse" />
        <circle cx="470" cy="44" r="4" /><circle cx="716" cy="187" r="4" /><circle cx="716" cy="216" r="4" /><circle cx="725" cy="337" r="4" /><circle cx="463" cy="468" r="4" />
      </svg>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-copy">
        <motion.p className="eyebrow" initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.12, duration: 0.7 }}>
          ECE STUDENT <span className="eyebrow-divider">/</span> MANGALURU, INDIA
        </motion.p>
        <motion.h1 aria-label="Bharath Bhat" initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.2, duration: 0.8 }}>
          <span className="hero-name-line" aria-hidden="true">{Array.from('Bharath').map((letter, index) => <span className="hero-glyph" style={{ '--letter-index': index } as CSSProperties} key={`${letter}-${index}`}>{letter}</span>)}</span>
          <br />
          <span className="hero-name-line" aria-hidden="true">{Array.from('Bhat').map((letter, index) => <span className="hero-glyph" style={{ '--letter-index': index + 7 } as CSSProperties} key={`${letter}-${index}`}>{letter}</span>)}<span className="hero-period">.</span></span>
        </motion.h1>
        <motion.p className="hero-position" initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.34, duration: 0.7 }}>
          {profile.positioning}
        </motion.p>
        <motion.div className="hero-bottom" initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.48, duration: 0.7 }}>
          <a
            href="#doors"
            className="hero-cta"
            onPointerMove={moveMagneticButton}
            onPointerLeave={resetMagneticButton}
          >Walk through my work <ArrowDown size={15} /></a>
          <p>One portfolio.<br />Four rooms to explore.</p>
        </motion.div>
      </div>
      <motion.div
        className="hero-object"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="hero-coordinate">MANGALURU&nbsp; / &nbsp; INDIA</div>
        <PortraitSlot />
        <Calendar />
        <span className="object-caption">A LITTLE ABOUT WHAT I BUILD</span>
      </motion.div>
      <span className="hero-index">SCROLL TO EXPLORE <span>↓</span></span>
    </section>
  )
}

function ExpertiseRibbon() {
  const items = [...profile.roles, ...profile.roles]

  return (
    <div className="expertise-ribbon" role="group" aria-label={`Areas of interest: ${profile.roles.join(', ')}`}>
      <span className="ribbon-label">AREAS OF INTEREST <span>↘</span></span>
      <div className="ribbon-track" aria-hidden="true">
        <div className="ribbon-content">
          {items.map((role, index) => (
            <span className="ribbon-item" key={`${role}-${index}`}>
              <span className="ribbon-star">✳</span>{role}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const signalModes = [
  { name: 'CLOCK', value: '01.2 MHz', detail: 'A steady clock through the core.' },
  { name: 'DATA', value: '1010 1101', detail: 'A data packet moving across the bus.' },
  { name: 'RESET', value: 'READY', detail: 'The system is ready for another cycle.' },
]

function SignalLab() {
  const [mode, setMode] = useState(signalModes[0])
  const [pulseCount, setPulseCount] = useState(0)
  const [running, setRunning] = useState(false)
  const pulseTimer = useRef<number | undefined>(undefined)
  const reduced = useReducedMotion()

  useEffect(() => () => window.clearTimeout(pulseTimer.current), [])

  const tiltStage = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    event.currentTarget.style.setProperty('--stage-tilt-x', `${(0.5 - y) * 8}deg`)
    event.currentTarget.style.setProperty('--stage-tilt-y', `${(x - 0.5) * 10}deg`)
  }

  const resetStage = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--stage-tilt-x', '0deg')
    event.currentTarget.style.setProperty('--stage-tilt-y', '0deg')
  }

  const sendPulse = () => {
    window.clearTimeout(pulseTimer.current)
    setPulseCount((count) => count + 1)
    setRunning(true)
    pulseTimer.current = window.setTimeout(() => setRunning(false), 1600)
  }

  return (
    <motion.section
      id="signal-lab"
      className="signal-lab"
      aria-labelledby="signal-lab-title"
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65 }}
    >
      <div className="signal-copy">
        <span className="signal-kicker"><span /> INTERACTIVE STUDY / 01</span>
        <h2 id="signal-lab-title">A little signal.<br /><em>A lot in motion.</em></h2>
        <p>Turn the chip, choose a signal, and send a pulse through this tiny 3D circuit study.</p>
        <div className="signal-modes" role="group" aria-label="Choose a signal type">
          {signalModes.map((item) => (
            <button
              type="button"
              key={item.name}
              className={mode.name === item.name ? 'signal-mode signal-mode-active' : 'signal-mode'}
              aria-pressed={mode.name === item.name}
              onClick={() => {
                setMode(item)
                setRunning(false)
                window.clearTimeout(pulseTimer.current)
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <button className="signal-trigger" type="button" onClick={sendPulse}>
          <Zap size={15} /> SEND A PULSE <span>↗</span>
        </button>
        <div className="signal-readout" aria-live="polite">
          <Activity size={15} />
          <span>
            <strong>{running ? 'SIGNAL IN TRANSIT' : mode.value}</strong>
            <small>{running ? `${mode.name} · PULSE ${String(pulseCount).padStart(2, '0')}` : mode.detail}</small>
          </span>
        </div>
      </div>
      <div
        className={`signal-stage ${running ? 'signal-stage-active' : ''}`}
        onPointerMove={tiltStage}
        onPointerLeave={resetStage}
        role="img"
        aria-label={`Interactive three-dimensional circuit illustration. ${mode.name} signal mode selected.`}
      >
        <div className="signal-stage-grid" aria-hidden="true" />
        <div className="signal-orbit signal-orbit-one" aria-hidden="true"><i /></div>
        <div className="signal-orbit signal-orbit-two" aria-hidden="true"><i /></div>
        <svg className="signal-traces" viewBox="0 0 480 390" fill="none" aria-hidden="true">
          <path d="M25 181h90l32 32h58m160-32h90l-32 32h-58M90 73v58l38 38m224-96v58l-38 38M93 305v-57l35-35m224 92v-57l-38-35" />
          <path d="M26 181h90l32 32h58m160-32h90l-32 32h-58M90 73v58l38 38m224-96v58l-38 38M93 305v-57l35-35m224 92v-57l-38-35" className="signal-current" />
          <circle cx="25" cy="181" r="4" /><circle cx="455" cy="181" r="4" /><circle cx="90" cy="73" r="4" /><circle cx="390" cy="73" r="4" /><circle cx="93" cy="305" r="4" /><circle cx="387" cy="305" r="4" />
        </svg>
        <div className="signal-chip-wrap">
          <div className="signal-chip-shadow" />
          <div className="signal-chip">
            <div className="signal-chip-top">
              <span className="chip-emblem"><Cpu size={24} /></span>
              <span>BB / 01</span>
              <strong>CORE</strong>
              <small>ECE · SYSTEMS</small>
            </div>
          </div>
        </div>
        <span className="signal-stage-label signal-label-left">INPUT <i>03.3V</i></span>
        <span className="signal-stage-label signal-label-right">OUTPUT <i>{running ? 'ACTIVE' : 'READY'}</i></span>
        <span className="signal-stage-index">FIG 01 — SIGNAL PATH</span>
      </div>
    </motion.section>
  )
}

function SectionHeading({ index, title, lead }: { index: string; title: string; lead: string }) {
  return (
    <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
      <span className="section-index">{index} <span>—</span> {title.toUpperCase()}</span>
      <h2>{title}</h2>
      <p>{lead}</p>
    </motion.div>
  )
}

function DoorCard({ door, index, onOpen }: { door: Door; index: number; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [opening, setOpening] = useState(false)
  const reduced = useReducedMotion()
  const openRoom = () => {
    if (opening) return
    setHovered(true)
    setOpening(true)
    window.setTimeout(onOpen, reduced ? 0 : 420)
  }

  return (
    <motion.button
      type="button"
      className={`door-card ${hovered ? 'door-card-hovered' : ''}`}
      style={{ '--door-color': door.color } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={openRoom}
      whileHover={reduced ? undefined : { y: -6 }}
      initial={reduced ? false : { opacity: 0, y: 28, rotateY: 3 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.62, delay: reduced ? 0 : index * 0.09, ease: [0.2, 0.7, 0.2, 1] }}
      aria-label={`Open ${door.title} room`}
      aria-keyshortcuts={`${index + 1}`}
    >
      <span className="door-topline"><span>ROOM {door.number}</span><ArrowUpRight size={15} /></span>
      <span className="door-architecture">
        <span className="door-frame">
          <motion.span
            className="door-leaf"
            animate={{ rotateY: opening && !reduced ? -88 : hovered && !reduced ? -34 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="door-inset" />
            <motion.span
              className="door-knob"
              animate={{ rotate: opening && !reduced ? 34 : 0, y: opening && !reduced ? 6 : '-50%' }}
              transition={{ duration: 0.22 }}
            >
              <span />
            </motion.span>
          </motion.span>
          <span className="door-glow" />
        </span>
      </span>
      <span className="door-title">{door.title}</span>
      <span className="door-description">{hovered ? door.description : door.short}</span>
      <span className="door-open-cue"><DoorOpen size={15} /> ENTER ROOM <span>↗</span></span>
      <span className="door-ground" aria-hidden="true" />
      <span className="sr-only">Door {index + 1} of {doors.length}</span>
    </motion.button>
  )
}

function DoorWall({ onOpen }: { onOpen: (id: string) => void }) {
  const wallRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  const scrollWall = (direction: number) => wallRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' })

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    }
  }
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    if (!(event.buttons & 1)) {
      drag.current.active = false
      return
    }
    const distance = event.clientX - drag.current.startX
    if (Math.abs(distance) > 5) drag.current.moved = true
    if (drag.current.moved) event.currentTarget.scrollLeft = drag.current.scrollLeft - distance
  }
  const handlePointerUp = () => {
    drag.current.active = false
  }
  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!drag.current.moved) return
    event.preventDefault()
    event.stopPropagation()
    drag.current.moved = false
  }

  const handleKeys = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollWall(event.key === 'ArrowRight' ? 1 : -1)
    }
  }

  return (
    <section id="doors" className="doors-section">
      <div className="doors-intro">
        <SectionHeading index="01" title="The wall of doors" lead="Each room opens onto a different part of my work. Pick a door and step inside." />
        <div className="wall-controls">
          <span>DRAG · ARROWS · KEYS 1–4</span>
          <button type="button" aria-label="Scroll doors left" onClick={() => scrollWall(-1)}><ArrowLeft size={17} /></button>
          <button type="button" aria-label="Scroll doors right" onClick={() => scrollWall(1)}><ArrowRight size={17} /></button>
        </div>
      </div>
      <div className="door-wall-wrap">
        <div
          className="door-wall"
          ref={wallRef}
          tabIndex={0}
          aria-label="Explore the four portfolio rooms"
          onKeyDown={handleKeys}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClickCapture={handleClickCapture}
        >
          {doors.map((door, index) => <DoorCard key={door.id} door={door} index={index} onOpen={() => onOpen(door.id)} />)}
        </div>
        <div className="wall-floor" aria-hidden="true" />
      </div>
      <p className="wall-hint">HOVER TO TAKE A LOOK <span>·</span> CLICK OR PRESS 1–4 TO ENTER</p>
    </section>
  )
}

function SchematicPlaceholder({ project }: { project: Project }) {
  const reduced = useReducedMotion()
  const movePreview = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    event.currentTarget.style.setProperty('--preview-x', `${x * 100}%`)
    event.currentTarget.style.setProperty('--preview-y', `${y * 100}%`)
    event.currentTarget.style.setProperty('--preview-rotate-x', `${(0.5 - y) * 5}deg`)
    event.currentTarget.style.setProperty('--preview-rotate-y', `${(x - 0.5) * 7}deg`)
  }
  const resetPreview = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--preview-rotate-x', '0deg')
    event.currentTarget.style.setProperty('--preview-rotate-y', '0deg')
  }

  return (
    <div className="device-stage" role="img" aria-label={`Replaceable project image slot for ${project.title}. Add public/projects/${project.slug}.jpg.`}>
      <div className="device-monitor" onPointerMove={movePreview} onPointerLeave={resetPreview}>
        <div className="device-screen">
          <svg className="schematic" viewBox="0 0 360 200" fill="none" aria-hidden="true">
            <path d="M25 42H110V82H168M168 82V42H276M168 82V145H315M55 150H110V115H168" />
            <path d="M275 42V80H320M50 42V82H25M277 145V118H320" />
            <circle cx="110" cy="82" r="5" /><circle cx="168" cy="82" r="6" />
            <circle cx="110" cy="115" r="5" /><circle cx="276" cy="42" r="5" />
            <rect x="135" y="58" width="65" height="48" rx="4" />
            <text x="167" y="86" textAnchor="middle">IMAGE SLOT</text>
            <text x="180" y="178" textAnchor="middle">ADD YOUR PROJECT IMAGE OR VIDEO</text>
          </svg>
          <span className="slot-path">public/projects/{project.slug}.jpg</span>
        </div>
        <span className="monitor-neck" />
        <span className="monitor-foot" />
      </div>
      <span className="device-caption">REPLACEABLE MEDIA SLOT <span>/{project.icon}</span></span>
    </div>
  )
}

function ProjectCard({ project, index, accent }: { project: Project; index: number; accent: string }) {
  const reduced = useReducedMotion()
  const pointerFrame = useRef(0)

  useEffect(() => () => window.cancelAnimationFrame(pointerFrame.current), [])

  return (
    <motion.article
      className="room-project"
      style={{ '--project-index': index, '--door-color': accent } as CSSProperties}
      initial={reduced ? false : { opacity: 0, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay: reduced ? 0 : index * 0.08 }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType === 'touch' || pointerFrame.current) return
        const card = event.currentTarget
        const { clientX, clientY } = event
        pointerFrame.current = window.requestAnimationFrame(() => {
          pointerFrame.current = 0
          const bounds = card.getBoundingClientRect()
          const x = (clientX - bounds.left) / bounds.width
          const y = (clientY - bounds.top) / bounds.height
          card.style.setProperty('--project-glow-x', `${x * 100}%`)
          card.style.setProperty('--project-glow-y', `${y * 100}%`)
          card.style.setProperty('--project-tilt-x', `${(0.5 - y) * 3}deg`)
          card.style.setProperty('--project-tilt-y', `${(x - 0.5) * 4}deg`)
        })
      }}
      onPointerLeave={(event) => {
        window.cancelAnimationFrame(pointerFrame.current)
        pointerFrame.current = 0
        event.currentTarget.style.setProperty('--project-tilt-x', '0deg')
        event.currentTarget.style.setProperty('--project-tilt-y', '0deg')
      }}
    >
      <div className="project-card-meta"><span>PROJECT / {project.icon}</span><span>0{index + 1}</span></div>
      <SchematicPlaceholder project={project} />
      <div className="room-project-copy">
        <span className="project-kicker">SELECTED PROJECT</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <span className="project-outcome"><strong>BUILD NOTE /</strong> {project.outcome}</span>
      </div>
    </motion.article>
  )
}

function Room({
  doorId,
  onClose,
  scrollToRoom,
}: {
  doorId: string
  onClose: () => void
  scrollToRoom: (element: HTMLElement) => void
}) {
  const reduced = useReducedMotion()
  const door = doors.find((item) => item.id === doorId)
  const roomProjects = projects.filter((project) => project.room === doorId)
  const roomCertifications = door?.certifications
    ? certifications.filter((certification) => door.certifications?.includes(certification.name))
    : []

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const room = document.querySelector<HTMLElement>('.room-view')
      if (room) scrollToRoom(room)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [doorId, scrollToRoom])

  if (!door) return null

  return (
    <motion.section
      key={door.id}
      className="room-view"
      style={{ '--door-color': door.color } as CSSProperties}
      initial={reduced ? false : { opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 18 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      aria-labelledby="room-title"
    >
      <div className="room-heading">
        <button className="room-back" type="button" onClick={onClose}><ArrowLeft size={15} /> BACK TO THE WALL</button>
        <span className="section-index">ROOM {door.number} <span>—</span> FIELD NOTES</span>
        <h2 id="room-title">{door.title}</h2>
        <p>{door.description}</p>
      </div>
      {roomProjects.length > 0 && (
        <div className="room-stack">
          <p className="room-stack-label">SELECTED WORK <span>({String(roomProjects.length).padStart(2, '0')})</span></p>
          {roomProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} accent={door.color} />
          ))}
        </div>
      )}
      {door.skills.length > 0 && (
        <div className="room-skill-row">
          <span>IN THIS ROOM</span>
          <div>{door.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
      )}
      {roomCertifications.length > 0 && (
        <div className="room-cert-row">
          <span>RELATED CERTIFICATIONS</span>
          {roomCertifications.map((certification) => <p key={certification.name}>{certification.name} <i>{certification.issuer}</i></p>)}
        </div>
      )}
      {doorId === 'hardware' && (
        <div className="room-internship">
          <span>INTERNSHIP · {internship.duration.toUpperCase()}</span>
          <h3>{internship.organization}</h3>
          <p>{internship.description}</p>
        </div>
      )}
      {roomProjects.length === 0 && (
        <div className="room-empty-note">
          <p>Skills and related learning</p>
          <div>{door.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          {roomCertifications.map((certification) => <p key={certification.name}>{certification.name} · {certification.issuer}</p>)}
        </div>
      )}
      <button className="room-back room-bottom-back" type="button" onClick={onClose}><ArrowLeft size={15} /> RETURN TO ALL FOUR DOORS</button>
    </motion.section>
  )
}

function NumbersBoard() {
  const reduced = useReducedMotion()

  return (
    <section className="numbers-section" aria-label="Portfolio facts">
      <div className="numbers-heading">
        <span className="section-index">A FEW TRUE THINGS</span>
        <p>Just the facts<br />from my resume.</p>
      </div>
      <div className="numbers-board">
        {facts.map((fact) => (
          <motion.div
            className="number-cell"
            key={fact.label}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.48, delay: reduced ? 0 : facts.indexOf(fact) * 0.09 }}
          >
            <span className="number-label">{fact.label}</span>
            <span className="flap-number" aria-label={`${fact.value} ${fact.label}`}>
              {fact.value.split('').map((character, index) => <span key={`${fact.label}-${index}`} className="flap-character">{character}</span>)}
            </span>
            <span className="number-detail">{fact.detail}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Timeline() {
  const [activeYear, setActiveYear] = useState('2028')
  const latestRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const targets = [
      { node: latestRef.current, year: '2028' },
      { node: startRef.current, year: '2024' },
    ].filter((target): target is { node: HTMLDivElement; year: string } => target.node !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        const match = targets.find((target) => target.node === visible?.target)
        if (match) setActiveYear(match.year)
      },
      { rootMargin: '-35% 0px -50% 0px' },
    )
    targets.forEach((target) => observer.observe(target.node))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="story" className="story-section">
      <SectionHeading index="02" title="The story so far" lead="A short rewind through the dated chapters, then a stop at the moments without a date." />
      <div className="story-layout">
        <div className="story-odometer" aria-label={`Current timeline year ${activeYear}`}>
          <span>YEAR / REWIND</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.strong
              key={activeYear}
              initial={reduced ? false : { y: -28, opacity: 0, rotateX: 60 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={reduced ? undefined : { y: 24, opacity: 0, rotateX: -50 }}
            >
              {activeYear}
            </motion.strong>
          </AnimatePresence>
          <small>ROLLING BACKWARDS</small>
        </div>
        <div className="story-chapters">
          <motion.article
            className="story-chapter"
            ref={latestRef}
            initial={reduced ? false : { opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.58 }}
          >
            <span className="chapter-marker"><span /></span>
            <span className="chapter-date">EXPECTED · JUN 2028</span>
            <h3>Looking ahead</h3>
            <p>B.E. Electronics and Communication Engineering at AJ Institute of Engineering and Technology, Mangaluru.</p>
            <span className="chapter-foot">CGPA 8.2 / 10</span>
          </motion.article>
          <motion.article
            className="story-chapter"
            ref={startRef}
            initial={reduced ? false : { opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.58, delay: reduced ? 0 : 0.12 }}
          >
            <span className="chapter-marker"><span /></span>
            <span className="chapter-date">SEP 2024</span>
            <h3>Where it began</h3>
            <p>Started B.E. Electronics and Communication Engineering at AJIET, Mangaluru.</p>
          </motion.article>
          <motion.div
            className="story-undated"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.58 }}
          >
            <span>UNDATED CHAPTER</span>
            <h3>Learning by doing</h3>
            <article><span>INTERNSHIP · {internship.duration.toUpperCase()}</span><p>{internship.organization} — {internship.description}</p></article>
            {awards.map((award) => <article key={award.title}><span>RECOGNITION</span><p>{award.title}, {award.detail}</p></article>)}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Toolbox() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('Verilog HDL')
  const [pressed, setPressed] = useState('')
  const allSkills = useMemo(() => skillGroups.flatMap((group) => group.skills), [])
  const visibleSkills = allSkills.filter((skill) => skill.toLowerCase().includes(query.trim().toLowerCase()))
  const reduced = useReducedMotion()

  useEffect(() => {
    const listen = (event: globalThis.KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return
      if ((event.target as HTMLElement).matches('input, textarea, [contenteditable="true"]')) return
      const character = event.key.toLowerCase()
      setPressed(character)
      const match = allSkills.find((skill) => skill.toLowerCase().includes(character))
      if (match) setSelected(match)
      window.setTimeout(() => setPressed(''), 350)
    }
    window.addEventListener('keydown', listen)
    return () => window.removeEventListener('keydown', listen)
  }, [allSkills])

  return (
    <section id="toolbox" className="toolbox-section">
      <SectionHeading index="03" title="The toolbox" lead="An index of the skills in my resume. Type to search, or choose a key to learn where it appears." />
      <div className="toolbox-layout">
        <div className="toolbox-device">
          <div className="toolbox-device-top"><span>BHARATH'S TOOLBOX</span><span>● ● ●</span></div>
          <label className="tool-search">
            <span className="sr-only">Search skills</span>
            <span className="search-prefix">&gt;_</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a skill..." />
            <span className="search-shortcut">⌕</span>
          </label>
          <motion.div
            className="tool-grid"
            aria-label="Skills keyboard"
            initial={reduced ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.025 } } }}
          >
            {visibleSkills.map((skill, index) => (
              <motion.button
                type="button"
                key={`${skill}-${index}`}
                title={tooltips[skill]}
                className={`tool-key ${selected === skill ? 'tool-key-selected' : ''} ${pressed && skill.toLowerCase().includes(pressed) ? 'tool-key-pressed' : ''}`}
                onClick={() => setSelected(skill)}
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              >
                <span className="tool-app-icon" aria-hidden="true">{skill.slice(0, 1)}</span>
                <span>{skill}</span><span className="key-corner">↗</span>
              </motion.button>
            ))}
            {visibleSkills.length === 0 && <p className="no-tools">No matching skills in the list.</p>}
          </motion.div>
          <div className="toolbox-status"><span className="live-dot" /> KEYBOARD READY <span>/{allSkills.length} SKILLS</span></div>
        </div>
        <div className="tool-detail">
          <span>SELECTED SKILL</span>
          <motion.h3 key={selected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{selected}</motion.h3>
          <p>{tooltips[selected]}</p>
          <div className="tool-detail-hint"><span>↳</span> Type on your keyboard or tap a key.</div>
        </div>
      </div>
    </section>
  )
}

function CertificationCard({ certification, index }: { certification: (typeof certifications)[number]; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const reduced = useReducedMotion()
  const updateSheen = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--sheen-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
    event.currentTarget.style.setProperty('--sheen-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
  }

  return (
    <motion.button
      type="button"
      className={`cert-card ${flipped ? 'cert-card-flipped' : ''}`}
      onPointerMove={updateSheen}
      onClick={() => {
        if (!reduced) setFlipped((value) => !value)
      }}
      initial={reduced ? false : { opacity: 0, y: 20, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.58, delay: reduced ? 0 : index * 0.07 }}
      aria-label={`${certification.name}, ${certification.issuer}${certification.badge ? `, ${certification.badge}` : ''}. Click to flip.`}
      whileHover={reduced ? undefined : { y: -5 }}
      style={{ '--card-index': index } as CSSProperties}
    >
      <span className={`cert-card-inner ${flipped && !reduced ? 'is-flipped' : ''}`}>
        <span className="cert-face cert-front">
          <span className="cert-index">CERTIFICATE / {String(index + 1).padStart(2, '0')}</span>
          <span className="cert-emblem">{index === 0 ? <Award size={23} /> : <GraduationCap size={23} />}</span>
          <strong>{certification.name}</strong>
          <span className="cert-issuer">{certification.issuer}</span>
          {certification.badge && <span className="elite-badge"><Check size={12} /> {certification.badge}</span>}
          <span className="cert-flip-hint">TAP TO FLIP <ArrowUpRight size={13} /></span>
        </span>
        <span className="cert-face cert-back">
          <span>ISSUED BY</span>
          <strong>{certification.issuer}</strong>
          <p>{certification.name}</p>
          {certification.badge && <span className="elite-badge"><Check size={12} /> {certification.badge}</span>}
          <span className="cert-flip-hint">TAP TO RETURN</span>
        </span>
      </span>
    </motion.button>
  )
}

function Learning() {
  return (
    <section id="learning" className="learning-section">
      <div className="learning-heading">
        <SectionHeading index="04" title="Learning in progress" lead="Education and certifications, as listed in my resume." />
      </div>
      <div className="education-list">
        {education.map((item, index) => (
          <motion.article key={item.school} className="education-item" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="education-index">0{index + 1}</span>
            <div><h3>{item.school}</h3><p>{item.detail}</p></div>
            <div className="education-score"><strong>{item.score}</strong>{item.start && <span>{item.start} — {item.end}</span>}</div>
          </motion.article>
        ))}
      </div>
      <div className="certifications-heading">
        <div><span className="section-index">CREDENTIALS / 06</span><h3>Certificates</h3></div>
        <p>Move across a card for the light.<br />Click or tap to turn it over.</p>
      </div>
      <div className="certifications-grid">
        {certifications.map((certification, index) => <CertificationCard key={certification.name} certification={certification} index={index} />)}
      </div>
    </section>
  )
}

function ContactSection() {
  const reduced = useReducedMotion()
  const [copyStatus, setCopyStatus] = useState('')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyStatus('Email copied to clipboard.')
    } catch {
      setCopyStatus('Could not copy automatically. Use the email link above.')
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const values = new FormData(form)
    const name = String(values.get('name') ?? '')
    const email = String(values.get('email') ?? '')
    const message = String(values.get('message') ?? '')
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <footer id="contact" className="closing-section">
      <div className="closing-top">
        <div>
          <span className="section-index">05 — SAY HELLO</span>
          <h2>Every good<br />build starts<br /><em>somewhere.</em></h2>
          <p className="closing-summary">{profile.summary}</p>
          <a href={`mailto:${profile.email}`} className="closing-email">{profile.email} <ArrowUpRight size={18} /></a>
          <button className="copy-email" type="button" onClick={copyEmail}><Copy size={14} /> COPY EMAIL</button>
          <span className="copy-email-status" aria-live="polite">{copyStatus}</span>
          <div className="contact-details">
            <span><MapPin size={14} /> {profile.location}</span>
            <a href={`tel:${profile.phone}`}><Phone size={14} /> {profile.phone}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><ArrowUpRight size={14} /> LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>
          </div>
          <a className="closing-resume" href={profile.resume} download="Bharath_Bhat_Resume.pdf"><Download size={15} /> Download resume</a>
        </div>
        <motion.form
          className="contact-form"
          onSubmit={submit}
          initial={reduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.62 }}
        >
          <span>OR SEND A NOTE</span>
          <label>Your name<input name="name" autoComplete="name" placeholder="Name" required /></label>
          <label>Your email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Your message<textarea name="message" rows={4} placeholder="What would you like to talk about?" required /></label>
          <button type="submit"><Mail size={15} /> OPEN A PREFILLED EMAIL <ArrowUpRight size={14} /></button>
          <small>This opens your email app; nothing is sent from this website.</small>
        </motion.form>
      </div>
      <div className="footer-bottom">
        <a href="#top">BB. <span>BACK TO THE BEGINNING ↑</span></a>
        <span>© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
        <span>{useLocalTime() || '--:--'} IST</span>
      </div>
    </footer>
  )
}

function BackToTop() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <a className="back-to-top" href="#top" aria-label={`Back to top. Page ${Math.round(progress * 100)} percent scrolled.`} style={{ '--scroll-progress': progress, '--scroll-angle': `${progress * 360}deg` } as CSSProperties}>
      <ArrowUp size={17} />
    </a>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeDoor, setActiveDoor] = useState<string | null>(null)
  const [dark, setDark] = useState(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme')
    if (savedTheme === 'dark') return true
    if (savedTheme === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [commandOpen, setCommandOpen] = useState(false)
  const activeDoorRef = useRef(activeDoor)
  const lenisRef = useRef<Lenis | null>(null)
  activeDoorRef.current = activeDoor
  const onLoaderComplete = useCallback(() => setLoading(false), [])
  const reduced = useReducedMotion()

  const toggleTheme = useCallback(() => {
    const next = !dark
    window.localStorage.setItem('portfolio-theme', next ? 'dark' : 'light')
    setDark(next)
  }, [dark])
  const openCommandPalette = useCallback(() => setCommandOpen(true), [])

  useEffect(() => {
    const themeColor = document.querySelector<HTMLMetaElement>('#theme-color')
    if (themeColor) themeColor.content = dark ? '#171816' : '#f4f1e9'
  }, [dark])

  useEffect(() => {
    const handleCommandShortcut = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', handleCommandShortcut)
    return () => window.removeEventListener('keydown', handleCommandShortcut)
  }, [])

  useEffect(() => {
    if (loading) return
    const lenis = reduced ? null : new Lenis({ duration: 1.05, smoothWheel: true })
    lenisRef.current = lenis
    let lenisFrame = 0
    let navigationFrame = 0
    const tick = (time: number) => {
      lenis?.raf(time)
      if (lenis) lenisFrame = window.requestAnimationFrame(tick)
    }
    if (lenis) lenisFrame = window.requestAnimationFrame(tick)
    const handleAnchorClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')?.slice(1)
      const target = id ? document.getElementById(id) : null
      if (id === 'doors' && activeDoorRef.current) {
        event.preventDefault()
        setActiveDoor(null)
        let attempts = 0
        const scrollWhenMounted = () => {
          const wall = document.getElementById('doors')
          if (wall) {
            wall.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
            window.history.replaceState(null, '', '#doors')
            return
          }
          if (attempts < 60) {
            attempts += 1
            navigationFrame = window.requestAnimationFrame(scrollWhenMounted)
          }
        }
        navigationFrame = window.requestAnimationFrame(scrollWhenMounted)
        return
      }
      if (!target || reduced || !lenis) return
      event.preventDefault()
      lenis.scrollTo(target, { offset: 0 })
      window.history.replaceState(null, '', `#${id}`)
    }
    document.addEventListener('click', handleAnchorClick)
    return () => {
      window.cancelAnimationFrame(lenisFrame)
      window.cancelAnimationFrame(navigationFrame)
      document.removeEventListener('click', handleAnchorClick)
      lenis?.destroy()
      lenisRef.current = null
    }
  }, [loading, reduced, setActiveDoor])

  useEffect(() => {
    const handleRoomShortcuts = (event: globalThis.KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return
      const target = event.target
      if (target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')) return

      if (event.key === 'Escape' && activeDoorRef.current) {
        event.preventDefault()
        setActiveDoor(null)
        return
      }

      if (activeDoorRef.current || !['1', '2', '3', '4'].includes(event.key)) return
      setActiveDoor(doors[Number(event.key) - 1].id)
    }

    window.addEventListener('keydown', handleRoomShortcuts)
    return () => window.removeEventListener('keydown', handleRoomShortcuts)
  }, [setActiveDoor])

  const scrollToRoom = useCallback((element: HTMLElement) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(element, { offset: 0 })
    } else {
      element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }
  }, [reduced])

  const handlePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!dark) return
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY}px`)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`site-shell ${dark ? 'dark' : ''}`} onPointerMove={handlePointer}>
        <AnimatePresence>{loading && <IntroLoader onComplete={onLoaderComplete} />}</AnimatePresence>
        {!loading && (
          <>
            <Header dark={dark} onThemeToggle={toggleTheme} onCommandOpen={openCommandPalette} />
            <PullCord dark={dark} onToggle={toggleTheme} />
            <AnimatePresence>
              {commandOpen && (
                <CommandPalette
                  onClose={() => setCommandOpen(false)}
                  onOpenRoom={setActiveDoor}
                  onToggleTheme={toggleTheme}
                />
              )}
            </AnimatePresence>
            <main>
              <Hero />
              <ExpertiseRibbon />
              <SignalLab />
              <AnimatePresence mode="wait">
                {activeDoor ? (
                  <Room key={activeDoor} doorId={activeDoor} onClose={() => setActiveDoor(null)} scrollToRoom={scrollToRoom} />
                ) : (
                  <DoorWall key="wall" onOpen={setActiveDoor} />
                )}
              </AnimatePresence>
              <NumbersBoard />
              <Timeline />
              <Toolbox />
              <Learning />
            </main>
            <ContactSection />
            <BackToTop />
          </>
        )}
      </div>
    </MotionConfig>
  )
}
