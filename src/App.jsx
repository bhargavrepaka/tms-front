/* eslint-disable no-unused-vars */
import { Container } from "@mui/material"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import { Route, Routes } from "react-router-dom"
import Users from "./pages/Users"
import Profile from "./pages/Profile"
import ProtectedRoutes from "./components/ProtectedRoutes"
import { Toaster } from "react-hot-toast"
const App = () => {
  console.log(import.meta.env.VITE_API_URL)
  return (
    <>
    <Toaster/>
    <Routes>
      <Route path="/login" element={<Login></Login>} ></Route>
      <Route path="/register" element={<Register></Register>} ></Route>
      <Route element={<ProtectedRoutes/>}>
        <Route path="/" element={<Dashboard></Dashboard>} ></Route>
        <Route path="/tasks" element={<Tasks></Tasks>} ></Route>
        <Route path="/users" element={<Users></Users>} ></Route>
        <Route path="/profile" element={<Profile></Profile>} ></Route>
      </Route>
    </Routes>
   </>   
  )
}

export default App