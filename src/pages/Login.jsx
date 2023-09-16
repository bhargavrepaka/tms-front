
import { Box, Paper, Stack } from '@mui/material'
import { Typography, Button } from '@mui/material'
import { TextField } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkUserLogin, selectLoggedUser } from '../redux/authSlice'
import { Link, Navigate } from 'react-router-dom'
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const loggedUser=useSelector(selectLoggedUser)
    const dispatch = useDispatch()
    const handleLoginSubmit = (e) => {
        e.preventDefault()
        dispatch(checkUserLogin({ email, password }))

    }

    return (
    <>
    {loggedUser && <Navigate to={"/"}/>}
    <Box display={'flex'} flexDirection={"column"} p={10}   direction={'row'} alignItems={'center'}  minHeight={"100vh"}  >  
            <Typography variant='h2' mb={15}>Task Management System</Typography>
            <Paper  sx={{ padding: "16px", width: '400px' }} >
                <Typography variant='h2' align='center' gutterBottom> Login </Typography >

                <form onSubmit={handleLoginSubmit}>
                    <Stack direction={'column'} gap={2}>
                        <TextField
                            label="Email"
                            value={email}
                            id='email'
                            type='email'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            value={password}
                            type='password'
                            id='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Stack direction={'row'} gap={2}>
                            <Button variant="contained" type='submit'>Login</Button>
                            <Link> <Button variant='text'  >No account?</Button></Link>
                        </Stack>

                    </Stack>
                </form>
            </Paper>
        </Box>
    </>
    )
}

export default Login