'use client';

import { useEffect, useRef } from 'react';

interface ARViewerProps {
  modelUrl: string;
  poster?: string;
  alt: string;
}

export default function ARViewer({ modelUrl, poster, alt }: ARViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && viewerRef.current) {
      import('@google/model-viewer');
    }
  }, []);

  return (
    <div ref={viewerRef} className="w-full h-full min-h-[400px] lg:min-h-[600px]">
      <model-viewer
        src={modelUrl}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        poster={poster}
        shadow-intensity="1"
        auto-rotate
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors shadow-lg"
        >
          View in AR
        </button>
      </model-viewer>
    </div>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
