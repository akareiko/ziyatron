"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

export const LayoutGrid = ({ cards = [] }) => {
  const [selected, setSelected] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);

  // Memoize the close function to prevent unnecessary re-renders
  const closeSelected = useCallback(() => {
    setLastSelected(selected);
    setSelected(null);
  }, [selected]);

  const handleClick = useCallback((card) => {
    setLastSelected(selected);
    setSelected(card);
  }, [selected]);

  // Global click and keyboard event handling
  useEffect(() => {
    if (!selected) return;

    const handleGlobalClick = (event) => {
      // Check if the click is on the selected card content
      const selectedElement = document.querySelector(`[data-card-id="${selected.id}"]`);
      if (selectedElement && selectedElement.contains(event.target)) {
        return; // Don't close if clicking on the selected card content
      }
      closeSelected();
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeSelected();
      }
    };

    // Add event listeners with capture for global handling
    document.addEventListener('click', handleGlobalClick, true);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selected, closeSelected]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selected]);

  // Error boundary for invalid cards
  if (!Array.isArray(cards)) {
    console.error('LayoutGrid: cards prop must be an array');
    return null;
  }

  if (cards.length === 0) {
    return (
      <div className="w-full h-full p-10 flex items-center justify-center">
        <p className="text-gray-500">No cards to display</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
        {cards.map((card, i) => {
          if (!card || !card.id) {
            console.warn(`Card at index ${i} is missing required id property`);
            return null;
          }

          return (
            <div key={card.id} className={cn(card.className, "")}>
              <motion.div
                data-card-id={card.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(card);
                }}
                className={cn(
                  card.className,
                  "relative overflow-hidden cursor-pointer",
                  selected?.id === card.id
                    ? "rounded-lg fixed inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                    : lastSelected?.id === card.id
                    ? "z-40 bg-white rounded-xl h-full w-full"
                    : "bg-white rounded-xl h-full w-full hover:shadow-lg transition-shadow duration-200"
                )}
                layoutId={`card-${card.id}`}
                whileHover={selected?.id !== card.id ? { scale: 1.02 } : {}}
                transition={{ duration: 0.2 }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${card.title || 'card'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClick(card);
                  }
                }}
              >
                {selected?.id === card.id && <SelectedCard selected={selected} closeSelected={closeSelected}/>}
                <ImageComponent card={card} />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Global overlay - covers entire viewport */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
            onClick={closeSelected}
            aria-label="Close modal"
            role="button"
            tabIndex={-1}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const ImageComponent = React.memo(({ card }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    console.warn(`Failed to load image: ${card.thumbnail}`);
  }, [card.thumbnail]);

  if (!card.thumbnail) {
    return (
      <div className="absolute inset-0 h-full w-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  return (
    <>
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 h-full w-full bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {imageError ? (
        <div className="absolute inset-0 h-full w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      ) : (
        <motion.img
          layoutId={`image-${card.id}-image`}
          src={card.thumbnail}
          height="500"
          width="500"
          className={cn(
            "object-cover object-top absolute inset-0 h-full w-full transition duration-200",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          alt={card.alt || card.title || "Card thumbnail"}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
        />
      )}
    </>
  );
});

ImageComponent.displayName = 'ImageComponent';

const SelectedCard = React.memo(({ selected, closeSelected }) => {
  if (!selected) return null;

  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        layoutId={`content-${selected.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative px-8 pb-4 z-[70] max-h-full overflow-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on content
      >
        {selected.content}
      </motion.div>
      
      {/* Close button for accessibility */}
      <button
        className="absolute top-4 right-4 z-[80] w-8 h-8 bg-black bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        onClick={(e) => {
          e.stopPropagation();
          closeSelected();
          // The parent component will handle the close via the global click handler
        }}
        aria-label="Close modal"
        type="button"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.5 3.5a.5.5 0 0 0-.708 0L8 7.293 4.208 3.5a.5.5 0 1 0-.708.708L7.293 8l-3.793 3.793a.5.5 0 0 0 .708.708L8 8.707l3.793 3.793a.5.5 0 0 0 .708-.708L8.707 8l3.793-3.793a.5.5 0 0 0 0-.708z"/>
        </svg>
      </button>
    </div>
  );
});

SelectedCard.displayName = 'SelectedCard';