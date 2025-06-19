"user client"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useRouter } from "next/router";
import { useActionState, useState } from "react";
import axios from "axios";
import SubmitButton from "@/components/SubmitButton";
import { LogIn } from "../lib/auth";

export default function LoginForm(){

    const [state, action] = useActionState(LogIn, undefined)
return(
    <form action={action}>
         {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div className="mb-8">
            <div className="mb-6">
            <label htmlFor="massarCode" className="block text-sm font-medium text-gray-700">
                Code Massar
            </label>
            <input
                // onChange={(e) => setCodeMassarText(e.target.value)}
                name="massarCode"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 "
            />
            {state?.error?.massarCode && (
                <p className="text-sm text-red-500">{state.error.massarCode}</p>
                )}
            </div>

            <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
            </label>
            <input
            name="password"
            //   onChange={(e) => setPasswordText(e.target.value)}
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 "
            />
            {state?.error?.password && (
                <p className="text-sm text-red-500">{state.error.password}</p>
                )}
            </div>
        </div>
    <SubmitButton />
  </form>
 )
}