import React from 'react'

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700 animate-pulse">
      {/* Day Badge Skeleton */}
      <div className="absolute top-3 left-3 z-10 bg-gray-700 rounded-full w-16 h-6"></div>
      
      {/* Video Container Skeleton */}
      <div className="relative bg-gray-800 aspect-video">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Title Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-700 rounded w-3/4"></div>
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
        
        {/* Tags Skeleton */}
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-700 rounded-full w-16"></div>
          <div className="h-6 bg-gray-700 rounded-full w-20"></div>
          <div className="h-6 bg-gray-700 rounded-full w-12"></div>
        </div>
        
        {/* Link Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-700 rounded w-32"></div>
          <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export const SearchFiltersSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Input Skeleton */}
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-12 bg-gray-700 rounded-xl"></div>
        </div>
        
        {/* Range Slider Skeleton */}
        <div className="lg:w-80">
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="space-y-3">
            <div className="h-2 bg-gray-700 rounded-lg"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-700 rounded w-8"></div>
              <div className="h-3 bg-gray-700 rounded w-8"></div>
            </div>
          </div>
        </div>
        
        {/* Sort Dropdown Skeleton */}
        <div className="lg:w-48">
          <div className="h-4 bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-12 bg-gray-700 rounded-xl"></div>
        </div>
      </div>
      
      {/* Results Counter Skeleton */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
        <div className="h-4 bg-gray-700 rounded w-32"></div>
        <div className="h-8 bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  )
}

export const HeaderSkeleton: React.FC = () => {
  return (
    <header className="mb-12 sm:mb-16 text-center relative animate-pulse">
      {/* Background decoration skeleton */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-80 h-80 bg-gray-700 rounded-full"></div>
      </div>
      
      <div className="relative z-10">
        {/* Subtitle skeleton */}
        <div className="inline-flex items-center space-x-4 mb-6">
          <div className="h-px bg-gray-700 flex-1 max-w-20"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
          <div className="h-px bg-gray-700 flex-1 max-w-20"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-4 mb-6">
          <div className="h-16 bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-16 bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-8 max-w-2xl mx-auto">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700">
              <div className="w-4 h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}