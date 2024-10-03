import { useState } from 'react'
import './App.css'
import CollegeAdminDashboard from "./pages/admin"
import Homepage from './pages/home'
import ClubDashboard from './pages/club'
import StudentLogin from './pages/login_enduser'
import { createBrowserRouter, Link , RouterProvider} from 'react-router-dom'
import UserPage from './pages/user'
import StudentSignup from './pages/signup_enduser'
import ClubLogin from './pages/login_club'
import ClubSignup from './pages/signup_club'
import AdminLogin from './pages/login_admin'
import AdminSignup from './pages/signup_admin'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/enduser/login",
    element: <StudentLogin />,
  },
  {
    path: "/enduser/signup",
    element: <StudentSignup />,
  },
  {
    path: "/club/login",
    element: <ClubLogin />,
  },
  {
    path: "/club/signup",
    element: <ClubSignup />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/signup",
    element: <AdminSignup />,
  },
  {
    path: "/clubs",
    element: <ClubDashboard />,
  },
  {
    path: "/user",
    element: <UserPage />
  },
  {
    path: "/admin",
    element: <CollegeAdminDashboard />
  }

]);

function App() {
  const [count, setCount] = useState(0)

  return (

    <>
      <RouterProvider router={router}/>
      {/* <UserPage /> */}
    </>
  )
}

export default App
