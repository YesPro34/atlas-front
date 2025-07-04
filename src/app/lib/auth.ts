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
          // TODO: Create The Session For Authenticated User.
          await createSession({
            user: {
              id: result.id,
              massarCode: result.massarCode,
              role: result.role,
              bacOption: result.bacOption,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
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

export const refreshToken = async (
  oldRefreshToken: string
) => {
  try {
    const response =await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", 
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(
        "Failed to refresh token" + response.statusText
      );
    }
    const { accessToken, refreshToken } =
      await response.json();
    // update session with new tokens
    const updateRes = await fetch("/api/auth/update", {
      method: "POST",
      body: JSON.stringify({ accessToken, refreshToken }),
    });
    if (!updateRes.ok)
      throw new Error("Failed to update the tokens");
    return accessToken;
  } catch (err) {
    console.error("Refresh Token failed:", err);
    return null;
  }
};

    // IN THE PRODUCION ENV I HAVE TO CHANGE  "http://localhost:3000" WITH PRODUCTION WEB ADDRESS OF MY NEXTJS SERVER