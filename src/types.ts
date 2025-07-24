export type Shader = {
  id: number
  url: string
  filePath: string
  day: number
  title?: string
  description?: string
  tags?: string[]
  createdAt?: Date
}

export type SortOption = 'day-asc' | 'day-desc' | 'recent'

export type FilterState = {
  searchQuery: string
  dayRange: {
    min: number
    max: number
  }
  sortBy: SortOption
}

export type SearchAndFiltersProps = {
  filterState: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  totalResults: number
  maxDay: number
}
