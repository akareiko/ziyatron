'use client';
import { useAuth } from "../context/AuthContext";
import LayoutWrapper from "../components/LayoutWrapper";
import LandingPage from "../components/LandingPage";

// ---------------------
// Main Page Component
export default function Page({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (user) return <LayoutWrapper>{children}</LayoutWrapper>;

  return (
    <LandingPage />
  );
}