import Link from "next/link";

const pages = {
    Home: "Acceuil",
    Users: "Gestion des utilisateurs",
    Schools: "Gestion des écoles",
    Applications: "Gestion des candidatures",
  };
  
  export default function Sidebar({ activePage, setActivePage }: { activePage: string; setActivePage: (val: string) => void }) {
    return (
      <div className="h-screen w-64 bg-[#18171d] text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        {Object.entries(pages).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`block w-full text-left py-2 px-3 mb-2 rounded-lg hover:bg-[#06b89d] transition ${
              activePage === key ? "bg-[#06b89d]" : ""
            }`}
          >
            {label}
          </button>
        ))}
        <button className="block w-full text-left py-2 px-3 mb-2 rounded-lg hover:bg-[#06b89d] transition">
          <Link href="/dashboard/parameters">
            Paramètres 
          </Link>
        </button>
      </div>
    );
  }