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
        <Link
          key={p.id}
          href={`/chat/${p.id}`}
          className="p-4 bg-white rounded-xl shadow hover:shadow-md cursor-pointer"
        >
          <p className="font-medium">{p.name}</p>
        </Link>
      ))}
    </div>
  );
}