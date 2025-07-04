import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { createSession } from "./session";
import { FormState, LoginFormSchema } from "./type";

export async function LogIn(
        state: FormState,
        formData: FormData
      ): Promise<FormState> {
        const validatedFields = LoginFormSchema.safeParse({
          massarCode: formData.get("massarCode"),
          password: formData.get("password"),
        });
      
        if (!validatedFields.success) {
          return {
            error: validatedFields.error.flatten().fieldErrors,
          };
        }
      
        const response = await fetch(
          `${BACKEND_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedFields.data),
          }
        );
      
        if (response.ok) {
          const result = await response.json();
          // Create session without refresh token (stored in HTTP-only cookie by backend)
          await createSession({
            user: {
              id: result.id,
              massarCode: result.massarCode,
              role: result.role,
              bacOption: result.bacOption,
            },
            accessToken: result.accessToken,
          });
          if(result.role === "ADMIN"){
              redirect("/dashboard");
          }else{
              redirect("/home");
          }
        } else {
          const errorText = await response.text();
          return {
            message:
              response.status === 401
                ? errorText.includes('inactive')
                  ? "Votre compte est inactif. Veuillez contacter l'administrateur."
                  : "Code Massar ou mot de passe incorrect"
                : response.statusText,
          };
        }
}

// IN THE PRODUCION ENV I HAVE TO CHANGE  "http://localhost:3000" WITH PRODUCTION WEB ADDRESS OF MY NEXTJS SERVER