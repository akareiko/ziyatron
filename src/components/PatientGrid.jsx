import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { getPatients } from "../lib/api";

export default function PatientGrid() {
  const [patients, setPatients] = useState([]);
  const { user, token, logout } = useAuth();

  useEffect(() => {
      if (!user) return;
      const fetchPatients = async () => {
        try {
          const data = await getPatients(token);
          setPatients(data);
        } catch (err) {
          console.error(err);
          if (err.message === "Unauthorized") logout();
        }
      };
      fetchPatients();
    }, [user]);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
      {patients.map((p) => (
        <div key={p.id} className="relative group">
          {/* Lower “shadow” div */}
          <div className="absolute top-0.5 left-0.5 w-full h-32 p-4 bg-gray-100 rounded-xl border border-gray-300
                          transition-transform duration-200 ease-out
                          group-hover:translate-x-0.5 group-hover:translate-y-0.5"></div>

          {/* Main clickable Link on top */}
          <Link
            href={`/chat/${p.id}`}
            className="relative z-5 p-4 bg-gray-100 rounded-xl hover:bg-white cursor-pointer border border-gray-300 h-32 flex flex-col justify-between transition-all duration-200"
          >
            <p className=" font-bold truncate">{p.name}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{p.condition}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}