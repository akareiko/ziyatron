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
          <h2 className="text-3xl font-bold mb-4">Интерфейс и доступность</h2>
          <p className="text-lg">
            Ziyatron предлагает удобный веб-интерфейс для загрузки, анализа и визуализации ЭЭГ-записей. 
            Врачи и исследователи могут удалённо получать результаты диагностики в режиме реального времени, 
            что делает систему доступной как в клиниках, так и в образовательных и исследовательских центрах.
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
              className="w-[30vw] h-[40vh] absolute z-10 rounded-2xl object-cover mb-6"
              draggable={false}
              autoPlay
              muted
              loop
              playsInline
            />
        </div>
      </section>

      {/* Data Collection Section */}
      <section
        id="datacollection"
        className="relative flex flex-col md:flex-row overflow-hidden items-center justify-center h-screen p-8 m-5 rounded-xl bg-[#111111] border border-white/20 text-white"
      >
        <div className="md:w-1/2 relative flex justify-center items-center">
          <Image
            src={baground2}
            alt=""
            className="absolute w-[35vw] h-[35vw] rounded-xl object-cover"
            draggable={false}
            />
          <Image
            src={add_patient}
            alt="Data Collection"
            className="w-[25vw] h-[25vw] absolute z-10 rounded-2xl object-fill"
            draggable={false}
          />
        </div>
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Сбор данных</h2>
          <p className="text-lg">
            Ziyatron интегрируется с современными системами регистрации ЭЭГ, 
            позволяя загружать данные из разных источников — от клинических приборов 
            до исследовательских установок. Это обеспечивает гибкость и совместимость 
            с существующей медицинской инфраструктурой.
          </p>
        </div>
      </section>

      {/* Data Preprocessing Section */}
      <section id="dataprep" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8 bg-black text-white">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Предобработка данных</h2>
          <p className="text-lg">
            Система автоматически обрабатывает ЭЭГ-сигналы: удаляет артефакты, фильтрует шумы, нормализует данные и 
            выделяет информативные участки. Такой многоэтапный подход обеспечивает высокое качество данных для анализа 
            и гарантирует устойчивость модели к реальным клиническим условиям.
          </p>
        </div>
        <div className="md:w-1/2 relative flex justify-center items-center">
          <Image
            src={baground4}
            alt=""
            className="absolute w-[35vw] h-[35vw] rounded-xl object-cover"
            draggable={false}
            />
          <Image
            src={eeg_segmentation}
            alt="Data Preprocessing"
            className="w-[30vw] h-[10vw] absolute z-10 rounded-2xl object-fill"
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
            className="absolute w-[35vw] h-[35vw] rounded-xl object-cover"
            draggable={false}
            />
          <Image
            src={overview_modelarch}
            alt="Model Architecture"
            className="w-[30vw] h-[10vw] absolute z-10 rounded-2xl object-fill"
            draggable={false}
          />
        </div>
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Модель Ziyatron</h2>
          <p className="text-lg">
            В основе Ziyatron лежит мультимасштабная архитектура глубокого обучения, сочетающая свёрточные сети и трансформеры. 
            Она улавливает как локальные детали, так и глобальные связи в ЭЭГ-сигналах. 
            Благодаря этому модель достигает точности до 99.55% и способна работать в реальном времени.
          </p>
        </div>
      </section>

      {/* Visualization Section */}

      <section id="visua" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8 bg-black text-white">
        <div className="md:w-1/2 p-6">
            <h2 className="text-3xl font-bold mb-4">Интерпретация и визуализация</h2>
            <p className="text-lg">
              Ziyatron не только классифицирует припадки, но и объясняет свои решения. 
              С помощью карт внимания и визуальных подсказок врач может увидеть, какие участки сигнала стали ключевыми для диагностики. 
              Это повышает доверие к системе и делает её прозрачным инструментом для клинической практики.
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
              className="w-[30vw] h-[40vh] absolute z-10 rounded-2xl object-cover mb-6"
              draggable={false}
              autoPlay
              muted
              loop
              playsInline
            />
        </div>
      </section>
    </div>
  );
};

export default PresentationPage;