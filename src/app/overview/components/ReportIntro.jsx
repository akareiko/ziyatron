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
          Ziyatron:
          <br />
          <span className="text-4xl md:text-[3rem]">AI для анализа ЭЭГ</span>
        </h1>
        <p
          className="text-lg md:text-xl leading-relaxed"
          style={{ fontFamily: "Courier, Courier New, monospace" }}
        >
          Инновационная система глубокого обучения для автоматического выявления эпилептических припадков и анализа биоэлектрической активности мозга.
        </p>
      </div>

      <div
        className="relative z-20 bg-black text-white py-12 px-8 md:px-20 mt-[-80px]"
        style={{ fontFamily: "Courier, Courier New, monospace" }}
      >
        <h2 className="text-3xl font-bold mb-6">Обзор проекта</h2>
        <p className="text-lg leading-relaxed mb-8">
          Ziyatron разработан для автоматизированного анализа электроэнцефалограмм (ЭЭГ) и раннего выявления эпилептических припадков. 
          Используя новейшие архитектуры глубокого обучения, он помогает врачам быстрее и точнее ставить диагнозы, снижая нагрузку на специалистов 
          и улучшая качество медицинской помощи.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold mb-4">Сбор данных</h3>
            <p>
              Система обрабатывает многоканальные ЭЭГ-сигналы, зарегистрированные с частотой 256 Гц. 
              Данные проходят сегментацию на временные окна и подготовку к дальнейшему анализу, обеспечивая высокую точность работы модели.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold mb-4">Разработка модели</h3>
            <p>
              В основе Ziyatron — мультимасштабные сверточные сети в связке с трансформером. 
              Такой подход позволяет улавливать и локальные особенности, и глобальные зависимости сигналов мозга, 
              что обеспечивает практически идеальную точность диагностики.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold mb-4">Интерпретируемость</h3>
            <p>
              Система использует карты внимания для выделения ключевых фрагментов ЭЭГ, 
              что делает её прозрачным инструментом: врач может увидеть, какие именно участки сигнала повлияли на решение модели.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-bold mb-4">Результаты</h3>
            <p>
              Ziyatron демонстрирует точность до 99.55%, чувствительность 98.68% и специфичность 99.81%. 
              Эти показатели подтверждают её потенциал как клинического инструмента для диагностики и телемедицины.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Заключение</h3>
          <p className="leading-relaxed">
            Ziyatron показывает, как искусственный интеллект способен изменить медицинскую диагностику. 
            Система делает анализ ЭЭГ быстрым, точным и доступным, открывая новые возможности для врачей, 
            исследователей и пациентов по всему миру.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportIntro;