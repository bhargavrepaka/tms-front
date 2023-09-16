import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState={
    loggedUser:null,
    error:null
}

export const checkUserLogin=createAsyncThunk(
    'auth/checkUserLogin',
    async({email,password},thunkAPI)=>{
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
            
            const result = await response.json()
            sessionStorage.setItem('accessToken',result.accessToken)
            return result.user
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
        
    }
)
export const registerUser=createAsyncThunk(
    'auth/registerUser',
    async({email,password},thunkAPI)=>{
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
        sessionStorage.setItem('accessToken',result.accessToken)
        return result.user
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
        
    }
)

export const registerAdmin=createAsyncThunk(
    'auth/registerAdmin',
    async({email,password},thunkAPI)=>{
        ////////('checkin register',email)
        try {
            const response =await fetch(`${import.meta.env.VITE_API_URL}/auth/register/admin`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({email,password})
        })
            //(response)
            if(!response.ok){
                const err= await response.json()
                throw new Error(err.message)
            }
            const result = await response.json()
            //(result)
            sessionStorage.setItem('accessToken',result.accessToken)
            return result.user
        } catch (error) {
            //("eerrrrr",error)
            return thunkAPI.rejectWithValue(error.message)
        }
        
    }
)

export const logoutUser=createAsyncThunk(
    "auth/logoutUser",
    async(args,thunkAPI)=>{
        //("logging out")
        try {
            const response =await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`)
            if(!response.ok){
                const err= await response.json()
                throw new Error(err.message)
            }
            //(response)
            return null
        } catch (error) {
            //(error)
            thunkAPI.rejectWithValue(error.message)
        }
        
    }
)

export const updateUserProfile=createAsyncThunk(
    'auth/updateUserProfile',
    async(newProfile)=>{
        //('updatin user',newProfile)
        const response =await fetch(`${import.meta.env.VITE_API_URL}/auth/update/`+newProfile.id,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
                "authorization": sessionStorage.getItem('accessToken'),
              },
              body: JSON.stringify(newProfile)
            })
        const result = await response.json()
        //(result)
        return result
    }
)

export const userDetails=createAsyncThunk(
    'auth/userDetails',
    async()=>{
        //g user details')
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
            //('fulfilled',action.payload)
            state.loggedUser=action.payload
            toast("Welcome to Back!",{
                icon:"👋"
              })
        })
        .addCase(checkUserLogin.rejected,(state,action)=>{ 
            //('rejected',action.payload)
            toast.error(action.payload)
            state.loggedUser=null
            
          })
        .addCase(registerUser.fulfilled,(state,action)=>{
            //('fulfilled register',action.payload)
            state.loggedUser=action.payload
            toast("Welcome!",{
                icon:"👋"
              })
         })
        .addCase(registerUser.rejected,(state,action)=>{
            //('rejected register',action.payload)
            state.loggedUser=null
            toast.error(action.payload)
        })
        .addCase(registerAdmin.fulfilled,(state,action)=>{
            //('fulfilled register',action.payload)
            state.loggedUser=action.payload
            toast("Welcome!",{
                icon:"👋"
              })
         })
        .addCase(registerAdmin.rejected,(state,action)=>{
            //('rejected register',action.payload)
            state.loggedUser=null
            toast.error(action.payload)
        })
        .addCase(updateUserProfile.fulfilled,(state,action)=>{
            //('fulfilled update profile',action.payload)
            state.loggedUser=action.payload 
        })
        .addCase(logoutUser.fulfilled,(state)=>{
            //("fulfilled logout")
            state.loggedUser=null
            sessionStorage.removeItem('accessToken')
        })
        .addCase(userDetails.fulfilled,(state,action)=>{
            //('fulfilled user details',action.payload)
            state.loggedUser=action.payload
        })
        .addCase(userDetails.rejected,(state)=>{
            //('rejected user details',action.payload)
            state.loggedUser=null
            sessionStorage.removeItem('accessToken')
        })

        
    }
    
})

export const selectLoggedUser=(state)=>state.auth.loggedUser

export default authSlice.reducer;