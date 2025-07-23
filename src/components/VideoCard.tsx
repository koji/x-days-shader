import React, { useState, useEffect } from 'react';
import { Shader } from '../types';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface VideoCardProps {
  shader: Shader
  onClick?: () => void
}

export const VideoCard: React.FC<VideoCardProps> = ({ shader, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  
  // Intersection observer for lazy loading
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Start loading video when it comes into view
  useEffect(() => {
    if (hasIntersected && !shouldLoadVideo) {
      // Add a small delay to stagger video loading
      const timer = setTimeout(() => {
        setShouldLoadVideo(true);
      }, Math.random() * 200); // Random delay 0-200ms
      
      return () => clearTimeout(timer);
    }
  }, [hasIntersected, shouldLoadVideo]);

  return (
    <div 
      ref={elementRef}
      className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] transform-gpu cursor-pointer"
      onClick={onClick}
    >
      
      {/* Day Number Badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
        Day {shader.day}
      </div>

      {/* Video Container */}
      <div className="relative bg-black aspect-video">
        {/* Lazy Loading Placeholder */}
        {!hasIntersected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-400">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm opacity-75">Video will load when visible</p>
          </div>
        )}

        {/* Loading Placeholder */}
        {hasIntersected && shouldLoadVideo && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Failed to load video</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                setShouldLoadVideo(true);
              }}
              className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Video Element - Only render when should load */}
        {shouldLoadVideo && (
          <video
            key={shader.id}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            controls
            preload="metadata"
            playsInline
            autoPlay
            muted
            loop
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
          >
            <source src={shader.filePath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Video Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            {shader.title || `Shader ${shader.day.toString().padStart(3, '0')}`}
          </h3>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        {/* Description */}
        {shader.description && (
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {shader.description}
          </p>
        )}

        {/* Tags */}
        {shader.tags && shader.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {shader.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {shader.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-md">
                +{shader.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <a
            href={shader.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium text-sm group/link"
            aria-label={`View shader ${shader.day} on ShaderToy`}
            onClick={(e) => e.stopPropagation()}
          >
            <span>View on ShaderToy</span>
            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation()
              const shareUrl = `${window.location.origin}#shader-${shader.day}`
              if (navigator.share) {
                navigator.share({
                  title: `Shader Day ${shader.day}`,
                  text: shader.description || 'Check out this amazing shader!',
                  url: shareUrl,
                }).catch(console.error)
              } else {
                navigator.clipboard.writeText(shareUrl)
              }
            }}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-300 rounded-lg hover:bg-gray-700"
            aria-label="Share shader"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
