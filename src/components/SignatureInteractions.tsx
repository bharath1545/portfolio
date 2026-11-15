import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { doors, profile } from '../data/content'

type LoaderProps = { onComplete: () => void }

export function IntroLoader({ onComplete }: LoaderProps) {
  const startedAt = useRef(0)
  const [departing, setDeparting] = useState(false)
  const skipExit =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) {
      onComplete()
      return
    }

    startedAt.current = performance.now()
    let completion: number | undefined
    const timer = window.setInterval(() => {
      const progress = Math.min(Math.floor(((performance.now() - startedAt.current) / 1000) * 100), 100)
      const bar = document.querySelector<HTMLElement>('[data-loader-progress]')
      const number = document.querySelector<HTMLElement>('[data-loader-number]')
      if (bar) bar.style.width = `${progress}%`
      if (number) number.textContent = String(progress).padStart(3, '0')
      if (progress === 100) {
        window.clearInterval(timer)
        setDeparting(true)
        completion = window.setTimeout(onComplete, 200)
      }
    }, 32)
    const handleVisibility = () => {
      if (!document.hidden) return
      window.clearInterval(timer)
      if (completion !== undefined) window.clearTimeout(completion)
      onComplete()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.clearInterval(timer)
      if (completion !== undefined) window.clearTimeout(completion)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [onComplete])

  return (
    <motion.div
      className="intro-loader"
      exit={skipExit ? { opacity: 0 } : { y: '-100%' }}
      transition={{ duration: skipExit ? 0 : 0.8, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Loading portfolio"
    >
      <div className="loader-inner">
        <div className="loader-pills" aria-hidden="true">
          {doors.map((door, index) => (
            <motion.span
              key={door.id}
              className="loader-pill"
              style={{ backgroundColor: door.color }}
              animate={{ opacity: departing ? 0 : 1, x: departing ? (index - 1.5) * 55 : 0, y: departing ? (index % 2) * 16 : 0, rotateX: departing ? (index - 1.5) * 12 : 0 }}
              initial={{ opacity: 0, y: -70, rotateX: 75 }}
              transition={{ delay: departing ? 0 : index * 0.12, type: 'spring', stiffness: 140, damping: 16 }}
            >
              {door.number}
            </motion.span>
          ))}
        </div>
        <p className="loader-wordmark">BHARATH BHAT</p>
        <div className="loader-count">
          <span>PORTFOLIO / 2026</span>
          <span data-loader-number>000</span>
        </div>
        <div className="loader-track"><span data-loader-progress /></div>
      </div>
    </motion.div>
  )
}

type CordProps = { dark: boolean; onToggle: () => void }

type Point = { x: number; y: number; px: number; py: number }

export function PullCord({ dark, onToggle }: CordProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const toggleRef = useRef(onToggle)
  const toggledInPull = useRef(false)

  useEffect(() => {
    toggleRef.current = onToggle
  }, [onToggle])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const count = 17
    const segmentLength = 13
    const points: Point[] = Array.from({ length: count }, (_, index) => ({
      x: 42,
      y: 5 + index * segmentLength,
      px: 42,
      py: 5 + index * segmentLength,
    }))
    let width = 84
    let height = 265
    let frame = 0
    let grabbed = -1
    let visible = true

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.beginPath()
      context.moveTo(points[0].x, points[0].y)
      for (let index = 1; index < points.length - 1; index += 1) {
        const point = points[index]
        const next = points[index + 1]
        context.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2)
      }
      const end = points[points.length - 1]
      context.lineTo(end.x, end.y)
      context.strokeStyle = dark ? 'rgba(248, 242, 228, .8)' : 'rgba(44, 43, 40, .72)'
      context.lineWidth = 2
      context.stroke()
      context.beginPath()
      context.arc(end.x, end.y + 13, 9, 0, Math.PI * 2)
      context.fillStyle = dark ? '#e5c27b' : '#cf593e'
      context.fill()
      context.beginPath()
      context.arc(end.x, end.y + 13, 2.5, 0, Math.PI * 2)
      context.fillStyle = '#fff8e9'
      context.fill()
    }

    const integrate = () => {
      if (!visible) return
      if (!reduced) {
        for (let index = 1; index < points.length; index += 1) {
          const point = points[index]
          if (index === grabbed) continue
          const vx = (point.x - point.px) * 0.985
          const vy = (point.y - point.py) * 0.985
          point.px = point.x
          point.py = point.y
          point.x += vx
          point.y += vy + 0.36
        }

        for (let iteration = 0; iteration < 5; iteration += 1) {
          points[0].x = 42
          points[0].y = 5
          for (let index = 0; index < points.length - 1; index += 1) {
            const point = points[index]
            const next = points[index + 1]
            const dx = next.x - point.x
            const dy = next.y - point.y
            const distance = Math.hypot(dx, dy) || 1
            const correction = (distance - segmentLength) / distance
            if (index !== 0 && index !== grabbed) {
              point.x += dx * correction * 0.5
              point.y += dy * correction * 0.5
            }
            if (index + 1 !== grabbed) {
              next.x -= dx * correction * 0.5
              next.y -= dy * correction * 0.5
            }
          }
        }
      }
      draw()
      frame = window.requestAnimationFrame(integrate)
    }

    const position = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    }
    const down = (event: PointerEvent) => {
      if (reduced) return
      const cursor = position(event)
      let nearest = 0
      let nearestDistance = Infinity
      points.forEach((point, index) => {
        const distance = Math.hypot(point.x - cursor.x, point.y + 13 - cursor.y)
        if (distance < nearestDistance) {
          nearest = index
          nearestDistance = distance
        }
      })
      if (nearestDistance > 30) return
      grabbed = Math.max(1, nearest)
      toggledInPull.current = false
      canvas.setPointerCapture(event.pointerId)
      event.preventDefault()
    }
    const move = (event: PointerEvent) => {
      if (grabbed < 0) return
      const cursor = position(event)
      const point = points[grabbed]
      point.x = Math.max(8, Math.min(width - 8, cursor.x))
      point.y = cursor.y - 13
      if (point.y > height - 13 && !toggledInPull.current) {
        toggledInPull.current = true
        toggleRef.current()
      }
    }
    const up = () => {
      grabbed = -1
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) {
        window.cancelAnimationFrame(frame)
        frame = 0
      } else if (reduced) {
        draw()
      } else if (!frame) {
        frame = window.requestAnimationFrame(integrate)
      }
    })
    visibility.observe(canvas)
    if (reduced) draw()
    else frame = window.requestAnimationFrame(integrate)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      visibility.disconnect()
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
    }
  }, [dark])

  return (
    <canvas
      ref={canvasRef}
      className="pull-cord"
      aria-hidden="true"
      style={{ touchAction: 'none' }}
    />
  )
}

