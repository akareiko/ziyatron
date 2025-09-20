"use client";
import React from "react";
import Image from "next/image";
import overview_modelarch from "../../../../public/introductory/overview_modelarch.png";
import eeg_segmentation from "../../../../public/introductory/eeg_segmentation.png";
import main_page from "../../../../public/introductory/main_page.png";
import add_patient from "../../../../public/introductory/add_patient.png";
import baground1 from "../../../../public/introductory/baground1.jpg"
import baground2 from "../../../../public/introductory/baground2.jpg"
import baground3 from "../../../../public/introductory/baground3.jpg"
import baground4 from "../../../../public/introductory/baground4.jpg"

const PresentationPage = () => {
  return (
    <div
      className="w-full min-h-screen text-black overflow-hidden"
    >

      {/* Web Development Section */}
      <section id="webdev" className="relative flex text-white flex-col md:flex-row bg-black items-center justify-center h-screen p-8">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Interface & Accessibility</h2>
          <p className="text-lg">
            Ziyatron offers an intuitive web interface for uploading, analyzing, and visualizing EEG recordings. 
            Doctors and researchers can access diagnostic results remotely in real time, making the system 
            available not only in clinics but also in educational and research centers.
          </p>
        </div>
        <div className="md:w-1/2 relative flex justify-center items-center">
          <Image
            src={baground1}
            alt=""
            className="w-[35vw] h-[35vw] absolute rounded-xl object-cover"
            draggable={false}
            />
          <video
              src="/introductory/file_upload.mp4"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 md:w-13/20 rounded-lg shadow-lg"
              draggable={false}
              autoPlay
              muted
              loop
              playsInline
            />
        </div>
      </section>

      {/* Data Collection Section */}
      <section id="datacollection" className="relative flex flex-col md:flex-row overflow-hidden items-center justify-center h-screen p-8 m-5 rounded-xl bg-[#111111] border border-white/20 text-white">
        <div className="md:w-1/2 relative flex justify-center items-center">
          {/* Background frame image */}
          <Image
            src={baground2}
            alt=""
            className="absolute w-[35vw] h-auto max-h-[80vh] rounded-xl object-contain"
            draggable={false}
          />

          {/* Centered overlay image */}
          <Image
            src={add_patient}
            alt="Data Collection"
            className="absolute z-10 w-[25vw] h-auto rounded-2xl object-contain"
            draggable={false}
          />
        </div>
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Data Collection</h2>
          <p className="text-lg">
            Ziyatron integrates with modern EEG recording systems, allowing data to be uploaded from various sources—from clinical devices to research setups. 
            This ensures flexibility and compatibility with existing medical infrastructure.
          </p>
        </div>
      </section>

      {/* Data Preprocessing Section */}
      <section id="dataprep" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8 bg-black text-white">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Data Preprocessing</h2>
          <p className="text-lg">
            The system automatically processes EEG signals by removing artifacts, filtering noise, normalizing data, and extracting the most informative segments. 
            This multi-step approach ensures high-quality data for analysis and guarantees the model’s robustness under real clinical conditions.
          </p>
        </div>
        <div className="md:w-1/2 relative flex justify-center items-center">
          <Image
            src={baground4}
            alt=""
            className="absolute w-[35vw] h-auto rounded-xl object-cover"
            draggable={false}
            />
          <Image
            src={eeg_segmentation}
            alt="Data Preprocessing"
            className="w-[30vw] h-auto absolute z-10 rounded-2xl object-fill"
            draggable={false}
          />
        </div>
      </section>

      {/* Model Building Section */}
      <section id="modelbuild" className="relative flex flex-col md:flex-row items-center justify-center m-5 rounded-xl bg-[#111111] border border-white/20 text-white h-screen p-8">
      <div className="md:w-1/2 relative flex justify-center items-center">
          <Image
            src={baground3}
            alt=""
            className="absolute w-[35vw] h-auto rounded-xl object-cover"
            draggable={false}
            />
          <Image
            src={overview_modelarch}
            alt="Model Architecture"
            className="w-[30vw] h-auto absolute z-10 rounded-2xl object-fill"
            draggable={false}
          />
        </div>
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">The Ziyatron Model</h2>
          <p className="text-lg">
            At the core of Ziyatron is a multi-scale deep learning architecture combining convolutional networks and transformers. 
            It captures both local details and global dependencies in EEG signals. 
            This enables the model to achieve up to 99.55% accuracy while operating in real time.
          </p>
        </div>
      </section>

      {/* Visualization Section */}
      <section id="visua" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8 bg-black text-white">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Interpretation & Visualization</h2>
          <p className="text-lg">
            Ziyatron not only classifies seizures but also explains its decisions. 
            Using attention maps and visual cues, doctors can see which parts of the EEG signal were critical for the diagnosis. 
            This enhances trust in the system and makes it a transparent tool for clinical practice.
          </p>
        </div>
        <div className="md:w-1/2 relative flex justify-center items-center">
          <Image
            src={baground1}
            alt=""
            className="w-[35vw] h-[35vw] absolute rounded-xl object-cover"
            draggable={false}
            />
          <video
              src="/introductory/gpt_response.mp4"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 md:w-13/20 rounded-lg shadow-lg"
              draggable={false}
              autoPlay
              muted
              loop
              playsInline
            />
        </div>
      </section>
      
      {/*	Overview & Navigation */}
      <section id="overview" className="relative flex flex-col md:flex-row items-center justify-center m-5 rounded-xl bg-[#111111] border border-white/20 text-white h-screen p-8">
        <div className="md:w-1/2 relative flex justify-center items-center">
          <Image
            src={baground4}
            alt=""
            className="absolute w-[35vw] h-auto rounded-xl object-cover"
            draggable={false}
            />
          <Image
            src={main_page}
            alt="Overview & Navigation"
            className="w-[30vw] h-auto absolute z-10 rounded-2xl object-fill"
            draggable={false}
          />
        </div>
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Overview & Navigation</h2>
          <p className="text-lg">
            The Ziyatron main page displays all patients in a clear grid with names and key information. Doctors can quickly open chats for each patient and create new profiles directly from the page, streamlining workflow and access.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PresentationPage;