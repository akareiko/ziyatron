"use client";
import React from "react";
import Image from "next/image";
import qrImage from "../../../../public/introductory/qr.png";

const ContactPage = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white" id="contact">

      {/* Optional Background Image Overlay */}
      {/* 
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src={coverImage}
          alt="Background"
          fill
          className="object-cover object-center"
          draggable={false}
        />
      </div>
      */}

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Brand Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-4">
            <span className="text-sm font-medium text-white">Ziyatron</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Contact Us
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base leading-relaxed text-slate-300 mb-12 max-w-2xl mx-auto">
          Let’s connect. Reach out for collaborations, research partnerships, or technical support.
        </p>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <Image
                src={qrImage}
                alt="QR Code"
                fill
                className="object-contain rounded-xl border border-white/10 shadow-md"
              />
            </div>
            <span className="text-sm text-slate-300">Scan QR to Connect</span>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-start gap-4 text-left">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
              <a
                href="mailto:nurgazy.sanzhar@gmail.com"
                className="text-slate-300 hover:text-white transition-colors"
              >
                nurgazy.sanzhar@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
              <a
                href="tel:+77071234567"
                className="text-slate-300 hover:text-white transition-colors"
              >
                +7 (708) 839 8395
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
              <p className="text-slate-300">Almaty, Kazakhstan</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mt-12">
          <a
            href="mailto:nurgazy.sanzhar@gmail.com"
            className="px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-white/90 transition-all"
          >
            Send Email
          </a>
          <a
            href="#"
            className="px-4 py-2 text-sm text-white rounded-full border border-white/20 hover:bg-white/10 transition-all"
          >
            Follow on LinkedIn
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 text-center py-6 border-t border-white/10 mt-12">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Ziyatron. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ContactPage;