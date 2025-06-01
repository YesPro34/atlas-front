"use client";

import { School } from "@/app/lib/type";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SchoolApplicationCardProps {
  school: School;
}

export default function SchoolApplicationCard({ school }: SchoolApplicationCardProps) {
  const router = useRouter();

  const handleApplyClick = () => {
    router.push(`/schools/${school.id}/apply`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src="/images/atlas-schools-Img.jpg"
          alt={school.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#19154e]/80 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 relative">
        {/* School Type Badge */}
        <div className="absolute -top-4 right-6 bg-[#18cb96] text-white px-4 py-1 rounded-full text-sm font-medium">
          {school.type.code}
        </div>

        {/* School Name */}
        <h2 className="text-2xl font-bold text-[#19154e] mb-4 mt-2">{school.name}</h2>

        {/* Status and Apply Button */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${school.isOpen ? 'bg-[#18cb96]' : 'bg-red-500'} mr-2`}></div>
            <span className={`text-sm ${school.isOpen ? 'text-[#18cb96]' : 'text-red-500'}`}>
              {school.isOpen ? 'Ouvert aux candidatures' : 'Fermé'}
            </span>
          </div>
          <button
            onClick={handleApplyClick}
            className="px-6 py-2 bg-[#18cb96] text-white rounded-lg hover:bg-[#15b587] transition-colors duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <span>Postuler</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 