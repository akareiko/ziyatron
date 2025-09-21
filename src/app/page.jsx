'use client';

import { useAuth } from "../context/AuthContext";
import LayoutWrapper from "../components/LayoutWrapper";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (user) return <LayoutWrapper />;

  return null;
}
