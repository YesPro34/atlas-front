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
            credentials: "include",
            body: JSON.stringify(validatedFields.data),
          }
        );
      
        if (response.ok) {
          const result = await response.json();
          console.log("🔐 Login - Backend login successful, creating session");
          console.log("🔐 Login - Response headers:", Object.fromEntries(response.headers.entries()));
          console.log("🔐 Login - Set-Cookie header:", response.headers.get('set-cookie'));
          
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
          console.log("✅ Login - Session created, redirecting to:", result.role === "ADMIN" ? "/dashboard" : "/home");
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