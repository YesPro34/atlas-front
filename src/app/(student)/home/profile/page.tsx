"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface UserProfile {
  fullName: string;
  codeMassar: string;
  bacOption: string;
  city: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const mockProfile: UserProfile = {
          fullName: "John Doe",
          codeMassar: "R130456789",
          bacOption: "Sciences Mathématiques A",
          city: "Casablanca"
        };
        setProfile(mockProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#19154e]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#18cb96]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#19154e]">
        <p className="text-red-500">Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#19154e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#19154e]">Mon Profile</h1>
            <div className="h-1 w-20 bg-[#18cb96] mx-auto mt-2 rounded-full"></div>
          </div>

          {/* Profile Content */}
          <div className="flex flex-col items-center gap-8">
            {/* Avatar Section */}
            <div className="w-32 h-32 flex items-center justify-center bg-[#19154e]/10 rounded-full border-4 border-[#18cb96] shadow-lg">
              <FontAwesomeIcon 
                icon={faUser} 
                className="h-16 w-16 text-[#19154e]"
              />
            </div>

            {/* Information Section */}
            <div className="w-full space-y-6">
              <div className="space-y-4">
                <InfoItem label="Nom Complet" value={profile.fullName} />
                <InfoItem label="Code Massar" value={profile.codeMassar} />
                <InfoItem label="Option Bac" value={profile.bacOption} />
                <InfoItem label="Ville" value={profile.city} />
              </div>

              <button 
                className="mt-6 w-full px-6 py-3 bg-[#18cb96] text-white rounded-lg hover:bg-[#15b587] transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Modifier Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-medium text-[#19154e]">{value}</p>
    </div>
  );
} 