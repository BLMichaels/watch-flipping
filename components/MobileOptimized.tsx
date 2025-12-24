'use client';

import { useState, useEffect } from 'react';

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function MobileView({ children, desktopChildren }: { children: React.ReactNode; desktopChildren?: React.ReactNode }) {
  const isMobile = useMobileOptimization();
  
  return (
    <>
      {isMobile ? children : (desktopChildren || children)}
    </>
  );
}

