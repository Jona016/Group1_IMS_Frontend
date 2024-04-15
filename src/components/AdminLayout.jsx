// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Logo from '../assets/Logo.jpg';
// import auth from '../lib/auth-helper'

// const PrivateLayout = ({ children }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     console.log(auth)
//    auth.clearJWT(()=>{
//      window.location.href = '/'

//    });
//   };

//   return (
//     <>
//       <div>
//         <nav>
//           <div className='container'>
//             <Link to="/admin"><img src={Logo} alt="Company Logo" className="logo" width="60px" height="60px" /></Link>
//             <Link to="/admin"> <p>Incident Management System</p></Link>
//             <Link to="/admin/incidents">Admin</Link>
//             <Link to="/admin/users">Users</Link>
//             <Link to="/admin/incidents">Incidents</Link>
//             <Link to="/admin/profile">Profile</Link>
//             <Link onClick={handleLogout}>Logout</Link>
//           </div>
//         </nav>
//       </div>
//       {children}
//     </>
//   );
// }

// export default PrivateLayout;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.jpg';
import auth from '../lib/auth-helper';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';

const PrivateLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.clearJWT(() => {
      window.location.href = '/';
    });
  };

  return (
    <>
      <div>
        <nav>
          <div className='container'>
          <div className='left-nav'>
            <Link to="/admin/incidents"><img src={Logo} alt="Company Logo" className="logo" width="60px" height="60px" /></Link>
            <Link to="/admin/incidents"><p>Incident Management System - Admin</p></Link>
            </div>
            <div className='right-nav'>
              <Link to="/admin/incidents" className='navTitle'><HomeIcon style={{ fontSize: 20 }} /> Incidents</Link>
              <Link to="/admin/users" className='navTitle'><PersonIcon style={{ fontSize: 20 }} /> Users</Link>
              <Link to="/admin/profile" className='navTitle'><PersonIcon style={{ fontSize: 20 }} /> Profile</Link>
              <Link onClick={handleLogout} className='navTitle'><ExitToAppIcon style={{ fontSize: 20 }} /> Logout</Link>
            </div>
          </div>
        </nav>
      </div>
      {children}
    </>
  );
}

export default PrivateLayout;
