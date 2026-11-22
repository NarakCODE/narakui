"use client"

import React, { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export type DotGridSpotlightProps = {
  /**
   * The base color of the default/inactive dots.
   * When omitted, automatically adapts to light (`rgba(24, 24, 26, 0.08)`) and dark (`rgba(255, 255, 255, 0.06)`) themes.
   */
  dotColor?: string

  /**
   * The color of the active dots when illuminated by the cursor's spotlight.
   * When omitted, automatically adapts to light (`rgba(24, 24, 26, 0.22)`) and dark (`rgba(255, 255, 255, 0.16)`) themes.
   */
  activeDotColor?: string

  /**
   * The distance (in pixels) between each dot in the grid.
   * @default 10
   */
  spacing?: number

  /**
   * The default radius of the dots when they are outside the interaction area.
   * @default 1
   */
  baseRadius?: number

  /**
   * The maximum radius of a dot when it is at the exact center of the cursor.
   * @default 2
   */
  activeRadius?: number

  /**
   * The radius (in pixels) of the interaction area (spotlight) around the cursor.
   * @default 128
   */
  interactionRadius?: number

  /**
   * The maximum opacity (alpha) at the exact center of the spotlight.
   * Accepts a value between `0` and `1` (e.g., `1` for full opacity).
   * @default 1.0
   */
  activeMaxAlpha?: number

  /**
   * The minimum opacity (alpha) at the outer edge of the spotlight.
   * Accepts a value between `0` and `1` (e.g., a low value for a soft, subtle fade).
   * @default 0.5
   */
  activeMinAlpha?: number

  /**
   * Optional CSS class name to apply to the canvas.
   */
  className?: string
}

const LIGHT_DOT_COLOR = "rgba(24, 24, 26, 0.08)"
const LIGHT_ACTIVE_DOT_COLOR = "rgba(24, 24, 26, 0.22)"
const DARK_DOT_COLOR = "rgba(255, 255, 255, 0.06)"
const DARK_ACTIVE_DOT_COLOR = "rgba(255, 255, 255, 0.16)"

export function DotGridSpotlight({
  dotColor,
  activeDotColor,
  spacing = 10,
  baseRadius = 1,
  activeRadius = 2,
  interactionRadius = 128,
  activeMaxAlpha = 1.0,
  activeMinAlpha = 0.5,
  className,
}: DotGridSpotlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({
    targetX: -1000,
    targetY: -1000,
    currentX: -1000,
    currentY: -1000,
    isActive: false,
    intensity: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let renderFrameId: number | null = null
    let isDark = document.documentElement.classList.contains("dark")

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)")

    const getResolvedColors = () => ({
      base: dotColor ?? (isDark ? DARK_DOT_COLOR : LIGHT_DOT_COLOR),
      active: activeDotColor ?? (isDark ? DARK_ACTIVE_DOT_COLOR : LIGHT_ACTIVE_DOT_COLOR),
    })

    const draw = () => {
      if (width === 0 || height === 0) return
      ctx.clearRect(0, 0, width, height)

      const { base, active } = getResolvedColors()
      const offsetX = (width % spacing) / 2
      const offsetY = (height % spacing) / 2
      const { currentX, currentY, intensity } = pointer.current

      for (let x = offsetX; x <= width; x += spacing) {
        for (let y = offsetY; y <= height; y += spacing) {
          const dx = x - currentX
          const dy = y - currentY
          const distance = Math.sqrt(dx * dx + dy * dy)

          let currentRadius = baseRadius
          let currentColor = base
          let currentAlpha = 1.0

          if (intensity > 0.01 && distance < interactionRadius) {
            const spatialFactor = 1 - distance / interactionRadius
            const factor = spatialFactor * intensity
            currentRadius = baseRadius + (activeRadius - baseRadius) * factor
            currentColor = active
            currentAlpha =
              activeMinAlpha + (activeMaxAlpha - activeMinAlpha) * factor
          }

          ctx.globalAlpha = currentAlpha
          ctx.beginPath()
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
          ctx.fillStyle = currentColor
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1.0
    }

    const tick = () => {
      const state = pointer.current
      const targetIntensity = state.isActive ? 1 : 0

      state.currentX += (state.targetX - state.currentX) * 0.28
      state.currentY += (state.targetY - state.currentY) * 0.28
      state.intensity += (targetIntensity - state.intensity) * 0.2

      draw()

      const dx = Math.abs(state.targetX - state.currentX)
      const dy = Math.abs(state.targetY - state.currentY)
      const di = Math.abs(targetIntensity - state.intensity)

      if (dx > 0.25 || dy > 0.25 || di > 0.01) {
        renderFrameId = requestAnimationFrame(tick)
      } else {
        state.currentX = state.targetX
        state.currentY = state.targetY
        state.intensity = targetIntensity
        renderFrameId = null
      }
    }

    const scheduleTick = () => {
      if (renderFrameId === null) {
        renderFrameId = requestAnimationFrame(tick)
      }
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      width = parent.clientWidth
      height = parent.clientHeight

      if (width === 0 || height === 0) return

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      draw()

      requestAnimationFrame(() => {
        canvas.dataset.ready = "true"
      })
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (reduceMotionQuery.matches || !finePointerQuery.matches) return
      const rect = parent.getBoundingClientRect()
      const nextX = e.clientX - rect.left
      const nextY = e.clientY - rect.top

      if (!pointer.current.isActive && pointer.current.intensity < 0.02) {
        pointer.current.currentX = nextX
        pointer.current.currentY = nextY
      }

      pointer.current.targetX = nextX
      pointer.current.targetY = nextY
      pointer.current.isActive = true
      scheduleTick()
    }

    const handlePointerLeave = () => {
      pointer.current.isActive = false
      scheduleTick()
    }

    parent.addEventListener("pointermove", handlePointerMove)
    parent.addEventListener("pointerleave", handlePointerLeave)

    const resizeObserver = new ResizeObserver(() => resizeCanvas())
    resizeObserver.observe(parent)

    const themeObserver = new MutationObserver(() => {
      const nextIsDark = document.documentElement.classList.contains("dark")
      if (nextIsDark !== isDark) {
        isDark = nextIsDark
        draw()
      }
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    resizeCanvas()

    return () => {
      parent.removeEventListener("pointermove", handlePointerMove)
      parent.removeEventListener("pointerleave", handlePointerLeave)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      if (renderFrameId !== null) cancelAnimationFrame(renderFrameId)
    }
  }, [
    spacing,
    baseRadius,
    activeRadius,
    interactionRadius,
    dotColor,
    activeDotColor,
    activeMaxAlpha,
    activeMinAlpha,
  ])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-slot="dot-grid-spotlight"
      data-ready="false"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 block opacity-0 transition-opacity duration-200 ease-out data-[ready=true]:opacity-100 motion-reduce:transition-none",
        className
      )}
    />
  )
}
