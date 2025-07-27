import { useState, useEffect, useRef } from 'react'

export const useFPS = () => {
  const [fps, setFps] = useState(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())

  useEffect(() => {
    const updateFPS = () => {
      frameCountRef.current++
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTimeRef.current

      if (deltaTime >= 1000) {
        const calculatedFps = Math.round(
          (frameCountRef.current * 1000) / deltaTime
        )
        setFps(calculatedFps)
        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      requestAnimationFrame(updateFPS)
    }

    const animationId = requestAnimationFrame(updateFPS)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return fps
}
