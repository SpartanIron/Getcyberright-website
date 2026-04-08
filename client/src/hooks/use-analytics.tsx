"use client";

import { useEffect, useRef } from 'react';
import { useLocation } from '@/lib/navigation';
import { trackPageView } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(location);
      prevLocationRef.current = location;
    }
  }, [location]);
};
