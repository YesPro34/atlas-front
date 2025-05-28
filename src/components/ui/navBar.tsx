import { getSession } from "@/app/lib/session";
import LogInButtonClient from "../LogInButtonClient";
import Link from "next/link";

export default async function NavBar() {
    const session = await getSession();
    return(
           <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                {/* Left side - Logo and User info */}
                <div className="flex items-center space-x-6">
                    {/* Logo placeholder - replace with your actual logo */}
                    <Link href="/home" className="flex items-center">
                        <div className="font-bold text-xl text-gray-800">
                            <span className="text-[#06b89d]">Atlas</span>Tawjih
                        </div>
                    </Link>
                    
                    {/* Divider */}
                    {session?.user && (
                        <>
                            <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
                            
                            {/* User ID/Massar Code */}
                            <div className="hidden md:flex items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-gray-100 rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#06b89d]" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        ID: {session.user.massarCode}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Right side - Navigation and Login Button */}
                <div className="flex items-center space-x-4">
                    {/* Navigation Links - Add more as needed */}
                    <div className="hidden md:flex space-x-6">
                        <Link href="/applications" className="text-gray-600 hover:text-[#06b89d] transition-colors">
                            Mes Candidatures
                        </Link>
                        <Link href="/profile" className="text-gray-600 hover:text-[#06b89d] transition-colors">
                            Mon Profile
                        </Link>
                        <Link href="/notes" className="text-gray-600 hover:text-[#06b89d] transition-colors">
                            Mes Notes
                        </Link>
                    </div>
                    
                    {/* Login Button */}
                    <div className="ml-4">
                        <LogInButtonClient session={session} />
                    </div>
                    
                    {/* Mobile Menu Button - Shown only on small screens */}
                    <button className="md:hidden text-gray-600 hover:text-[#06b89d] focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Mobile view - Display Massar Code */}
            {session?.user && (
                <div className="md:hidden mt-3 px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="bg-gray-100 rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#06b89d]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            ID: {session.user.massarCode}
                        </span>
                    </div>
                </div>
            )}
        </nav>
    )
}