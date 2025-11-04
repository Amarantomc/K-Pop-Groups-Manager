import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import NavBar from '../navbar/Navbar'
import "../../styles/dashboard.css"


const Dashboard : React.FC = () =>{
  return (
    <div className='dashboard-sidebar'>
      <Sidebar/>
      <div className='dashboard-navbar'>
        <NavBar/>
        home Container
      </div>
    </div>
  )
}

export default Dashboard;