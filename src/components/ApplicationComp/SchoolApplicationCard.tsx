"use client";

import { School } from "@/app/lib/type";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";

interface SchoolApplicationCardProps {
  school: School;
}

export default function SchoolApplicationCard({ school }: SchoolApplicationCardProps) {
  const router = useRouter();
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'PENDING' | 'REGISTERED' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkApplicationStatus();
  }, [school.id]);

  console.log(school.image);

  const checkApplicationStatus = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/applications/check/${school.id}`);
      if (res.ok) {
        const data = await res.json();
        setHasApplied(data.exists);
        setApplicationStatus(data.status);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (hasApplied && applicationStatus === 'PENDING') {
      // If the student has a pending application, allow them to modify it
      router.push(`/schools/${school.id}/apply`);
    } else if (!hasApplied) {
      // If the student hasn't applied yet, let them create a new application
      router.push(`/schools/${school.id}/apply`);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <span>Chargement...</span>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
        </>
      );
    }

    if (hasApplied) {
      if (applicationStatus === 'PENDING') {
        return (
          <>
            <span>Modifier la candidature</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </>
        );
      } else {
        return (
          <>
            <span>Déjà candidaté</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        );
      }
    }

    return (
      <>
        <span>Postuler</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src={school.image ? BACKEND_URL + school.image : '/images/atlas-schools-Img.jpg'}
          alt={school.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient Overlay */}

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
            disabled={hasApplied && applicationStatus === 'REGISTERED'}
            className={`px-6 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg ${
              hasApplied && applicationStatus === 'REGISTERED'
                ? 'bg-gray-400 cursor-not-allowed'
                : hasApplied && applicationStatus === 'PENDING'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-[#18cb96] hover:bg-[#15b587] text-white'
            }`}
          >
            {getButtonContent()}
          </button>
        </div>
      </div>
    </div>
  );
} 