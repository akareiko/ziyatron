// Scroll.jsx - Production Ready with Custom Positioning
"use client";
import React, { Suspense } from "react";
import { ContainerScroll } from "./ContainerScroll";
import Image from "next/image";
import tissue from "../../../../public/introductory/tissue.jpg";
import dynamic from "next/dynamic";

// Lazy load KekTwo component to improve initial load performance
const KekTwo = dynamic(() => import("../components/KekTwo"), {
  loading: () => <div className="w-full h-full bg-black/20 animate-pulse" />,
  ssr: false, // Disable SSR for Spline components
});

const Scroll = () => {
  return (
    <div className="relative bg-black min-h-screen overflow-hidden" id="start">
      {/* KekTwo positioned at 60% height from top */}
      <div className="absolute inset-0 w-full h-[80vh] top-0">
        <Suspense fallback={<div className="w-full h-full bg-black/20" />}>
          <KekTwo />
        </Suspense>
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 min-h-screen">
        <ContainerScroll
          titleComponent={
            <div className="absolute top-0 left-0 w-full h-[100vh] flex items-center justify-center">
              <div className="text-center px-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-sans leading-tight drop-shadow-2xl">
                  AI powered medical assistance tool
                  <br />
                  <span className="text-7xl sm:text-5xl md:text-6xl lg:text-[6rem] mt-2 leading-none font-sans block text-white drop-shadow-lg">
                    Ziyatron
                  </span>
                </h1>
              </div>
            </div>
          }
          cardStartHeight={50} // Pass the card start position
        >
          <div className="relative w-full h-full">
            <Image
              src={tissue}
              alt="Medical tissue analysis visualization showing cellular structures"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
              priority
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2G3gY8YGMThkEBB8+8xfBcNGVhEPPIaQFxhogYJ/Ul7EgtL65xCLMqKYfCpqGkhGg="
            />
            {/* Subtle overlay for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none" />
          </div>
        </ContainerScroll>
      </div>
    </div>
  );
};

export default React.memo(Scroll);