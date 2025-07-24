import { Shader, FilterState } from './types'

export const filterShaders = (shaders: Shader[], filters: FilterState): Shader[] => {
  let filtered = [...shaders]

  // Filter by search query
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(shader => 
      shader.day.toString().includes(query) ||
      shader.title?.toLowerCase().includes(query) ||
      shader.description?.toLowerCase().includes(query) ||
      shader.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Filter by day range
  filtered = filtered.filter(shader => 
    shader.day >= filters.dayRange.min && shader.day <= filters.dayRange.max
  )

  // Sort results
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'day-asc':
        return a.day - b.day
      case 'day-desc':
        return b.day - a.day
      case 'recent':
        if (a.createdAt && b.createdAt) {
          return b.createdAt.getTime() - a.createdAt.getTime()
        }
        return b.day - a.day // fallback to day desc
      default:
        return a.day - b.day
    }
  })

  return filtered
}

export const getMaxDay = (shaders: Shader[]): number => {
  return Math.max(...shaders.map(shader => shader.day))
}

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}