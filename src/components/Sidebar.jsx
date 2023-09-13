/* eslint-disable react/prop-types */

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser, selectLoggedUser } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import { Toolbar, Typography } from '@mui/material';


const drawerWidth = 200;

export default function Sidebar({ children }) {
    const loggedUser = useSelector(selectLoggedUser);
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const handleLogout=()=>{
        dispatch(logoutUser())
        navigate("/login")
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar> <Typography fontWeight={"bold"}>Task Management System</Typography>  </Toolbar>
                <Divider />
                <List >
                     <Link style={{ textDecoration: 'none', color:"black" }} to={"/"}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Dashboard"} />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                    <Link style={{ textDecoration: 'none', color:"black" }} to={"/tasks"}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AssignmentIcon></AssignmentIcon>
                                </ListItemIcon>
                                <ListItemText primary={"Tasks"} />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                   {loggedUser.role==='admin' && <Link style={{ textDecoration: 'none', color:"black" }} to={"/users"}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PeopleAltIcon></PeopleAltIcon>
                                </ListItemIcon>
                                <ListItemText primary={"Users"} />
                            </ListItemButton>
                        </ListItem>
                    </Link>}

                    <Link style={{ textDecoration: 'none', color:"black" }} to={'/profile'}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountCircleIcon></AccountCircleIcon>
                                </ListItemIcon>
                                <ListItemText primary={"Profile"} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link style={{ textDecoration: 'none', color:"black" }} onClick={handleLogout}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LogoutIcon></LogoutIcon>
                                </ListItemIcon>
                                <ListItemText primary={"Logout"} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
                {/* <Divider /> */}
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                {children}
            </Box>
        </Box>
    );
}