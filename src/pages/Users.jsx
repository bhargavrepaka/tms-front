
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUsers, updateUser } from '../redux/usersSlices';
import { selectLoggedUser } from '../redux/authSlice';
import { Navigate } from 'react-router-dom';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};


const columns = [
  { field: 'id', headerName: 'ID', minWidth: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'phone',
    headerName: 'Phone No.',
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: 'role',
    headerName: 'Role',
  },
];



export default function Users() {

  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const dispatch  = useDispatch()
  const users= useSelector(selectUsers)
  const loggedUser=useSelector(selectLoggedUser)
  const [selectedUserRole,setSelectedUserRole] = useState(null)
  

  useEffect(()=>{
    dispatch(fetchUsers())
  },[dispatch])

  const handleUserClick = (params) => {
    setOpenModal(true)
    setSelectedUser(params.row)
    setSelectedUserRole(params.row.role)
  }


  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleUserChangesSubmit = (e) => {
    e.preventDefault()
    const updatedUser={...selectedUser, role:selectedUserRole}
    dispatch(updateUser(updatedUser))
    setOpenModal(false)
  }

  return (
    <>
    {loggedUser.role!=='admin' && <Navigate to={"/"}/>}
    <Box sx={{ height: "80vh", width: '100%' }}>
        <Typography variant='h3' gutterBottom>Users</Typography>
      <DataGrid 
        sx={{'& .MuiDataGrid-cell:focus': {
            outline: 'none',
            },}}
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick={true}
        disableColumnMenu={true}
        onCellClick={handleUserClick}
      />
    </Box>

    {openModal && <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2" gutterBottom>
            User Details
          </Typography>
          <Box>
            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Id : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedUser.id}
              </Typography>
            </Stack>

            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Full Name : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedUser.firstName} {selectedUser.lastName}
              </Typography>
            </Stack>

            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Email : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedUser.email}
              </Typography>
            </Stack>

            <Stack direction={"row"} >
              <Typography id="modal-modal-title" fontSize={20} sx={{ fontWeight: 'bold' }}  >
                Phone : &nbsp;
              </Typography>
              <Typography id="modal-modal-description" fontSize={20}  >
                {selectedUser.phone}
              </Typography>
            </Stack>
          </Box>

          <Box mt={3}  >
            <form onSubmit={handleUserChangesSubmit} >
              <Stack direction={'column'} gap={2}>
                <Stack direction={"row"}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Role</InputLabel>
                  <Select
                    id="demo-simple-select"
                    label="status"
                    onChange={(e)=>setSelectedUserRole(e.target.value)}
                    value={selectedUserRole}
                  >
                    <MenuItem value={'admin'}>Admin </MenuItem>
                    <MenuItem value={"user"}>User</MenuItem>
                    
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

        </Box>
      </Modal>}
    </>
    
  );
}