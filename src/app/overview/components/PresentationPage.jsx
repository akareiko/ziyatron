"use client";
import React from "react";
import Image from "next/image";
import overview_modelarch from "../../../../public/introductory/overview_modelarch.png";

const PresentationPage = () => {
  return (
    <div
      className="w-full min-h-screen bg-white text-black overflow-hidden"
      style={{ fontFamily: "Courier, Courier New, monospace" }}
    >
      {/* Intro Section */}
      <section id="intro" className="relative flex flex-col items-center justify-center h-screen text-center p-8 bg-black text-white">
        <h1 className="text-4xl md:text-[4rem] font-bold leading-none">
          Ziyatron: AI для анализа ЭЭГ
        </h1>
        <p className="mt-4 text-xl">
          Инновационная система глубокого обучения для автоматического выявления эпилептических припадков и анализа биоэлектрической активности мозга.
        </p>
      </section>

      {/* Web Development Section */}
      <section id="webdev" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Интерфейс и доступность</h2>
          <p className="text-lg">
            Ziyatron предлагает удобный веб-интерфейс для загрузки, анализа и визуализации ЭЭГ-записей. 
            Врачи и исследователи могут удалённо получать результаты диагностики в режиме реального времени, 
            что делает систему доступной как в клиниках, так и в образовательных и исследовательских центрах.
          </p>
        </div>
        <div className="md:w-1/2">
          {/* <Image
            src={spectImage}
            alt="Web Development"
            className="rounded-xl object-cover"
            draggable={false}
          /> */}
        </div>
      </section>

      {/* Data Preprocessing Section */}
      <section id="dataprep" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8 bg-black text-white">
        <div className="md:w-1/2 p-6 order-2 md:order-1">
          <h2 className="text-3xl font-bold mb-4">Предобработка данных</h2>
          <p className="text-lg">
            Система автоматически обрабатывает ЭЭГ-сигналы: удаляет артефакты, фильтрует шумы, нормализует данные и 
            выделяет информативные участки. Такой многоэтапный подход обеспечивает высокое качество данных для анализа 
            и гарантирует устойчивость модели к реальным клиническим условиям.
          </p>
        </div>
        <div className="md:w-1/2 order-1 md:order-2">
          {/* <Image
            src={control}
            alt="Data Preprocessing"
            className="rounded-xl object-cover"
            draggable={false}
          /> */}
        </div>
      </section>

      {/* Model Building Section */}
      <section id="modelbuild" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Модель Ziyatron</h2>
          <p className="text-lg">
            В основе Ziyatron лежит мультимасштабная архитектура глубокого обучения, сочетающая свёрточные сети и трансформеры. 
            Она улавливает как локальные детали, так и глобальные связи в ЭЭГ-сигналах. 
            Благодаря этому модель достигает точности до 99.55% и способна работать в реальном времени.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src={overview_modelarch}
            alt="Model Architecture"
            className="rounded-xl object-cover"
            draggable={false}
          />
        </div>
      </section>

      {/* Visualization Section */}

        <section id="visua" className="relative flex flex-col md:flex-row items-center justify-center h-screen p-8 bg-black text-white">
        <div className="md:w-1/2 p-6 order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">Интерпретация и визуализация</h2>
            <p className="text-lg">
              Ziyatron не только классифицирует припадки, но и объясняет свои решения. 
              С помощью карт внимания и визуальных подсказок врач может увидеть, какие участки сигнала стали ключевыми для диагностики. 
              Это повышает доверие к системе и делает её прозрачным инструментом для клинической практики.
            </p>
        </div>
        <div className="md:w-1/2 order-1 md:order-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-center">
            {/* <Image
                src={original}
                alt="Original Image"
                width={1162}
                height={960}
                className="rounded-xl object-cover"
                draggable={false}
            /> */}
            </div>
            <div className="flex justify-center">
            {/* <Image
                src={third}
                alt="Saliency Map"
                width={1162}
                height={960}
                className="rounded-xl object-cover"
                draggable={false}
            /> */}
            </div>
            <div className="flex justify-center">
            {/* <Image
                src={second}
                alt="Overlay"
                width={1162}
                height={960}
                className="rounded-xl object-cover"
                draggable={false}
            /> */}
            </div>
        </div>
        </section>


    </div>
  );
};

export default PresentationPage;