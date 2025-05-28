"use client";

import { School } from "@/app/lib/type";
import { useRouter } from "next/navigation";

interface SchoolApplicationCardProps {
  school: School;
}

export default function SchoolApplicationCard({ school }: SchoolApplicationCardProps) {
  const router = useRouter();

  const handleApplyClick = () => {
    router.push(`/schools/${school.id}/apply`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{school.name}</h2>
      <p className="text-gray-600 mb-4">{school.type.code}</p>
      <div className="flex justify-end">
        <button
          onClick={handleApplyClick}
          className="px-4 py-2 bg-[#0ab99d] text-white rounded-md hover:bg-[#099881] transition-colors"
        >
          Postuler
        </button>
      </div>
    </div>
  );
} 