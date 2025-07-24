import React, { useState, useCallback, useRef, useEffect, memo } from 'react'

interface DualRangeSliderProps {
  min: number
  max: number
  value: { min: number; max: number }
  onChange: (value: { min: number; max: number }) => void
  step?: number
  className?: string
}

const DualRangeSliderComponent: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const getPercentage = useCallback((val: number) => {
    return ((val - min) / (max - min)) * 100
  }, [min, max])

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return min

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percentage * (max - min)
    return Math.round(rawValue / step) * step
  }, [min, max, step])

  const handleMouseDown = useCallback((handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(handle)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const newValue = getValueFromPosition(e.clientX)
    
    if (isDragging === 'min') {
      const newMin = Math.min(newValue, value.max)
      if (newMin !== value.min) {
        onChange({ min: newMin, max: value.max })
      }
    } else {
      const newMax = Math.max(newValue, value.min)
      if (newMax !== value.max) {
        onChange({ min: value.min, max: newMax })
      }
    }
  }, [isDragging, getValueFromPosition, value, onChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return

    const newValue = getValueFromPosition(e.clientX)
    const distanceToMin = Math.abs(newValue - value.min)
    const distanceToMax = Math.abs(newValue - value.max)

    if (distanceToMin < distanceToMax) {
      const newMin = Math.min(newValue, value.max)
      onChange({ min: newMin, max: value.max })
    } else {
      const newMax = Math.max(newValue, value.min)
      onChange({ min: value.min, max: newMax })
    }
  }, [isDragging, getValueFromPosition, value, onChange])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const minPercentage = getPercentage(value.min)
  const maxPercentage = getPercentage(value.max)

  return (
    <div className={`relative ${className}`}>
      {/* Track */}
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-600 rounded-lg cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Active range */}
        <div
          className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`
          }}
        />

        {/* Min handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-gray-800 rounded-full cursor-grab shadow-lg transition-all duration-200 ${
            isDragging === 'min' ? 'scale-110 shadow-blue-500/50' : 'hover:scale-105'
          }`}
          style={{ left: `${minPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          onMouseDown={handleMouseDown('min')}
        >
          <div className="absolute inset-1 bg-white/20 rounded-full" />
        </div>

        {/* Max handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-gray-800 rounded-full cursor-grab shadow-lg transition-all duration-200 ${
            isDragging === 'max' ? 'scale-110 shadow-purple-500/50' : 'hover:scale-105'
          }`}
          style={{ left: `${maxPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          onMouseDown={handleMouseDown('max')}
        >
          <div className="absolute inset-1 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Value labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>Day {min}</span>
        <span>Day {max}</span>
      </div>

      {/* Current values */}
      <div className="flex justify-center mt-1">
        <span className="text-sm text-gray-300">
          Day {value.min} - Day {value.max}
        </span>
      </div>
    </div>
  )
}

export const DualRangeSlider = memo(DualRangeSliderComponent)