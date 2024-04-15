import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.jpg';
import auth from '../lib/auth-helper'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';

const PrivateLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log(auth)
   auth.clearJWT(()=>{
     window.location.href = '/'

   });
  };

  return (
    <>
      <div>
        <nav>
          <div className='container'>
            <div className='left-nav'>
              <Link to="/incidents"><img src={Logo} alt="Company Logo" className="logo" width="60px" height="60px" /></Link>
              <Link to="/incidents"> <p>Incident Management System - User</p></Link>
            </div>
            <div className='right-nav'>
              <Link to="/incidents" className='navTitle'><HomeIcon style={{ fontSize: 15 }}/> Incidents</Link>
              <Link to="/profile" className='navTitle'><PersonIcon style={{ fontSize: 15 }} /> Profile</Link>
              <Link onClick={handleLogout} className='navTitle'><ExitToAppIcon style={{ fontSize: 15 }}/> Logout</Link>
            </div>
          </div>
        </nav>
      </div>
      {children}
    </>
  );
}

export default PrivateLayout;