export function PortraitSlot() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || !profile.portrait) return

    const image = new Image()
    image.src = profile.portrait
    let mask: HTMLCanvasElement
    let color: HTMLCanvasElement
    let maskContext: CanvasRenderingContext2D | null = null
    let colorContext: CanvasRenderingContext2D | null = null
    let ready = false
    let visible = false

    const paint = () => {
      if (!ready || !maskContext || !colorContext) return
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const w = bounds.width
      const h = bounds.height
      if (w <= 0 || h <= 0) return
      const pixelWidth = Math.round(w * ratio)
      const pixelHeight = Math.round(h * ratio)
      if (
        canvas.width !== pixelWidth ||
        canvas.height !== pixelHeight ||
        mask.width !== pixelWidth ||
        mask.height !== pixelHeight ||
        color.width !== pixelWidth ||
        color.height !== pixelHeight
      ) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
        mask.width = color.width = pixelWidth
        mask.height = color.height = pixelHeight
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
        maskContext.setTransform(ratio, 0, 0, ratio, 0, 0)
        colorContext.setTransform(ratio, 0, 0, ratio, 0, 0)
      }
      const scale = Math.max(w / image.width, h / image.height)
      const iw = image.width * scale
      const ih = image.height * scale
      const x = (w - iw) / 2
      const y = (h - ih) / 2
      context.clearRect(0, 0, w, h)
      context.filter = 'grayscale(1)'
      context.drawImage(image, x, y, iw, ih)
      context.filter = 'none'
      colorContext.clearRect(0, 0, w, h)
      colorContext.drawImage(image, x, y, iw, ih)
      colorContext.globalCompositeOperation = 'destination-in'
      colorContext.drawImage(mask, 0, 0, w, h)
      colorContext.globalCompositeOperation = 'source-over'
      context.drawImage(color, 0, 0, w, h)
    }

    image.onload = () => {
      mask = document.createElement('canvas')
      color = document.createElement('canvas')
      const maskContextResult = mask.getContext('2d')
      const colorContextResult = color.getContext('2d')
      if (!maskContextResult || !colorContextResult) return
      maskContext = maskContextResult
      colorContext = colorContextResult
      ready = true
      if (visible) paint()
    }
    const reveal = (event: PointerEvent) => {
      if (!ready || !visible || !maskContext) return
      const bounds = canvas.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      maskContext.beginPath()
      maskContext.fillStyle = 'white'
      maskContext.arc(x, y, 42, 0, Math.PI * 2)
      maskContext.fill()
      paint()
    }
    const resize = new ResizeObserver(() => {
      if (ready && visible) paint()
    })
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (ready && visible) paint()
    })
    resize.observe(canvas)
    visibility.observe(canvas)
    canvas.addEventListener('pointerdown', reveal)
    canvas.addEventListener('pointermove', reveal)

    return () => {
      image.onload = null
      resize.disconnect()
      visibility.disconnect()
      canvas.removeEventListener('pointerdown', reveal)
      canvas.removeEventListener('pointermove', reveal)
    }
  }, [])

  if (!profile.portrait) {
    return (
      <div className="portrait-placeholder" role="img" aria-label="Portrait image slot. Add public/me.jpg to show Bharath's portrait.">
        <div className="portrait-monogram">BB</div>
        <span>PORTRAIT SLOT</span>
        <small>ADD PUBLIC/ME.JPG</small>
        <div className="portrait-orbit" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="portrait-frame">
      <canvas ref={canvasRef} className="portrait-canvas" role="img" aria-label="Bharath's portrait. Move or drag to reveal colour." />
      <span className="portrait-caption">DRAG TO REVEAL COLOUR</span>
    </div>
  )
}
