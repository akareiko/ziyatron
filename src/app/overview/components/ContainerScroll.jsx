"use client";
import React, { useRef, useCallback, useMemo } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = React.memo(({
  titleComponent,
  children,
  cardStartHeight = 40 // Default to 40% if not specified
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end start"]
  });
  
  const [isMobile, setIsMobile] = React.useState(false);

  // Memoize resize handler
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  React.useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    handleResize();
    
    // Use passive event listener for better performance
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Memoize scale dimensions to prevent unnecessary recalculations
  const scaleDimensions = useMemo(() => {
    return isMobile ? [0.7, 1, 1.3] : [0.7, 1.2, 2];
  }, [isMobile]);

  // Enhanced transforms for better scroll experience
  const rotate = useTransform(scrollYProgress, [0, 0.3, 1], [25, 10, -25]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], scaleDimensions);
  const translateY = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 50, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.9]);

  const titleTranslateY = useTransform(scrollYProgress, [0, 0.4, 1], [0, -300, -600]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.5, 0]);

  return (
    <div
      className="relative min-h-screen"
      ref={containerRef}
    >
      {/* Title positioned absolutely to center in KekTwo area */}
      <motion.div 
        className="relative z-20"
        style={{
          translateY: titleTranslateY,
          opacity: titleOpacity,
        }}
      >
        {titleComponent}
      </motion.div>
      
      {/* Card positioned at specified height with scroll effects */}
      <div 
        className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-20"
        style={{
          paddingTop: `${cardStartHeight}vh`,
          perspective: "1000px",
        }}
      >
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            translateY,
            opacity,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
          className="max-w-6xl mx-auto h-[30rem] md:h-[40rem] w-full rounded-[30px] shadow-2xl backdrop-blur-sm"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 relative">
            {/* Content with subtle backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
            <div className="relative z-10 h-full w-full">
              {children}
            </div>
          </div>
        </motion.div>
        
        {/* Additional spacing for scroll continuation */}
        <div className="h-screen" />
      </div>
    </div>
  );
});

ContainerScroll.displayName = 'ContainerScroll';