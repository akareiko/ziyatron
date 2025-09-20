"use client";
import React from "react";

const ReportIntro = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden" id="end">

      {/* Optional Background Image Overlay */}
      {/* Uncomment if you want to use the background image */}
      {/* <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src={coverImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          draggable={false}
        />
      </div> */}

      {/* Project Title Section */}
      <div className="relative z-10 flex flex-col items-center h-screen justify-center text-center text-white px-6">
        {/* Brand Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-4">
            <span className="text-sm font-medium text-white">Ziyatron</span>
          </span>
        </div>

        {/* Main Title with Gradient Text */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-none">
          <span className="text-white">
            Revolutionizing EEG with AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-sm leading-relaxed text-white mb-12 max-w-4xl mx-auto">
          An innovative deep learning system for automatic detection of epileptic seizures and advanced analysis of brain bioelectrical activity
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button className="px-4 py-2 text-sm bg-white rounded-full text-black hover:bg-white/90">
            <span className="relative z-10">Get Started</span>
          </button>
          
          <button className="px-4 py-2 text-sm text-white rounded-full hover:bg-white/10">
            <span className="relative z-10">Watch Demo</span>
          </button>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-slate-300">Accuracy <span className=" font-semibold">99.55%</span></span>
          </div>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-slate-300">Sensitivity <span className=" font-semibold">98.68%</span></span>
          </div>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-slate-300">Specificity <span className=" font-semibold">99.81%</span></span>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="relative z-20 bg-black text-white px-8 md:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 text-white">
            Project Overview
          </h2>
          <p className="text-sm leading-relaxed text-white max-w-4xl mx-auto">
            Ziyatron is designed for automated analysis of electroencephalograms (EEG) and early detection of epileptic seizures. 
            Powered by state-of-the-art deep learning architectures, it helps doctors deliver faster and more accurate diagnoses, 
            reduces the workload on specialists, and enhances the quality of patient care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportIntro;