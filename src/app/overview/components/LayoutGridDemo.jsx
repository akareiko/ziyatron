"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "./LayoutGrid";
import heh from "../../../../public/introductory/asdasd.jpg"

const LayoutGridDemo = () => {
  return (
    <div className="h-screen py-20 w-full" id="second">
      <LayoutGrid cards={cards} />
    </div>
  );
}

export default LayoutGridDemo;

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white font-sans">
        Точность диагностики
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
        Ziyatron демонстрирует точность до 99.55%, чувствительность 98.68% и специфичность 99.81%. 
        Эти показатели подтверждают её надёжность в выявлении эпилептических припадков по ЭЭГ-сигналам.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white font-sans">
        Данные и предобработка
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
        Система обрабатывает многоканальные ЭЭГ-записи с частотой 256 Гц, удаляет шумы и артефакты, 
        нормализует данные и выделяет информативные участки. Это обеспечивает высокое качество анализа в реальном времени.
      </p>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white font-sans">
        Эпилепсия и мониторинг
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
        Ziyatron предназначен для помощи врачам и пациентам: он способен автоматически выявлять припадки, 
        вести мониторинг и интегрироваться в телемедицинские платформы для удалённого наблюдения.
      </p>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white font-sans">
        Архитектура и ИИ
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-sans">
        В основе Ziyatron — мультимасштабные сверточные сети и трансформеры. 
        Такая архитектура позволяет улавливать как локальные особенности, так и глобальные зависимости в ЭЭГ-сигналах, 
        обеспечивая точность и интерпретируемость.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "https://assets.kimshospitals.com/images/blogs/75_1573199315.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "https://i.pinimg.com/1200x/02/51/33/025133c4bef11872b9c8b45ed75f6e5c.jpg",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "https://static.independent.co.uk/s3fs-public/thumbnails/image/2011/01/01/16/526913_1.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "https://static.scientificamerican.com/sciam/cache/file/E6AEDA9A-A91E-45C2-977EAA3C3185D55E_source.jpg",
  },
];
