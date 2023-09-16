import { Box,Card,Typography } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { selectAssignedTasks, selectDoneTasks, selectInprogressTasks, selectTasks } from '../redux/tasksSlice';
ChartJS.register(ArcElement, Tooltip, Legend);

//incomlpete


const Dashboard = () => {
  const tasks = useSelector(selectTasks)
  const assignedTasks = useSelector(selectAssignedTasks)
  const doneTasks = useSelector(selectDoneTasks)
  const inprogressTaks=useSelector(selectInprogressTasks)
 
 
  const data = {
    labels: ['Assigned', 'Done','In Progress'],
    datasets: [
      {
        label:["Tasks"],
        data: [assignedTasks, doneTasks,inprogressTaks ],
        backgroundColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            "rgba(255, 99, 132, 1)"
        ],
      },
    ],
  };
  return (
    <Box display={'flex'} flexDirection={"column"} minHeight={"90vh"}  alignItems={'center'} justifyContent={'center'}>
        <Typography variant='h3' gutterBottom> Dashboard </Typography>
        {
          tasks.length===0 ? <Typography variant='h5' gutterBottom> No Tasks to show, have an eye on your mailbox for new assigned tasks  </Typography>
                :
            <Card sx={{p:2,width:"600px"}} variant="outlined">
              <Typography> Task Stats</Typography>
              <Pie data={data}></Pie>
            </Card>

        }

    </Box>
  )
}

export default Dashboard