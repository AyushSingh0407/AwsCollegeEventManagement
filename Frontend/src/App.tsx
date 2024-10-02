import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CollegeAdminDashboard from "./pages/admin"
import Homepage from './pages/home'
import ClubDashboard from './pages/club'
import StudentLogin from './pages/login'
import { createBrowserRouter, Link , RouterProvider} from 'react-router-dom'
import UserPage from './pages/user'
import { User } from 'lucide-react'
import Home from './pages/home2'

import StudentSignup from './pages/signup'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <StudentLogin />,
  },
  {
    path: "/signup",
    element: <StudentSignup />,
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
