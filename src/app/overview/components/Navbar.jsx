"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import BlurEffect from "react-progressive-blur";

// SVG Logo Component
const Logo = () => (
  <svg 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
    aria-label="Ziyatron Logo"
  >
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
    <path 
      d="M12 20L18 26L28 14" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Menu Item Component
const MenuItem = ({ setActive, active, item, children, href }) => {
  const handleMouseEnter = useCallback(() => setActive(item), [setActive, item]);
  
  const content = (
    <p className="cursor-pointer text-neutral-300 hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-white/5">
      {item}
    </p>
  );

  return (
    <div 
      onMouseEnter={handleMouseEnter} 
      className="relative"
    >
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
      {active === item && children && (
        <div 
          className="absolute top-[calc(100%_+_0.5rem)] left-1/2 transform -translate-x-1/2 pt-2 animate-in fade-in-0 zoom-in-95 duration-200"
          role="menu"
        >
          <div className="bg-black/95 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Menu Component
const Menu = ({ setActive, children }) => {
  const handleMouseLeave = useCallback(() => setActive(null), [setActive]);
  
  return (
    <nav
      onMouseLeave={handleMouseLeave}
      className="relative rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-lg flex items-center space-x-2 px-4 py-2"
      role="navigation"
      aria-label="Main navigation"
    >
      {children}
    </nav>
  );
};

// Hovered Link Component
const HoveredLink = ({ children, href, ...rest }) => {
  return (
    <Link
      href={href}
      {...rest}
      className="text-neutral-300 hover:text-white transition-colors duration-200 py-1 px-2 rounded hover:bg-white/5 block"
      role="menuitem"
    >
      {children}
    </Link>
  );
};

// Try Button Component - matching menu style
const TryButton = () => {
  return (
    <Link 
      href="/"
      className="relative rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-lg flex items-center space-x-2 p-4 text-neutral-300 hover:text-white transition-colors duration-200 font-medium hover:bg-white/5"
      aria-label="Try Ziyatron"
    >
      <span className="relative z-10">Try Ziyatron</span>
    </Link>
  );
};

export default function Navbar() {
  const [active, setActive] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering (prevents hydration issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key to close menus
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setActive(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      {/* Fixed navbar */}
      <header className="fixed top-0 left-0 right-0 z-[9999] w-full">
        {/* Top gradient + blur */}
        <div className="absolute top-0 left-0 w-full h-20 pointer-events-none z-10" 
          style={{ 
            background: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.5), rgba(255,255,255,0))"
          }}
        />
        <div className="relative">
          <BlurEffect position="top" intensity={50} className="h-20" />
        </div>
        
        {/* Content container */}
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center space-x-2 group"
                aria-label="Ziyatron Home"
              >
                <div className="transform transition-transform group-hover:scale-110 duration-200">
                  <Logo />
                </div>
                <span className="text-white font-bold text-xl hidden sm:block">
                  Ziyatron
                </span>
              </Link>
            </div>

            {/* Center Navigation - Hidden on mobile, visible on md+ */}
            <div className="hidden md:flex flex-1 justify-center">
              <Menu setActive={setActive}>
                <MenuItem 
                  setActive={setActive} 
                  active={active} 
                  item="About" 
                  href="/about" 
                />
                
                <MenuItem setActive={setActive} active={active} item="Learn">
                  <div className="flex flex-col space-y-3 text-sm min-w-[160px]">
                    <HoveredLink href="/upload">Upload</HoveredLink>
                    <HoveredLink href="/visualize">Visualize</HoveredLink>
                  </div>
                </MenuItem>
                
                <MenuItem setActive={setActive} active={active} item="For Business">
                  <div className="flex flex-col space-y-3 text-sm min-w-[180px]">
                    <HoveredLink href="/learn#introduction">Begin</HoveredLink>
                    <HoveredLink href="/learn#webdev">Web Development</HoveredLink>
                    <HoveredLink href="/learn#dataprep">Data Preprocessing</HoveredLink>
                    <HoveredLink href="/learn#modelbuild">Model Building</HoveredLink>
                    <HoveredLink href="/learn#visualization">Visualization</HoveredLink>
                  </div>
                </MenuItem>
                
                <MenuItem 
                  setActive={setActive} 
                  active={active} 
                  item="Download" 
                  href="/download" 
                />
              </Menu>
            </div>

            {/* Right side - Try Button and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Try Ziyatron Button - matching menu style */}
              <TryButton />
              
              {/* Mobile menu button - only visible on mobile */}
              <button
                className="md:hidden relative rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-lg p-2 text-neutral-300 hover:text-white transition-colors duration-200"
                aria-label="Open mobile menu"
                onClick={() => setActive(active === 'mobile' ? null : 'mobile')}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {active === 'mobile' && (
            <div className="md:hidden absolute top-full left-4 right-4 mt-2 animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="bg-black/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl p-4">
                <nav className="flex flex-col space-y-3" role="navigation" aria-label="Mobile navigation">
                  <Link 
                    href="/about"
                    className="text-neutral-300 hover:text-white transition-colors duration-200 py-2 px-3 rounded hover:bg-white/5 block"
                    onClick={() => setActive(null)}
                  >
                    About
                  </Link>
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-neutral-400 text-sm mb-2 px-3">Learn</p>
                    <Link 
                      href="/upload"
                      className="text-neutral-300 hover:text-white transition-colors duration-200 py-1 px-6 rounded hover:bg-white/5 block text-sm"
                      onClick={() => setActive(null)}
                    >
                      Upload
                    </Link>
                    <Link 
                      href="/visualize"
                      className="text-neutral-300 hover:text-white transition-colors duration-200 py-1 px-6 rounded hover:bg-white/5 block text-sm"
                      onClick={() => setActive(null)}
                    >
                      Visualize
                    </Link>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-neutral-400 text-sm mb-2 px-3">For Business</p>
                    <Link 
                      href="/learn#introduction"
                      className="text-neutral-300 hover:text-white transition-colors duration-200 py-1 px-6 rounded hover:bg-white/5 block text-sm"
                      onClick={() => setActive(null)}
                    >
                      Begin
                    </Link>
                    <Link 
                      href="/learn#webdev"
                      className="text-neutral-300 hover:text-white transition-colors duration-200 py-1 px-6 rounded hover:bg-white/5 block text-sm"
                      onClick={() => setActive(null)}
                    >
                      Web Development
                    </Link>
                    <Link 
                      href="/learn#dataprep"
                      className="text-neutral-300 hover:text-white transition-colors duration-200 py-1 px-6 rounded hover:bg-white/5 block text-sm"
                      onClick={() => setActive(null)}
                    >
                      Data Preprocessing
                    </Link>
                    <Link 
                      href="/learn#modelbuild"
                      className="text-neutral-300 hover:text-white transition-colors duration-200 py-1 px-6 rounded hover:bg-white/5 block text-sm"
                      onClick={() => setActive(null)}
                    >
                      Model Building
                    </Link>
                    <Link 
                      href="/learn#visualization"
                      className="text-neutral-300 hover:text-white transition-colors duration-200 py-1 px-6 rounded hover:bg-white/5 block text-sm"
                      onClick={() => setActive(null)}
                    >
                      Visualization
                    </Link>
                  </div>
                  <Link 
                    href="/download"
                    className="text-neutral-300 hover:text-white transition-colors duration-200 py-2 px-3 rounded hover:bg-white/5 block border-t border-white/20 pt-3"
                    onClick={() => setActive(null)}
                  >
                    Download
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20" />
    </>
  );
}