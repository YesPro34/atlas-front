"user client"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useRouter } from "next/router";
import { useActionState, useState } from "react";
import axios from "axios";
import { loginSuccess } from "../store/authSlice";
import SubmitButton from "@/components/SubmitButton";
// import { useFormState } from "react-dom";
import { LogIn } from "../lib/auth";

export default function LoginForm(){
    // const dispatch = useDispatch<AppDispatch>();
    // // const router = useRouter();
    // const [codeMassarText, setCodeMassarText] = useState<string>('');
    // const [passwordText, setPasswordText] = useState<string>('');
    // const [error, setError] = useState<string | null>(null);

    const [state, action] = useActionState(LogIn, undefined)

    // const handleLogin = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     try {
    //         const response = await axios.post('http://localhost:8080/api/auth/login', {
    //             massarCode: codeMassarText,
    //             password: passwordText
    //         });
    //         console.log(response)
          // Save to Redux
        //   const token = response.data.token;
        //   const user = response.data.user;
          
        //     dispatch(
        //         loginSuccess({
        //             user: {
        //             id: user.id,
        //             codeMassar: user.massarCode,
        //             role: user.role,
        //             },
        //             token,
        //         })
        //     );
        //  localStorage.setItem('token', token);
        //  if(user.role === "ADMIN"){
        //    router.push('/dashboard')
        //  }
        //  if(user.role === "STUDENT"){
        //   router.push('/home')
        //  }
//         } catch (err: any) {
//           setError('Code Massar ou mot de passe incorrect: '+ err.message);
//         }
//       };
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
{/*   
    <div className="text-right mb-6">
      <a href="#" className="text-sm text-[#0ab99d] hover:underline">
        Mot de passe oublié ?
      </a>
    </div> */}
    <SubmitButton />
    {/* {error && (
      <div className="text-red-500 text-bold mt-5">
          - {error}
      </div>
    )} */}
  </form>
 )
}