import React, { Suspense, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Spline from '@splinetool/react-spline';

// Enhanced loading component
const SplineLoadingFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black/30 to-black/10 backdrop-blur-sm">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/60 mb-4"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
    </div>
    <p className="text-white/70 text-sm font-medium animate-pulse">Loading 3D Experience...</p>
    <div className="mt-2 flex space-x-1">
      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

// Error boundary component for Spline
const SplineErrorFallback = ({ onRetry }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="w-16 h-16 mx-auto mb-4 text-red-400/60">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-white/80 font-medium mb-2">3D Scene Unavailable</h3>
      <p className="text-white/60 text-sm mb-4">Unable to load the interactive background</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/80 text-sm font-medium transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

const KekTwo = React.memo(() => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSplineLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    console.log('Spline scene loaded successfully');
  }, []);

  const handleSplineError = useCallback((error) => {
    console.error('Failed to load Spline scene:', error);
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
  }, []);

  if (hasError) {
    return <SplineErrorFallback onRetry={handleRetry} />;
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <SplineLoadingFallback />
        </div>
      )}
      <Suspense fallback={<SplineLoadingFallback />}>
        <div className="w-full h-full">
          <Spline 
            scene="https://prod.spline.design/Yk73iwYJePnQyULb/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent'
            }}
          />
        </div>
      </Suspense>
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  );
});

KekTwo.displayName = 'KekTwo';

export default KekTwo;