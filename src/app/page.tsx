import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <Link 
        href="/admin" 
        className="text-lg font-medium text-gray-900 hover:text-[#06b89d] transition-colors"
      >
        Admin Dashboard
      </Link>
      <Link 
        href="/student" 
        className="text-lg font-medium text-gray-900 hover:text-[#06b89d] transition-colors"
      >
        Student Dashboard
      </Link>
      <Link 
        href="/school" 
        className="text-lg font-medium text-gray-900 hover:text-[#06b89d] transition-colors"
      >
        School Dashboard
      </Link>
    </main>
  );
}
