import { z } from "zod";

export type FormState =
  | {
      error?: {
        massarCode?: string[];
        password?: string[];
      };
      message?: string | null;
    }
  | undefined;

// export const SignupFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, {
//       message: "Name must be at least 2 characters long.",
//     })
//     .trim(),
//   email: z
//     .string()
//     .email({ message: "Please enter a valid email." })
//     .trim(),
//   password: z
//     .string()
//     .min(8, { message: "Be at least 8 characters long" })
//     .regex(/[a-zA-Z]/, {
//       message: "Contain at least one letter.",
//     })
//     .regex(/[0-9]/, {
//       message: "Contain at least one number.",
//     })
//     .regex(/[^a-zA-Z0-9]/, {
//       message: "Contain at least one special character.",
//     })
//     .trim(),
// });

export const LoginFormSchema = z.object({
  massarCode: z.string().min(1, "Code Massar est requis"),
  password: z.string().min(1, "Mot de passe est requis"),
});

export type Role = "STUDENT" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type ApplicationStatus = "PENDING" | "REGISTERED";

export type ChoiceType = "CITY" | "FILIERE";

export type bacOption = "PC" | "SVT" | "SMA" | "ECO" | "SMB" | "STE" | "STM" | "SGC";

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  isOpen: boolean;
  city?: string;
  cities?: City[];
  filieres?: Filiere[];
  image?: string;
}

export interface SchoolType {
  id: string;
  name: string;
  code: string;
  maxCities?: number;
  requiresCityRanking: boolean;
  maxFilieres?: number;
  allowMultipleFilieresSelection: boolean;
}

export interface City {
  id: string;
  name: string;
}

export interface Filiere {
  id: string;
  name: string;
  school?: School;
  bacOptions?: BacOption[];
}

export type BacOption = {
  id: string;
  name: string;
};

export type Student = {
  id: string;
  massarCode: string;
  role: Role;
  status: UserStatus;
  firstName: string;
  lastName: string;
  bacOptionId?: string;
  bacOption?: BacOption;
  city?: string;
  nationalMark?: number;
  generalMark?: number;
  mathMark?: number;
  physicMark?: number;
  svtMark?: number;
  englishMark?: number;
  philosophyMark?: number;
  comptabilityMark?: number;
  economyMark?: number;
  managementMark?: number;
};

export interface ApplicationChoice {
  id: string;
  rank: number;
  cityId?: string;
  filiereId?: string;
  type: "CITY" | "FILIERE";
  city?: City;
  filiere?: Filiere;
}

export interface Application {
  id: string;
  userId: string;
  schoolId: string;
  status: ApplicationStatus;
  applicationDate: string;
  updatedAt: string;
  school: School;
  choices: ApplicationChoice[];
  user: {
    firstName: string;
    lastName: string;
    bacOption?: BacOption;
  };
}
