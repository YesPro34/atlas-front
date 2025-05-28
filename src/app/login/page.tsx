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
        <div className="grid grid-cols-2 h-screen font-sans">
      
        {/* Left Section - Logo and Description */}
        <div className="bg-[rgb(24,23,29)] text-white flex flex-col  px-10 relative">
          <div className="text-left">
            {/* Logo Placeholder */}
            <Link href="/">
                <div className="mb-4">
                <img src="/images/white-logo.png" alt="Logo" className="w-1/3 h-1/3" />
                </div>
            </Link>
            <div className="ml-8">
                <h1 className="text-3xl font-bold mb-4">
                Bienvenue sur la plateforme Atlas Tawjih
                </h1>
                <p className="text-md">
                Nous nous intéressons aux activités interactives et scientifiques qui accompagnent les programmes éducatifs, 
                visant à renforcer la relation des étudiants avec leurs programmes et à accroître leur engagement.
                </p>
            </div>
          </div>
  
          {/* Footer Icons */}
          <div className="flex absolute bottom-30 left-70 gap-15 ml-8 space-x-4 text-2xl">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
  
        {/* Right Section - Login Form */}
        <div className="bg-white flex flex-col justify-center items-center px-8">
          <div className="w-full max-w-[80%]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Connexion à votre compte
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Veuillez saisir vos informations pour accéder à votre espace.
            </p>
            <LoginForm />
             {/**
                          <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Code Massar
                </label>
                <input
                  onChange={(e) => setCodeMassarText(e.target.value)}
                  required
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 "
                />
              </div>
  
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                required
                onChange={(e) => setPasswordText(e.target.value)}
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 mb-6 focus:outline-none focus:ring-2 "
                />
              </div>
              {/*   
              <div className="text-right mb-6">
                <a href="#" className="text-sm text-[#0ab99d] hover:underline">
                  Mot de passe oublié ?
                </a>
              </div> 
  
                <button
                type="submit"
                className="w-[25%] bg-[#0ab99d] text-white py-2 rounded hover:bg-[#036958] transition cursor-pointer"
                >
                Se connecter
              </button>
              {error && (
                <div className="text-red-500 text-bold mt-5">
                    - {error}
                </div>
              )}
            </form>
  
    
              */}

            {/* <p className="text-center text-sm text-gray-600 mt-6">
              Nouveau utilisateur ?{" "}
              <a href="#" className="text-[#0ab99d] hover:underline">
                Créer un compte
              </a>
            </p> */}
          </div>
        </div>
      </div>
    )
}