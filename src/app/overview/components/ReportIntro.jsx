"use client";
import React from "react";
import Image from "next/image";
import coverImage from "../../../../public/introductory/tissue.jpg";

const ReportIntro = () => {
  return (
    <div
      className="relative w-full min-h-screen bg-white overflow-hidden" id="end"
      style={{ fontFamily: "Courier, Courier New, monospace" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={coverImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="opacity-10 grayscale"
          draggable={false}
        />
      </div>

      {/* Project Title Section */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center text-black px-6">
        <h1
          className="text-4xl md:text-[4rem] font-bold mb-4 leading-none"
          style={{ fontFamily: "Courier, Courier New, monospace" }}
        >
          AI-Powered Parkinson's
          <br />
          <span className="text-4xl md:text-[3rem]">Diagnosis</span>
        </h1>
        <p
          className="text-lg md:text-xl leading-relaxed"
          style={{ fontFamily: "Courier, Courier New, monospace" }}
        >
          Revolutionizing Early Detection through Medical Image Analysis
        </p>
      </div>

      <div
        className="relative z-20 bg-black text-white py-12 px-8 md:px-20 mt-[-80px]"
        style={{ fontFamily: "Courier, Courier New, monospace" }}
      >
        <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
        <p className="text-lg leading-relaxed mb-8">
          The main objective of this project is to develop an AI-based diagnostic tool capable of identifying early signs of Parkinson’s disease from SPECT imaging. By leveraging machine learning techniques, we aim to revolutionize early diagnosis and improve treatment outcomes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold mb-4">Data Collection</h3>
            <p>
              We sourced imaging data from the Parkinson's Progression Markers Initiative (PPMI), ensuring high-quality input data for model training and validation.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold mb-4">Model Development</h3>
            <p>
              A 3D ResNet-based architecture was implemented, optimized for image classification, enabling accurate detection of Parkinson’s disease.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold mb-4">Interpretability</h3>
            <p>
              Saliency maps were integrated to visualize areas of high importance within the images, enhancing the interpretability of model predictions.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold mb-4">Results</h3>
            <p>
              Our model achieved state-of-the-art performance, providing a foundation for future research and clinical implementation for early Parkinson's diagnosis.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Conclusion</h3>
          <p className="leading-relaxed">
            This project demonstrates the potential of AI in medical diagnostics, particularly in the early detection of Parkinson's disease. The innovative approach using deep learning models provides insights into medical image analysis, contributing to better patient outcomes and more effective treatments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportIntro;