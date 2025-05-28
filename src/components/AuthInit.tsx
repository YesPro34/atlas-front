"use client"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/app/store/authSlice";
import { AppDispatch } from "@/app/store/store";
import axios from "axios";

export default function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally validate the token and fetch user data
      axios.get('http://localhost:8080/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((res) => {
      console.log(res)
        dispatch(loginSuccess({
          token,
          user: {
            id: res.data.id,
            codeMassar: res.data.codeMassar,
            role: res.data.role,
          }
        }));
      })
      .catch(() => {
        // invalid token
        localStorage.removeItem('token');
      });
    }
  }, []);

  return <>{children}</>;
}
