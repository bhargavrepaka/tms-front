/* eslint-disable no-unused-vars */

import { Box, Button,  FormControl, InputLabel, MenuItem, Modal, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, addTask, selectTasks, updateTask } from '../redux/tasksSlice';
import { selectLoggedUser } from '../redux/authSlice';
import { TextareaAutosize, FormLabel } from '@mui/material';
import { selectUsers } from '../redux/usersSlices';
import toast from 'react-hot-toast';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height: "90vh",
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt:4 ,
  px: 4,
  pb: 5,
};





export default function Tasks() {

  const [openModal, setOpenModal] = useState(false)
  const [openNewTaskModal, setOpenNewTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [status, setStatus] = useState('')
  const [tag, setTag] = useState('')
  const [comment,setComment]=useState("")
  const tasks = useSelector(selectTasks)
  const dispatch = useDispatch()
  const loggedUser = useSelector(selectLoggedUser)
  const users = useSelector(selectUsers)
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', assignedTo: '', tag: '', assignedBy: loggedUser.email, status: 'assigned', assignedDate: new Date().toLocaleDateString() })
  const scrollRef=useRef(null)

  useEffect(()=>{
    if(selectedTask){
      const updatedTask=tasks.find(task=>task.id===selectedTask.id)
      setSelectedTask(updatedTask)
    }
    // scrollRef.current.scrollTop=scrollRef.current?.scrollHeight
    scrollRef.current?.scrollIntoView({behavior:"smooth",block:"center", inline:"nearest"})
  },[tasks])

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      // width: 70 
    },
    {
      field: 'title',
      headerName: 'Title',
      width: "400"
    },
    {
      field: 'deadline',
      headerName: 'Deadline',
      width: 160
    },
    {
      field: loggedUser?.role === 'user' ? 'assignedBy' : 'assignedTo',
      headerName: loggedUser?.role === 'user' ? 'Assigned By' : 'Assigned To',
      width: 180,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
    },
    {
      field: 'tag',
      headerName: 'Tag',
      // width: 90,
    },
  ];



  const handleTaskClick = (params) => {
    setOpenModal(true)
    setSelectedTask(params.row)
    setTag(params.row.tag)
    setStatus(params.row.status)
    scrollRef.current?.scrollIntoView({behavior:"smooth",block:"center", inline:"nearest"})
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    handleCancel()
  }
  const handleCloseNewTaskModal = () => {
    setOpenNewTaskModal(false)
    handleCancel()
    setNewTask({ title: '', description: '', deadline: '', assignedTo: '', tag: '', assignedBy: loggedUser.email, status: 'assigned', assignedDate: new Date().toLocaleDateString() })

  }

  const handleNewTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value })
  }
  const handleSelectedTaskChange = (e) => {   
    setSelectedTask({ ...selectedTask, [e.target.name]: e.target.value })
  }
  const handleNewTaskSubmit = (e) => {
    e.preventDefault()
    dispatch(addTask(newTask))
    handleCloseNewTaskModal()
    setNewTask({ title: '', description: '', deadline: '', assignedTo: '', tag: '', assignedBy: loggedUser.email, status: 'assigned', assignedDate: new Date().toLocaleDateString() })
    toast.success("Task Added Successfully")
  }

  const handleCommentSubmit=()=>{
    if(comment.length<3){
      toast.error("Comment should be atleast 3 characters long")
      return
    }
    const commentObject={message:comment,TaskId:selectedTask.id,sender:loggedUser.email,senderRole:loggedUser.role}
    
    dispatch(addComment(commentObject))
    setComment('')
  }
  const handleTaskChangesSubmit = (e) => {
    e.preventDefault()
    const updatedTask = { ...selectedTask }
    delete updatedTask.createdAt
    delete updatedTask.updatedAt
    dispatch(updateTask(updatedTask))
    setOpenModal(false)
    toast.success("Task Updated Successfully")
  }

  const handleCancel = () => {
    setSelectedTask(null)
    setTag(null)
    setStatus(null)
    setComment("")
  }
  return (
    <>
      <Box sx={{ height: "80vh", width: '100%' }}>
        <Stack direction={"row"} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant='h3' gutterBottom>Tasks</Typography>
          {loggedUser.role === 'admin' && <Button variant='contained'
            color='primary'
            onClick={() => setOpenNewTaskModal(true)}
            sx={{ height: 'fit-content', p: 1 }}> New Task</Button>}
        </Stack>
        <DataGrid
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
          rows={tasks}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick={true}
          disableColumnMenu={true}
          onRowClick={handleTaskClick}
        />
      </Box>

      {/* modal for user */}
      {openModal && loggedUser.role !== 'admin' && <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2" gutterBottom>
            Task Details
          </Typography>
          <Box>
            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Id : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedTask.id}
              </Typography>
            </Stack>

            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Title : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedTask.title}
              </Typography>
            </Stack>

            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Description : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedTask.description}
              </Typography>
            </Stack>

            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Assigned On : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedTask.assignedDate}
              </Typography>
            </Stack>

            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Deadline : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedTask.deadline}
              </Typography>
            </Stack>

            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Assigned By : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedTask.assignedBy}
              </Typography>
            </Stack>
            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Assigned To : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedTask.assignedTo}
              </Typography>
            </Stack>
          </Box>

          <Box mt={3}  >
            <form onSubmit={handleTaskChangesSubmit}>
              <Stack direction={'column'} gap={2}>
                <Stack direction={"row"}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      id="demo-simple-select"
                      label="status"
                      name='status'
                      onChange={handleSelectedTaskChange}
                      value={selectedTask.status}
                    >
                      <MenuItem value={'assigned'}>Assigned </MenuItem>
                      <MenuItem value={"inprogress"}>In Progress</MenuItem>
                      <MenuItem value={"done"}>Done</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="tag-label">Tag</InputLabel>
                    <Select

                      id="tag"
                      name='tag'
                      label="tag"
                      onChange={handleSelectedTaskChange}
                      value={selectedTask.tag}
                    >
                      <MenuItem value={"tag1"}>Tag 1</MenuItem>
                      <MenuItem value={"tag2"}>Tag 2</MenuItem>
                      <MenuItem value={"tag3"}>Tag 3</MenuItem>
                    </Select>
                  </FormControl>

                </Stack>

                <Stack direction={'row-reverse'} gap={2} >
                  <Button variant='text' onClick={handleCloseModal}  > Cancel </Button>
                  <Button variant="contained" type='submit' >Save Changes</Button>
                </Stack>
              </Stack>
            </form>
          </Box>
          <Box  >
            <Typography variant='h5' sx={{ fontWeight: 'bold' }} gutterBottom >Comments</Typography>
            <Paper variant='outlined' square={false} >
              <Stack>
                <Box  height={240} sx={{ overflow: 'scroll'}}>
                  <Stack>
                    {selectedTask?.comment?.map((cmt)=>{
                      return( 
                      <Box 
                        // ref={idx===selectedTask.comment.length-1?scrollRef:null}
                      key={cmt.id} sx={{border:"1px solid black", p:1}}>
                        <Stack direction={'row'}>
                        <Typography variant='body2'>Sender : {cmt.sender}</Typography>
                        <Typography mx={3} variant='body2'>{new Date(cmt.createdAt).toLocaleDateString()}</Typography>
                        </Stack>
                        
                        <Typography  variant='subtitle2' fontWeight={"bold"}>
                         Message : {cmt.message}
                        </Typography>
                       
                      </Box>)
                       
                    })}
                      <Box ref={scrollRef} height={"55px"} ></Box>
                  </Stack>
                  
                </Box>
                <Stack direction={"row"} >
                  <TextField mt={1}  fullWidth label="Add comment"
                    value={comment} fontSize={20}
                    onChange={(e)=>setComment(e.target.value)}
                    name='comment'
                    sx={{ borderRadius: 0 }}
                    inputProps={{minLength:3}}
                    size='small'
                      >
                  </TextField>
                  <Button variant='contained' onClick={handleCommentSubmit} sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }} >Send</Button>
                </Stack>
              </Stack>
            </Paper >

          </Box>
        </Box>
      </Modal>}


      {/* modal for admin */}
      {openModal && loggedUser.role === 'admin' && <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: 'scroll', bgcolor: 'background.paper' }}

      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2" gutterBottom>
            Task Details
          </Typography>
          <form onSubmit={handleTaskChangesSubmit}>
            <Stack gap={2} >
              <Stack direction={"row"} justifyContent={'space-between'} >
                <Stack direction={"row"}>
                  <FormLabel>ID : &nbsp;</FormLabel>
                  <FormLabel id="modal-modal-description" fontSize={20}  >
                    {selectedTask.id}
                  </FormLabel>
                </Stack>
                <Stack direction={"row"} >
                  <FormLabel>Assigned By : &nbsp;</FormLabel>
                  <FormLabel fontSize={20}  >
                    {selectedTask.assignedBy}
                  </FormLabel>
                </Stack>

              </Stack>

              <Stack direction={"row"} >

                <TextField fullWidth label="Title"
                  value={selectedTask.title} fontSize={20}
                  onChange={handleSelectedTaskChange}
                  name='title'  >
                </TextField>
              </Stack>

              <Stack direction={"row"} >
                <FormControl fullWidth>
                  <FormLabel>Description</FormLabel>
                  <TextareaAutosize
                    name='description'
                    value={selectedTask.description}
                    minRows={6}
                    onChange={handleSelectedTaskChange} >
                  </TextareaAutosize>
                </FormControl>
              </Stack>

              <Stack direction={"row"} gap={1} >

                <TextField disabled fullWidth label="Assigned On " id="modal-modal-description"
                  value={selectedTask.assignedDate}
                  name='assignedDate' fontSize={20}  >
                </TextField>
                <TextField type='date' fullWidth label="Deadline"
                  id="modal-modal-description" fontSize={20}
                  value={selectedTask.deadline}
                  name='deadline'
                  // defaultValue={selectedTask.deadline}
                  onChange={handleSelectedTaskChange}  >
                </TextField>
                <FormControl fullWidth>
                  <InputLabel id="tag-label">Tag</InputLabel>
                  <Select
                    id="tag"
                    label="tag"
                    name='tag'
                    onChange={handleSelectedTaskChange}
                    value={selectedTask.tag}
                  >
                    <MenuItem value={"tag1"}>Tag 1</MenuItem>
                    <MenuItem value={"tag2"}>Tag 2</MenuItem>
                    <MenuItem value={"tag3"}>Tag 3</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={"row"} >
                <FormControl fullWidth>
                  <InputLabel id="assignedTo-label">Assigned To</InputLabel>
                  <Select
                    name='assignedTo'
                    value={selectedTask.assignedTo}
                    label="Assigned To"

                    onChange={handleSelectedTaskChange}
                  >
                    {users.map((user, index) => {
                      return <MenuItem key={index} value={user.email}>{user.email}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    id="demo-simple-select"
                    label="status"
                    name='status'
                    onChange={handleSelectedTaskChange}
                    value={selectedTask.status}
                  >
                    <MenuItem value={'assigned'}>Assigned </MenuItem>
                    <MenuItem value={"inprogress"}>In Progress</MenuItem>
                    <MenuItem value={"done"}>Done</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
            <Stack direction={'row-reverse'} gap={2} mt={1} >
              <Button variant='text' onClick={handleCloseModal}  > Cancel </Button>
              <Button variant="contained" type='submit' >Save Changes</Button>
            </Stack>

          </form>
          <Box  >
            <Typography variant='h5' sx={{ fontWeight: 'bold' }} gutterBottom >Comments</Typography>
            <Paper variant='outlined' square={false} >
              <Stack>
                <Box  height={240} sx={{ overflow: 'scroll'}}>
                  <Stack>
                    {selectedTask.comment.map((cmt)=>{
                      return( 
                      <Box 
                        // ref={idx===selectedTask.comment.length-1?scrollRef:null}
                      key={cmt.id} sx={{border:"1px solid black", p:1}}>
                        <Stack direction={'row'}>
                        <Typography variant='body2'>Sender : {cmt.sender}</Typography>
                        <Typography mx={3} variant='body2'>{new Date(cmt.createdAt).toLocaleDateString()}</Typography>
                        </Stack>
                        
                        <Typography  variant='subtitle2' fontWeight={"bold"}>
                         Message : {cmt.message}
                        </Typography>
                       
                      </Box>)
                       
                    })}
                      <Box ref={scrollRef} height={"55px"} ></Box>
                  </Stack>
                  
                </Box>
                <Stack direction={"row"} >
                  <TextField mt={1}  fullWidth label="Add comment"
                    value={comment} fontSize={20}
                    onChange={(e)=>setComment(e.target.value)}
                    name='comment'
                    sx={{ borderRadius: 0 }}
                    inputProps={{minLength:3}}
                    size='small'
                      >
                  </TextField>
                  <Button variant='contained' onClick={handleCommentSubmit} sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }} >Send</Button>
                </Stack>
              </Stack>
            </Paper >

          </Box>
        </Box>
      </Modal>}

      {openNewTaskModal && <Modal
        open={openNewTaskModal}
        onClose={handleCloseNewTaskModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2" gutterBottom>
            Add New Task
          </Typography>
          <Box >
            <form onSubmit={handleNewTaskSubmit}>
              <Stack direction={'column'} gap={2}>
                <TextField
                  fullWidth
                  label='Title'
                  name='title'
                  value={newTask.title}
                  required
                  onChange={handleNewTaskChange}
                ></TextField>
                <FormControl fullWidth>
                  <FormLabel>Description</FormLabel>
                  <TextareaAutosize
                    name='description'
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                    minRows={6} >
                    required
                  </TextareaAutosize>
                </FormControl>

                <Stack direction={"row"}>
                  <TextField
                    type='date'
                    label='Deadline'
                    fullWidth
                    name='deadline'
                    value={newTask.deadline}
                    required
                    onChange={handleNewTaskChange}
                    InputLabelProps={{ shrink: true }}>
                  </TextField>
                  <FormControl fullWidth>
                    <InputLabel id="assignedTo-label">Assigned To</InputLabel>
                    <Select
                      name='assignedTo'
                      value={newTask.assignedTo}
                      onChange={handleNewTaskChange}
                      label="Assigned To"
                      required
                    >
                      {users.map((user, index) => {
                        return <MenuItem key={index} value={user.email}>{user.email}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="tag-label">Tag</InputLabel>
                    <Select
                      name="tag" value={newTask.tag}
                      label="tag"
                      onChange={handleNewTaskChange}
                      required
                    >
                      <MenuItem value={"tag1"}>Tag 1</MenuItem>
                      <MenuItem value={"tag2"}>Tag 2</MenuItem>
                      <MenuItem value={"tag3"}>Tag 3</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction={'row-reverse'} gap={2} >
                  <Button variant='text' onClick={handleCloseNewTaskModal}  > Cancel </Button>
                  <Button variant="contained" type='submit' >Add Task</Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Box>
      </Modal>}
    </>


  );
}