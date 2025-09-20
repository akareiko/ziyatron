"use client";


import { useState } from "react";
import Scroll from "./components/Scroll";
import LayoutGridDemo from "./components/LayoutGridDemo";
import ReportIntro from "./components/ReportIntro"
import PresentationPage from "./components/PresentationPage"
import Navbar from "./components/Navbar"

export default function OverviewPage() {
  // State to track which menu is active
  const [activeSection, setActiveSection] = useState("About"); // default is "About"

  return (
    <main className="rubik-text bg-black min-h-screen">
      {/* Pass state setter to Navbar so menu can control which section to show */}
      <Navbar setActiveSection={setActiveSection} />

      {/* Conditional rendering */}
      {activeSection === "About" && (
        <>
          <Scroll />
          <ReportIntro />
          <LayoutGridDemo />
        </>
      )}

      {activeSection === "Learn" && <PresentationPage />}
    </main>
  );
}