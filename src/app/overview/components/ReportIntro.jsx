"use client";
import React from "react";
import Image from "next/image";
import coverImage from "../../../../public/introductory/hihihi.jpeg";

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
            AI для анализа ЭЭГ
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-sm leading-relaxed text-white mb-12 max-w-4xl mx-auto">
          Инновационная система глубокого обучения для автоматического выявления эпилептических припадков и анализа биоэлектрической активности мозга
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button className="px-4 py-2 text-sm bg-white rounded-full text-black hover:bg-white/90">
            <span className="relative z-10">Начать использование</span>
          </button>
          
          <button className="px-4 py-2 text-sm text-white rounded-full hover:bg-white/10">
            <span className="relative z-10">Посмотреть демо</span>
          </button>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-slate-300">Точность <span className=" font-semibold">99.55%</span></span>
          </div>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-slate-300">Чувствительность <span className=" font-semibold">98.68%</span></span>
          </div>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-slate-300">Специфичность <span className=" font-semibold">99.81%</span></span>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="relative z-20 bg-gradient-to-b from-black via-slate-900 to-black text-white py-8 px-8 md:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 text-white">
            Обзор проекта
          </h2>
          <p className="text-sm leading-relaxed text-white max-w-4xl mx-auto">
            Ziyatron разработан для автоматизированного анализа электроэнцефалограмм (ЭЭГ) и раннего выявления эпилептических припадков. 
            Используя новейшие архитектуры глубокого обучения, он помогает врачам быстрее и точнее ставить диагнозы, снижая нагрузку на специалистов 
            и улучшая качество медицинской помощи.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              title: "Сбор данных",
              content: "Система обрабатывает многоканальные ЭЭГ-сигналы, зарегистрированные с частотой 256 Гц. Данные проходят сегментацию на временные окна и подготовку к дальнейшему анализу, обеспечивая высокую точность работы модели.",
              icon: "📊",
              gradient: "from-blue-600/20 to-cyan-600/20"
            },
            {
              title: "Разработка модели",
              content: "В основе Ziyatron — мультимасштабные сверточные сети в связке с трансформером. Такой подход позволяет улавливать и локальные особенности, и глобальные зависимости сигналов мозга, что обеспечивает практически идеальную точность диагностики.",
              icon: "🧠",
              gradient: "from-purple-600/20 to-pink-600/20"
            },
            {
              title: "Интерпретируемость",
              content: "Система использует карты внимания для выделения ключевых фрагментов ЭЭГ, что делает её прозрачным инструментом: врач может увидеть, какие именно участки сигнала повлияли на решение модели.",
              icon: "🔍",
              gradient: "from-green-600/20 to-emerald-600/20"
            },
            {
              title: "Результаты",
              content: "Ziyatron демонстрирует точность до 99.55%, чувствительность 98.68% и специфичность 99.81%. Эти показатели подтверждают её потенциал как клинического инструмента для диагностики и телемедицины.",
              icon: "🎯",
              gradient: "from-orange-600/20 to-red-600/20"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`group relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-200 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                  {feature.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion Section */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-3xl p-12 border border-slate-700/50 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Заключение
            </h3>
            <p className="text-lg leading-relaxed text-slate-300 max-w-4xl mx-auto mb-8">
              Ziyatron показывает, как искусственный интеллект способен изменить медицинскую диагностику. 
              Система делает анализ ЭЭГ быстрым, точным и доступным, открывая новые возможности для врачей, 
              исследователей и пациентов по всему миру.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300">
              Узнать больше о проекте
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIntro;