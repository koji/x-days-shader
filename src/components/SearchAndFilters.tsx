import { useState, useCallback, memo } from 'react'
import { SearchAndFiltersProps, SortOption } from '../types'
import { debounce } from '../utils'
import { DualRangeSlider } from './DualRangeSlider'


const DEBOUNCE_DELAY_MS = 300;

const SearchAndFiltersComponent: React.FC<SearchAndFiltersProps> = ({
  filterState,
  onFilterChange,
  totalResults,
  maxDay,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(filterState.searchQuery)

  // Debounced search to avoid excessive filtering
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onFilterChange({ searchQuery: query })
    }, DEBOUNCE_DELAY_MS),
    [onFilterChange]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchQuery(value)
    debouncedSearch(value)
  }

  const handleSortChange = (sortBy: SortOption) => {
    onFilterChange({ sortBy })
  }

  const handleDayRangeChange = useCallback((range: { min: number; max: number }) => {
    onFilterChange({
      dayRange: range
    })
  }, [onFilterChange])

  const handleClearFilters = () => {
    setLocalSearchQuery('')
    onFilterChange({
      searchQuery: '',
      dayRange: { min: 1, max: maxDay },
      sortBy: 'day-asc'
    })
  }

  const hasActiveFilters =
    filterState.searchQuery.trim() !== '' ||
    filterState.dayRange.min !== 1 ||
    filterState.dayRange.max !== maxDay ||
    filterState.sortBy !== 'day-asc'

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
            Search Shaders
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              value={localSearchQuery}
              onChange={handleSearchChange}
              placeholder="Search by day number, title, or tags..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {localSearchQuery && (
              <button
                onClick={() => {
                  setLocalSearchQuery('')
                  onFilterChange({ searchQuery: '' })
                }}
                aria-label="Clear search"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Day Range Slider */}
        <div className="lg:w-80">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Day Range
          </label>
          <DualRangeSlider
            min={1}
            max={maxDay}
            value={filterState.dayRange}
            onChange={handleDayRangeChange}
            step={1}
          />
        </div>

        {/* Sort Options */}
        <div className="lg:w-48">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-300 mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={filterState.sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="block w-full px-3 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="day-asc">Day (1 → {maxDay})</option>
            <option value="day-desc">Day ({maxDay} → 1)</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Results and Clear Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="flex items-center space-x-2 text-gray-300">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 012 2v10a2 2 0 01-2 2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 5a2 2 0 012 2v10a2 2 0 01-2 2" />
            </svg>
            <span className="text-sm">
              {totalResults} {totalResults === 1 ? 'shader' : 'shaders'} found
            </span>
          </div>

          {totalResults === 0 && filterState.searchQuery && (
            <div className="flex items-center space-x-2 text-amber-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm">No results for "{filterState.searchQuery}"</span>
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  )
}

export const SearchAndFilters = memo(SearchAndFiltersComponent)
