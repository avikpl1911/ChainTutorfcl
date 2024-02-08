
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { Dashboard } from './Pages/Dashboard/Dashboard';
import { Navbar } from './components/Navbar/Navbar';
import Course from './Pages/Course/Course';
import Login from './Pages/login/Login';
import {  Confg } from './smartcontracts/reactfunccad/Auth';
import SignUp from './Pages/login/Signup';
import PrivateRoutes from './PrivateRoutes';
import { useEffect, useState } from 'preact/hooks';

 

   


const router = createBrowserRouter(
  createRoutesFromElements(
   
    <Route path="/"  >
  
        


         <Route element={<PrivateRoutes/>}>
               <Route index element={<Dashboard/>}/>
               <Route path='course' element={<Course/>}/>
          </Route>

         
        
         
         <Route path='login' element={<Login/>} />
         

         <Route path='signup' element={<SignUp/>} />

    </Route>
      
     
   
  
  )
)


export function App({routes}) {
  




  return (
    
    
      <RouterProvider router={router}/>
    
    
  )
}
