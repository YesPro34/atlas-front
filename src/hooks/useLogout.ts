// "use client"
// // hooks/useLogout.ts
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { AppDispatch } from "@/app/store/store";
// import { logout } from "@/app/store/authSlice";

// export const useLogout = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   const logoutUser = async (token: string) => {
//     try {
//       await axios.post(
//         'http://localhost:8080/api/auth/logout',
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//     } catch (error) {
//       console.error('Logout request failed:', error);
//     } finally {
//       dispatch(logout());
//       localStorage.removeItem('token');
//       router.push('/login');
//     }
//   };

//   return logoutUser;
// };
