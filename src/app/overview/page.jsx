"use client";

import Scroll from "./components/Scroll";
import LayoutGridDemo from "./components/LayoutGridDemo";
import ReportIntro from "./components/ReportIntro"
import PresentationPage from "./components/PresentationPage"

export default function Home() {
  return (
    <main className="rubik-text">
      <Scroll />
      <LayoutGridDemo />
      <ReportIntro />
      <PresentationPage />
    </main>
  );
}
