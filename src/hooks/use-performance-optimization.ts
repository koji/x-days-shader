import { useState, useEffect, useRef } from 'react'

interface PerformanceSettings {
  pixelRatio: number
  antialias: boolean
  targetFPS: number
}

export const usePerformanceOptimization = (isPreview: boolean = false) => {
  const [settings, setSettings] = useState<PerformanceSettings>({
    pixelRatio: isPreview ? 0.75 : 1.5,
    antialias: false,
    targetFPS: isPreview ? 30 : 60,
  })

  const fpsHistoryRef = useRef<number[]>([])
  const lastOptimizationRef = useRef(0)

  const updatePerformanceSettings = (currentFPS: number) => {
    const now = performance.now()
    if (now - lastOptimizationRef.current < 5000) return // Only optimize every 5 seconds

    lastOptimizationRef.current = now
    fpsHistoryRef.current.push(currentFPS)

    // Keep only last 10 FPS readings
    if (fpsHistoryRef.current.length > 10) {
      fpsHistoryRef.current.shift()
    }

    const avgFPS =
      fpsHistoryRef.current.reduce((a, b) => a + b, 0) /
      fpsHistoryRef.current.length

    setSettings((prev) => {
      let newSettings = { ...prev }

      // If FPS is too low, reduce quality
      if (avgFPS < 30) {
        newSettings.pixelRatio = Math.max(0.5, prev.pixelRatio * 0.8)
        newSettings.antialias = false
        newSettings.targetFPS = Math.max(15, prev.targetFPS - 10)
      }
      // If FPS is good, gradually increase quality
      else if (avgFPS > 55) {
        newSettings.pixelRatio = Math.min(2.0, prev.pixelRatio * 1.1)
        newSettings.targetFPS = Math.min(60, prev.targetFPS + 5)
      }

      return newSettings
    })
  }

  return { settings, updatePerformanceSettings }
}
