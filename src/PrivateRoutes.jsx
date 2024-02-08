import { useEffect, useState } from 'preact/hooks'
import { Navigate, Outlet } from 'react-router-dom'
import * as fcl from "@onflow/fcl"
import { Confg } from './smartcontracts/reactfunccad/Auth'

    
   
export default function PrivateRoutes(){
    
const token = localStorage.getItem("user")
console.log(token)
return (

    token  ? <Outlet/> : <Navigate to='/login'/>
  )


}
