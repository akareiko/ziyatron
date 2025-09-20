"use client";
import React, { useRef } from "react";
import { LayoutGrid } from "./LayoutGrid";

const LayoutGridDemo = () => {
  return (
    <div className="h-screen w-full" id="second">
      <LayoutGrid cards={cards} />
    </div>
  );
};

export default LayoutGridDemo;

/* -------------------------------
   Skeleton content components
-------------------------------- */
const SkeletonOne = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white font-sans">
      Diagnostic Accuracy
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
      Ziyatron achieves an accuracy of up to 99.55%, with sensitivity of 98.68% 
      and specificity of 99.81%, demonstrating its reliability in detecting 
      epileptic seizures from EEG signals. The model has been validated on the 
      CHB-MIT and Temple University EEG Corpora, and its effectiveness has been 
      confirmed by local practitioners and physicians.
    </p>
  </div>
);

const SkeletonTwo = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white font-sans">
      Data & Preprocessing
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
      The system processes multichannel EEG recordings at 256 Hz, removes noise 
      and artifacts, normalizes the data, and extracts the most informative 
      segments. This ensures high-quality, real-time analysis.
    </p>
  </div>
);

const SkeletonThree = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white font-sans">
      Epilepsy & Monitoring
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
      Ziyatron is designed to support doctors and specialists by automatically 
      detecting seizures, enabling continuous monitoring, and integrating with 
      telemedicine platforms for remote observation.
    </p>
  </div>
);

const SkeletonFour = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white font-sans">
      Architecture & AI
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
      At the core of Ziyatron are multi-scale convolutional networks and 
      transformers. This architecture captures both local features and global 
      dependencies in EEG signals, ensuring accuracy and interpretability.
    </p>
  </div>
);

const SkeletonOneHeader = () => (
  <p className="md:text-4xl text-xl text-white font-sans">
    Diagnostic Accuracy
  </p>
)
const SkeletonTwoHeader = () => (
  <p className="md:text-4xl text-xl text-white font-sans">
    Data & Preprocessing
  </p>
)
const SkeletonThreeHeader = () => (
  <p className="md:text-4xl text-xl text-white font-sans">
    Epilepsy & Monitoring
  </p>
)
const SkeletonFourHeader = () => (
  <p className="md:text-4xl text-xl text-white font-sans">
    Architecture & AI
  </p>
)

/* -------------------------------
   Card data
-------------------------------- */
const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    header: <SkeletonOneHeader />,
    className: "md:col-span-2",
    thumbnail:
      "https://assets.kimshospitals.com/images/blogs/75_1573199315.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    header: <SkeletonTwoHeader />, 
    className: "col-span-1",
    thumbnail: "/introductory/eeg_waves.jpg", // ✅ use /public folder path
  },
  {
    id: 3,
    content: <SkeletonThree />,
    header: <SkeletonThreeHeader />,
    className: "col-span-1",
    thumbnail: "/introductory/eeg_monitoring.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    header: <SkeletonFourHeader />,
    className: "md:col-span-2",
    thumbnail:
      "https://static.scientificamerican.com/sciam/cache/file/E6AEDA9A-A91E-45C2-977EAA3C3185D55E_source.jpg",
  },
];