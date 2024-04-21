import { useEffect, useState } from 'preact/hooks'
import preactLogo from '../../assets/preact.svg'
import "./dashboard.css";
import * as fcl from '@onflow/fcl'
import viteLogo from '/vite.svg'
import { Card } from '../../components/Card/Card';
import { Navbar } from '../../components/Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



fcl.config({
  'accessNode.api': 'http://127.0.0.1:8888'
})




export function Dashboard() {

  const [courses,setcourses] = useState([]) 
  const navigate = useNavigate()
  const getcourses = async ()=>{
    const resp = await axios.get("http://localhost:7000/courses")
    if(resp.status==200){
      setcourses(resp.data)
    }
    
    
    }
    
    
    useEffect(()=>{
      getcourses()
    },[])




    return (
      <div style={{overflowY:"scroll",height:"100vh"}}>
      <Navbar/>
      <div className='grid-container' >

        {courses.map((course,index)=>{
          return(
            <div key={index}  onClick={()=>{
              navigate(`/course/${course._id}`)
            }}>
              <Card data={course}/>
            </div>
            
          )
        })}
        
        
       
      </div>
      </div>
    )
  }