import React, { useState, useEffect, useCallback, memo } from 'react'

const SCROLL_VISIBILITY_THRESHOLD_MS = 300;

const BackToTopComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Show button when page is scrolled down
  const toggleVisibility = useCallback(() => {
    const scrolled = document.documentElement.scrollTop
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

    if (scrolled > SCROLL_VISIBILITY_THRESHOLD_MS) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }

    // Calculate scroll progress
    const progress = (scrolled / maxHeight) * 100
    setScrollProgress(progress)
  }, [])

  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [toggleVisibility])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 group"
          aria-label="Back to top"
        >
          {/* Progress Ring */}
          <div className="relative">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
                className="text-blue-500 transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
            </svg>

            {/* Button content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-full p-3 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg">
                <svg
                  className="w-5 h-5 text-white group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Back to top
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </button>
      )}
    </>
  )
}

export const BackToTop = memo(BackToTopComponent)
