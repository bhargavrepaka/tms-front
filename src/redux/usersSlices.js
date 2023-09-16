import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState={
    users:[]
}

export const fetchUsers=createAsyncThunk(
    'users/fetchUsers',
    async()=>{
        //('fetching users')
        const response =await fetch(`${import.meta.env.VITE_API_URL}/users`,{
            headers:{
                'Authorization':sessionStorage.getItem('accessToken')
            }
        })
        const result = await response.json()
        return result
    }
)

export const updateUser=createAsyncThunk(
    'users/updateUser',
    async(updatedUser)=>{
        //('updatin user',updatedUser)
        const response =await fetch(`${import.meta.env.VITE_API_URL}/users/`+updatedUser.id,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization":sessionStorage.getItem('accessToken')
              },
              body: JSON.stringify(updatedUser)
            })
        const result = await response.json()
        //(result)
        return result
    }
)


const usersSlice = createSlice({
    name:'users',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUsers.fulfilled,(state,action)=>{
            state.users=action.payload
        })
        .addCase(updateUser.fulfilled,(state,action)=>{
            const index=state.users.findIndex((user)=>user.id===action.payload.id)
            state.users[index]=action.payload
          })
    }
    
})

export const selectUsers=(state)=>state.users.users

export default usersSlice.reducer;