"use client";

import Scroll from "./components/Scroll";
import LayoutGridDemo from "./components/LayoutGridDemo";
import ReportIntro from "./components/ReportIntro"
import PresentationPage from "./components/PresentationPage"
import Navbar from "./components/Navbar"

export default function Home() {
  return (
    <main className="rubik-text bg-black">
      <Navbar />
      <Scroll />
      <ReportIntro />
      <LayoutGridDemo />
      <PresentationPage />
    </main>
  );
}
