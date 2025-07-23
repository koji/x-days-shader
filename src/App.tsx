import { useState, useEffect, useMemo } from 'react'
import { VideoCard } from './components/VideoCard'
import { SearchAndFilters } from './components/SearchAndFilters'
import { DetailModal } from './components/DetailModal'
import { BackToTop } from './components/BackToTop'
import { GridSkeleton, SearchFiltersSkeleton } from './components/LoadingSkeleton'
import { ErrorBoundary } from './components/ErrorBoundary'
import { videoData } from './data'
import { FilterState, Shader } from './types'
import { filterShaders, getMaxDay } from './utils'

function App() {
  const days = videoData.length
  const maxDay = getMaxDay(videoData)
  const [animatedCount, setAnimatedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)


  // Filter state management
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    dayRange: { min: 1, max: maxDay },
    sortBy: 'day-asc'
  })

  // Modal state management
  const [selectedShader, setSelectedShader] = useState<Shader | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Compute filtered shaders
  const filteredShaders = useMemo(() => {
    return filterShaders(videoData, filterState)
  }, [filterState])

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }))
  }

  // Modal handlers
  const handleOpenModal = (shader: Shader) => {
    setSelectedShader(shader)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedShader(null)
  }

  const handlePreviousShader = () => {
    if (!selectedShader) return
    const currentIndex = filteredShaders.findIndex(s => s.id === selectedShader.id)
    if (currentIndex > 0) {
      setSelectedShader(filteredShaders[currentIndex - 1])
    }
  }

  const handleNextShader = () => {
    if (!selectedShader) return
    const currentIndex = filteredShaders.findIndex(s => s.id === selectedShader.id)
    if (currentIndex < filteredShaders.length - 1) {
      setSelectedShader(filteredShaders[currentIndex + 1])
    }
  }

  const currentShaderIndex = selectedShader 
    ? filteredShaders.findIndex(s => s.id === selectedShader.id)
    : -1

  // Simulate initial loading and animate the counter
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // Simulate loading time

    // Animate the counter on mount
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = days / steps
    let current = 0

    const counterTimer = setInterval(() => {
      current += increment
      if (current >= days) {
        setAnimatedCount(days)
        clearInterval(counterTimer)
      } else {
        setAnimatedCount(Math.floor(current))
      }
    }, duration / steps)

    return () => {
      clearTimeout(loadingTimer)
      clearInterval(counterTimer)
    }
  }, [days])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <header className="mb-12 sm:mb-16 text-center relative">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-[20rem] font-black text-gray-700 select-none pointer-events-none">
              {animatedCount}
            </div>
          </div>
          
          {/* Main title */}
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-4 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-20"></div>
              <div className="flex items-center space-x-2 text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium tracking-wider uppercase">Shader Gallery</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-20"></div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                {animatedCount}
              </span>
              <span className="text-white ml-4 sm:ml-6">
                Days
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400 bg-clip-text text-transparent">
                Shader
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              A journey through creative coding and visual effects, exploring the art of shader programming one day at a time.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm sm:text-base">
              <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">{days} Videos</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-gray-300">Creative Coding</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
                <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-300">GLSL Shaders</span>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Loading State */}
          {isLoading ? (
            <>
              <SearchFiltersSkeleton />
              <GridSkeleton count={6} />
            </>
          ) : (
            <>
              {/* Search and Filters */}
              <SearchAndFilters
                filterState={filterState}
                onFilterChange={handleFilterChange}
                totalResults={filteredShaders.length}
                maxDay={maxDay}
              />

              {/* Shader Grid */}
              {filteredShaders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredShaders.map((shader) => (
                    <VideoCard 
                      key={shader.id} 
                      shader={shader} 
                      onClick={() => handleOpenModal(shader)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.875a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No shaders found</h3>
                    <p className="text-gray-400 mb-6">
                      Try adjusting your search terms or filters to find more shaders.
                    </p>
                    <button
                      onClick={() => handleFilterChange({
                        searchQuery: '',
                        dayRange: { min: 1, max: maxDay },
                        sortBy: 'day-asc'
                      })}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reset Filters</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="mt-16 pt-12 border-t border-gray-700/50">
          <div className="max-w-4xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              
              {/* About Section */}
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  About This Project
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A creative coding journey exploring the art of shader programming. Each day brings a new visual experiment in GLSL.
                </p>
              </div>

              {/* Stats Section */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-3">Gallery Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-400 text-sm">{days} Shaders Created</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-400 text-sm">Daily Updates</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-gray-400 text-sm">Made with Passion</span>
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="text-center md:text-right">
                <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
                <div className="space-y-2">
                  <a 
                    href="https://shadertoy.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    ShaderToy Platform
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    View Source Code
                  </a>
                  <a 
                    href="mailto:contact@example.com"
                    className="block text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Shader Gallery</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>&copy; {new Date().getFullYear()} koji</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center space-x-1">
                  <span>Built with</span>
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>and React</span>
                </span>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-6 pt-4 border-t border-gray-800/50">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>React</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>TypeScript</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                  <span>Tailwind CSS</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Vite</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>GLSL</span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Detail Modal */}
      <DetailModal
        shader={selectedShader}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPrevious={handlePreviousShader}
        onNext={handleNextShader}
        hasPrevious={currentShaderIndex > 0}
        hasNext={currentShaderIndex < filteredShaders.length - 1}
      />

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </ErrorBoundary>
  )
}

export default App
