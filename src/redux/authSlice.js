import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState={
    loggedUser:null
}

export const checkUserLogin=createAsyncThunk(
    'auth/checkUserLogin',
    async({email,password},{rejectWithValue})=>{
        console.log('checkin login',email)
        try {
            const response =await fetch(`${import.meta.env.VITE_API_URL}/auth/login`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({email,password})
            })
            if(!response.ok){
                const err= await response.json()
                throw new Error(err.message)
            }
            console.log(response)
            const result = await response.json()
            console.log(result)
            sessionStorage.setItem('accessToken',result.accessToken)
            return result.user
        } catch (error) {
            console.log("eerrrrr",error)
            return rejectWithValue(error.message)
        }
        
    }
)
export const registerUser=createAsyncThunk(
    'auth/registerUser',
    async({email,password},{rejectWithValue})=>{
        console.log('checkin register',email)
        try {
            const response =await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({email,password})
        })
        if(!response.ok){
            const err= await response.json()
            throw new Error(err.message)
        }
        const result = await response.json()
        console.log(result)
        sessionStorage.setItem('accessToken',result.accessToken)
        return result.user
        } catch (error) {
           return rejectWithValue(error.message)
        }
        
    }
)
export const logoutUser=createAsyncThunk(
    "auth/logoutUser",
    async()=>{
        console.log("logging out")
        try {
            const response =await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`)
            console.log(response)
            return null
        } catch (error) {
            console.log(error)
        }
        
    }
)

export const updateUserProfile=createAsyncThunk(
    'auth/updateUserProfile',
    async(newProfile)=>{
        console.log('updatin user',newProfile)
        const response =await fetch(`${import.meta.env.VITE_API_URL}/auth/update/`+newProfile.id,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
                "authorization": sessionStorage.getItem('accessToken'),
              },
              body: JSON.stringify(newProfile)
            })
        const result = await response.json()
        console.log(result)
        return result
    }
)

export const userDetails=createAsyncThunk(
    'auth/userDetails',
    async()=>{
        console.log('fetching user details')
        const response =await fetch(`${import.meta.env.VITE_API_URL}/auth/me`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": sessionStorage.getItem('accessToken'),
              }
        })
        const result = await response.json()
        return result
    }
)


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(checkUserLogin.fulfilled,(state,action)=>{
            console.log('fulfilled',action.payload)
            state.loggedUser=action.payload
            toast("Welcome to Back!",{
                icon:"👋"
              })
        })
        .addCase(checkUserLogin.rejected,(state,action)=>{ 
            console.log('rejected',action.payload)
            toast.error(action.payload)
            state.loggedUser=null
            
          })
        .addCase(registerUser.fulfilled,(state,action)=>{
            console.log('fulfilled register',action.payload)
            state.loggedUser=action.payload
            toast("Welcome!",{
                icon:"👋"
              })
         })
        .addCase(registerUser.rejected,(state,action)=>{
            console.log('rejected register',action.payload)
            state.loggedUser=null
            

        })
        .addCase(updateUserProfile.fulfilled,(state,action)=>{
            console.log('fulfilled update profile',action.payload)
            state.loggedUser=action.payload 
        })
        .addCase(logoutUser.fulfilled,(state)=>{
            console.log("fulfilled logout")
            state.loggedUser=null
            sessionStorage.removeItem('accessToken')
        })
        .addCase(userDetails.fulfilled,(state,action)=>{
            console.log('fulfilled user details',action.payload)
            state.loggedUser=action.payload
        })
        .addCase(userDetails.rejected,(state,action)=>{
            console.log('rejected user details',action.payload)
            state.loggedUser=null
            sessionStorage.removeItem('accessToken')
        })

        
    }
    
})

export const selectLoggedUser=(state)=>state.auth.loggedUser

export default authSlice.reducer;