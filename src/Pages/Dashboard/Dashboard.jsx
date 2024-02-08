import { useEffect, useState } from 'preact/hooks'
import preactLogo from '../../assets/preact.svg'
import "./dashboard.css";
import * as fcl from '@onflow/fcl'
import viteLogo from '/vite.svg'
import { Card } from '../../components/Card/Card';
import { Navbar } from '../../components/Navbar/Navbar';

fcl.config({
  'accessNode.api': 'http://127.0.0.1:8888'
})


export function Dashboard() {
 


    return (
      <>
      <Navbar/>
      <div className='grid-container'>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
       
      </div>
      </>
    )
  }