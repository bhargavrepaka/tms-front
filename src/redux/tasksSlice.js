import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState={
    tasks:[],
    assignedTasks:0,
    doneTasks:0,
    inprogressTasks:0,
}

export const fetchUserTasks=createAsyncThunk(
    'tasks/fetchUserTasks',
    async()=>{
        console.log('fetching user tasks')
        const response =await fetch(`${import.meta.env.VITE_API_URL}/tasks/user`,{
            headers:{
                'Authorization':sessionStorage.getItem('accessToken')
            }
        })
        const result = await response.json()
        console.log(result)
        return result
    }
)
export const fetchAllTasks=createAsyncThunk(
    'tasks/fetchAllTasks',
    async()=>{
        console.log('fetching all tasks')
        const response =await fetch(`${import.meta.env.VITE_API_URL}/tasks`,{
            headers:{
                'Authorization':sessionStorage.getItem('accessToken')
            }
        })
        const result = await response.json()
        console.log(result)
        return result
    }
)

export const addTask=createAsyncThunk(
    'tasks/addTask',
    async(newTask)=>{
        console.log('adding new task',newTask)
        const response =await fetch(`${import.meta.env.VITE_API_URL}/tasks`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":sessionStorage.getItem('accessToken')
              },
              body: JSON.stringify(newTask)
            })
        const result = await response.json()
        console.log(result)
        return result
    }
)

export const updateTask=createAsyncThunk(
    'tasks/updateTask',
    async(updatedTask)=>{
        console.log('updatin task',updatedTask)
        const tid=updatedTask.id
        delete updatedTask.id
        const response =await fetch(`${import.meta.env.VITE_API_URL}/tasks/`+tid,{
            method:"PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization":sessionStorage.getItem('accessToken')
              },
              body: JSON.stringify(updatedTask)
            })
        const result = await response.json()
        console.log(result)
        return result
    }
)


const tasksSlice = createSlice({
    name:'tasks',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUserTasks.fulfilled,(state,action)=>{
            state.tasks=action.payload.tasks
            state.assignedTasks=action.payload.assignedTasks
            state.doneTasks=action.payload.doneTasks
            state.inprogressTasks=action.payload.inprogressTasks
        })
        .addCase(updateTask.fulfilled,(state,action)=>{
            const index=state.tasks.findIndex((task)=>task.id===action.payload.id)
            const oldStatus=state.tasks[index].status+'Tasks'
            const newStatus=action.payload.status+"Tasks"
            console.log(oldStatus,newStatus)
            state[oldStatus]-=1
            state[newStatus]+=1
            console.log(state[oldStatus],state[newStatus])
            state.tasks[index]=action.payload

          })
        .addCase(addTask.fulfilled,(state,action)=>{
            state.tasks.push(action.payload)
        })
        .addCase(fetchAllTasks.fulfilled,(state,action)=>{
            console.log(action.payload)
            state.tasks=action.payload.tasks
            state.assignedTasks=action.payload.assignedTasks
            state.doneTasks=action.payload.doneTasks
            state.inprogressTasks=action.payload.inprogressTasks

        })
    }
    
})

export const selectTasks=(state)=>state.tasks.tasks
export const selectAssignedTasks=(state)=>state.tasks.assignedTasks
export const selectDoneTasks=(state)=>state.tasks.doneTasks
export const selectInprogressTasks=(state)=>state.tasks.inprogressTasks

export default tasksSlice.reducer;