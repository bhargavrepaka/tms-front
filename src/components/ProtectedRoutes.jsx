/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { selectLoggedUser, userDetails } from "../redux/authSlice"
import Sidebar from "./Sidebar"
import { useEffect } from "react"
import { fetchAllTasks, fetchUserTasks } from "../redux/tasksSlice"
import { fetchUsers } from "../redux/usersSlices"

const ProtectedRoutes = () => {
    const loggedUser =useSelector(selectLoggedUser)
    const dispatch=useDispatch()

    useEffect(()=>{ 
        if(loggedUser && loggedUser.role==="admin"){
          dispatch(fetchAllTasks())
          dispatch(fetchUsers())
        }
        else if (loggedUser && loggedUser.role==="user"){
          dispatch(fetchUserTasks())
        }

    },[loggedUser,dispatch])


    if(!loggedUser && sessionStorage.getItem("accessToken")){
      dispatch(userDetails())
    }

    if(!loggedUser){
        return <Navigate to={"/login"}></Navigate>
    }
  return (
    <Sidebar>
        <Outlet></Outlet>
    </Sidebar>
    
  )
}

export default ProtectedRoutes