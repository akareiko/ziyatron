"use client";
import React from "react";
import { ContainerScroll } from "./ContainerScroll";
import Image from "next/image";
import tissue from "../../../../public/introductory/tissue.jpg"
import KekTwo from "../components/KekTwo";

const Scroll = () => {
  return (
    <div className="relative bg-black" id="start">
      <div className="absolute">
        <KekTwo />
      </div>
      <div className="z-10">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl  text-white font-sans">
                AI powered medical assistance tool<br />
                <span className="text-4xl md:text-[6rem]  mt-1 leading-none font-sans">
                  Ziyatron
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={tissue}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </div>
  );
}

export default Scroll;