"use client"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../store/store"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { loginSuccess } from "../store/authSlice";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-screen font-sans">
      
        {/* Left Section - Logo and Description */}
        <div className="bg-[#19154e] text-white flex flex-col px-4 sm:px-8 md:px-10 py-8 md:py-0 relative min-h-[300px] justify-between">
          <div className="text-left">
            {/* Logo Placeholder */}
            <Link href="/">
                <div className="mb-4 flex justify-start">
                <img src="/images/white-logo.png" alt="Logo" className="w-24 h-24 sm:w-32 sm:h-32 md:w-1/3 md:h-1/3 object-contain" />
                </div>
            </Link>
            <div className="ml-0 md:ml-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[#08b89d]">
                Bienvenue sur la plateforme Atlas Tawjih
                </h1>
                <p className="text-sm sm:text-md md:text-lg">
                Nous nous intéressons aux activités interactives et scientifiques qui accompagnent les programmes éducatifs, 
                visant à renforcer la relation des étudiants avec leurs programmes et à accroître leur engagement.
                </p>
            </div>
          </div>
  
          {/* Footer Icons */}
          <div className="flex mt-8 md:mt-0 md:justify-center gap-4 text-xl sm:text-2xl">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
  
        {/* Right Section - Login Form */}
        <div className="bg-white flex flex-col justify-center items-center px-4 sm:px-8 py-8 md:py-0">
          <div className="w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Connexion à votre compte
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Veuillez saisir vos informations pour accéder à votre espace.
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    )
}