import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState={
    tasks:[],
    assignedTasks:0,
    doneTasks:0,
    inprogressTasks:0,
    loading: false,
    error: null
}

export const fetchUserTasks = createAsyncThunk(
    'tasks/fetchUserTasks',
    async (arg, thunkAPI) => {
        try {
            //('fetching user tasks');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/user`, {
                headers: {
                    'Authorization': sessionStorage.getItem('accessToken')
                }
            });

            if (!response.ok) {
                throw new Error('Server error');
            }

            const result = await response.json();
            //(result);
            return result;
        } catch (error) {
            //(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchAllTasks = createAsyncThunk(
    'tasks/fetchAllTasks',
    async (arg, thunkAPI) => {
        try {
            //('fetching all tasks');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
                headers: {
                    'Authorization': sessionStorage.getItem('accessToken')
                }
            });

            if (!response.ok) {
                throw new Error('Server error');
            }

            const result = await response.json();
            //(result);
            return result;
        } catch (error) {
            //(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (newTask, thunkAPI) => {
        try {
            //('adding new task', newTask);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem('accessToken')
                },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) {
                throw new Error('Server error');
            }

            const result = await response.json();
            //(result);
            return result;
        } catch (error) {
            //(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addComment = createAsyncThunk(
    'tasks/addComment',
    async (newComment, thunkAPI) => {
        try {
            //('adding new comment', newComment);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem('accessToken')
                },
                body: JSON.stringify(newComment)
            });

            if (!response.ok) {
                throw new Error('Server error');
            }

            const result = await response.json();
            //(result);
            return result;
        } catch (error) {
            //(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (updatedTask, thunkAPI) => {
        try {
            //('updating task', updatedTask);
            const tid = updatedTask.id;
            delete updatedTask.id;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/` + tid, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem('accessToken')
                },
                body: JSON.stringify(updatedTask)
            });

            if (!response.ok) {
                throw new Error('Server error');
            }

            const result = await response.json();
            //(result);
            return result;
        } catch (error) {
            //(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const tasksSlice = createSlice({
    name:'tasks',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserTasks.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchUserTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks = action.payload.tasks;
            state.assignedTasks = action.payload.assignedTasks;
            state.doneTasks = action.payload.doneTasks;
            state.inprogressTasks = action.payload.inprogressTasks;
        })
        .addCase(fetchUserTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateTask.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateTask.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.tasks.findIndex((task) => task.id === action.payload.id);
            const oldStatus = state.tasks[index].status + 'Tasks';
            const newStatus = action.payload.status + "Tasks";
            state[oldStatus] -= 1;
            state[newStatus] += 1;
            state.tasks[index] = action.payload;
        })
        .addCase(updateTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(addTask.pending, (state) => {
            state.loading = true;
        })
        .addCase(addTask.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks.push({...action.payload, comment: []});
        })
        .addCase(addTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchAllTasks.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks = action.payload.tasks;
            state.assignedTasks = action.payload.assignedTasks;
            state.doneTasks = action.payload.doneTasks;
            state.inprogressTasks = action.payload.inprogressTasks;
        })
        .addCase(fetchAllTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(addComment.pending, (state) => {
            state.loading = true;
        })
        .addCase(addComment.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.tasks.findIndex((task) => task.id === action.payload.TaskId);
            state.tasks[index].comment.push(action.payload);
        })
        .addCase(addComment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
    
})

export const selectTasks=(state)=>state.tasks.tasks
export const selectAssignedTasks=(state)=>state.tasks.assignedTasks
export const selectDoneTasks=(state)=>state.tasks.doneTasks
export const selectInprogressTasks=(state)=>state.tasks.inprogressTasks

export default tasksSlice.reducer;



{/* <>
const initialState = {
    tasks: [],
    assignedTasks: 0,
    doneTasks: 0,
    inprogressTasks: 0,
    loading: false,
    error: null
}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserTasks.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchUserTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks = action.payload.tasks;
            state.assignedTasks = action.payload.assignedTasks;
            state.doneTasks = action.payload.doneTasks;
            state.inprogressTasks = action.payload.inprogressTasks;
        })
        .addCase(fetchUserTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateTask.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateTask.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.tasks.findIndex((task) => task.id === action.payload.id);
            const oldStatus = state.tasks[index].status + 'Tasks';
            const newStatus = action.payload.status + "Tasks";
            state[oldStatus] -= 1;
            state[newStatus] += 1;
            state.tasks[index] = action.payload;
        })
        .addCase(updateTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(addTask.pending, (state) => {
            state.loading = true;
        })
        .addCase(addTask.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks.push({...action.payload, comment: []});
        })
        .addCase(addTask.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(fetchAllTasks.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks = action.payload.tasks;
            state.assignedTasks = action.payload.assignedTasks;
            state.doneTasks = action.payload.doneTasks;
            state.inprogressTasks = action.payload.inprogressTasks;
        })
        .addCase(fetchAllTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(addComment.pending, (state) => {
            state.loading = true;
        })
        .addCase(addComment.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.tasks.findIndex((task) => task.id === action.payload.TaskId);
            state.tasks[index].comment.push(action.payload);
        })
        .addCase(addComment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const selectTasks = (state) => state.tasks.tasks;
export const selectAssignedTasks = (state) => state.tasks.assignedTasks;
export const selectDoneTasks = (state) => state.tasks.doneTasks;
export const selectInprogressTasks = (state) => state.tasks.inprogressTasks;

export default tasksSlice.reducer;
</> */}