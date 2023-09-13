import { Box, Paper, Stack, Typography,TextField,Avatar, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedUser, updateUserProfile } from '../redux/authSlice'
import { useState } from 'react'


const Profile = () => {
    const loggedUser=useSelector(selectLoggedUser)
    const [firstName,setFirstName]=useState(loggedUser?.firstName)
    const [lastName,setLastName]=useState(loggedUser?.lastName)
    const [phone,setPhone]=useState(loggedUser?.phone)
    const dispatch=useDispatch()

    const handleProfileSave=()=>{
        const newProfile={...loggedUser,firstName,lastName,phone}
        dispatch(updateUserProfile(newProfile))
    }
    const handleCancel=()=>{
        setFirstName(loggedUser?.firstName)
        setLastName(loggedUser?.lastName)
        setPhone(loggedUser?.phone)
    }
  return (
    
    <Box display={'flex'} justifyContent={'center'}>
        <Paper sx={{p:3,bgcolor:'whitesmoke',width:'60vw'}} > 
            <Typography align='center' variant='h3' gutterBottom>Profile</Typography>
            <Stack direction={'row'} gap={3} alignItems={'center'}>
                <Avatar sx={{width:128, height:128,fontSize:70}}>{firstName?.charAt(0)}{lastName?.charAt(0)}</Avatar>
                <TextField sx={{flexGrow:1}} label='First Name' 
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                ></TextField>
                <TextField sx={{flexGrow:1}} label='Last Name' 
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
                 
                 ></TextField>
            </Stack>
            <Stack direction={'row'} gap={3} alignItems={'center'} mt={3}>
                <TextField sx={{flexGrow:1}} label='Email' value={loggedUser.email} disabled></TextField>
                <TextField sx={{flexGrow:1}} label='Phone Number' 
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                  ></TextField>
            </Stack>
            <Box display={'flex'} flexDirection={'row-reverse'} mt={4} gap={3}>
                <Button size='large' sx={{width:120}} onClick={handleCancel} variant='outlined'>Cancel </Button>
                <Button variant='contained' sx={{width:120}} onClick={handleProfileSave}>Save</Button>
                <TextField label='Role' disabled sx={{flexGrow:1}} value={loggedUser.role}></TextField>
            </Box>
        </Paper>

    </Box>
  )
}

export default Profile