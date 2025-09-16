import { Geist, Geist_Mono, Aleo, Rubik } from "next/font/google";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const aleo = Aleo({
  variable: "--font-aleo",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ziyatron",
  description: "AI-powered EEG analysis platform for detecting and monitoring seizures in real-time.",
  icons: {
      icon: "/icon.ico",
    },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Ziyatron",
    description: "Detect and monitor seizures accurately with AI-powered EEG analysis.",
    url: "https://yourdomain.com",
    siteName: "Ziyatron",
    images: [
      {
        url: "/og-image.png", // replace with your actual image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziyatron",
    description: "AI-powered EEG analysis to detect seizures in real-time.",
    image: "/og-image.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${geistSans.variable} ${geistMono.variable} ${aleo.variable} ${rubik.variable} antialiased`}>
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}