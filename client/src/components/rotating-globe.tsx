"use client";

import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

interface RotatingGlobeProps {
  size?: number;
}

export function RotatingGlobe({ size = 400 }: RotatingGlobeProps) {
  const globeRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (globeRef.current && isClient) {
      const globe = globeRef.current;
      
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;
      globe.controls().enableRotate = false;
      
      globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }
  }, [isClient]);

  if (!isClient) {
    return <div style={{ width: size, height: size }} className="bg-transparent" />;
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Globe
        ref={globeRef}
        width={size}
        height={size}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl=""
        showAtmosphere={true}
        atmosphereColor="#22d3ee"
        atmosphereAltitude={0.15}
        animateIn={false}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </div>
  );
}
