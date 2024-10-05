// App.tsx
import { useEffect, useState } from 'react';
import './App.css';
import CollegeAdminDashboard from "./pages/admin";
import Homepage from './pages/home';
import ClubDashboard from './pages/club';
import StudentLogin from './pages/login_enduser';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import UserPage from './pages/user';
import StudentSignup from './pages/signup_enduser';
import ClubLogin from './pages/login_club';
import ClubSignup from './pages/signup_club';
import AdminLogin from './pages/login_admin';
import AdminSignup from './pages/signup_admin';

interface LoginState {
  isLogin: boolean;
  token: string;
}

function App() {
  const [loginState, setLogin] = useState<LoginState>({ isLogin: false, token: "" });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage loginState={loginState} setLogin={setLogin} />,
    },
    {
      path: "/enduser/login",
      element: <StudentLogin loginState={loginState} setLogin={setLogin} />,
    },
    {
      path: "/enduser/signup",
      element: <StudentSignup />,
    },
    {
      path: "/club/login",
      element: <ClubLogin loginState={loginState} setLogin={setLogin} />,
    },
    {
      path: "/club/signup",
      element: <ClubSignup />,
    },
    {
      path: "/admin/login",
      element: <AdminLogin loginState={loginState} setLogin={setLogin} />,
    },
    {
      path: "/admin/signup",
      element: <AdminSignup />,
    },
    {
      path: "/clubs",
      element: <ClubDashboard loginState={loginState} setLogin={setLogin} />,
    },
    {
      path: "/user",
      element: <UserPage loginState={loginState} setLogin={setLogin} />,
    },
    {
      path: "/admin",
      element: <CollegeAdminDashboard loginState={loginState} setLogin={setLogin} />,
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
