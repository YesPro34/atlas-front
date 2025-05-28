"use client"

const LogInButtonClient =  () => {
  return (
    <div className="bg-[#097c6b] px-4 py-2 rounded-lg text-white font-bold cursor-pointer ">
          <a href={"/api/auth/logout"}>Déconnexion</a>
    </div>
  );
};

export default LogInButtonClient;