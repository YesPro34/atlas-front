import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { School, Student } from "@/app/lib/type";
import { useEffect, useState } from "react";

export default function AnalyticsCards() {
  // statistics for student
  const [students, setStudents] = useState<Student[]>([]);
  const studentsNumber : number = students.length;
  const activeStudentNumber : number = students.filter((std) => std.status === "ACTIVE").length
  const inactiveStudentNumber : number = studentsNumber - activeStudentNumber;

  // statistics for school
  const [schools, setSchools] = useState<School[]>([]);
  const schoolsNumber : number = schools.length;
  const opnedSchoolsNumber : number = schools.filter((std) => std.isOpen === true).length
  const closedSchoolsNumber : number = schoolsNumber - opnedSchoolsNumber;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // get all etudiant
        const stdRes = await fetch("/api/user/students");

        // get all ecoles
          const schRes = await authFetch(`${BACKEND_URL}/school`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!stdRes.ok) throw new Error("Failed to fetch students");
        if (!schRes.ok) throw new Error("Failed to fetch schools");

        const studentsData = await stdRes.json();
        const schoolsData = await schRes.json();
        setStudents(studentsData);
        setSchools(schoolsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, [students, schools]);
    const cards = [
      { title: "Nombre des Etudiants", value: studentsNumber },
      { title: "Nombre des Etudiants Active", value: activeStudentNumber },
      { title: "Nombre des Etudiants Inactive", value: inactiveStudentNumber },
      { title: "Nombre Totale des Ecole", value: schoolsNumber },
      { title: "Nombre des Ecole Ouverte", value: opnedSchoolsNumber },
      { title: "Nombre des Ecole Fermee", value: closedSchoolsNumber },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-3xl text-[#06b89d] font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    );
  }