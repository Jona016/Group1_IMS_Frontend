import React from 'react';
import { Route, Routes } from 'react-router-dom';
import auth from './src/lib/auth-helper';
import Layout from './src/components/Layout';
import Signup from './src/users/Signup';
import Signin from './src/users/Signin';
import Home from './src/components/Home';
import PrivateRoute from './src/lib/PrivateRoute';
import Footer from './src/components/Footer';
import NewIncident from './src/incidents/NewIncident';
import ListIncident from './src/incidents/ListIncident';
import EditIncident from './src/incidents/EditIncident';
import AdminRoute from './src/lib/AdminRoute';
import ListUser from './src/users/ListUser';
import EditUser from './src/users/EditUser';
import Profile from './src/users/Profile'

const isAuthenticated = auth.isAuthenticated();
console.log(isAuthenticated);

const MainRouter = () => {
  return (
    <div>
      {isAuthenticated && isAuthenticated?.user && <Layout />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/incidents/new"
          element={
            <PrivateRoute>
              <NewIncident />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/incidents"
          element={
            <PrivateRoute>
              <ListIncident />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/incidents/edit/:incidentId"
          element={
            <PrivateRoute>
              <EditIncident />
            </PrivateRoute>
          }
        />

        <Route
          exact
          path="/profile"
          element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>
          }
        />

        <Route
          exact
          path="/edit/:userId"
          element={
            <PrivateRoute>
              <EditUser/>
            </PrivateRoute>
          }
        />
        {/******** admin *********/}
        <Route
          exact
          path="/admin/users"
          element={
            <AdminRoute>
              <ListUser />
            </AdminRoute>
          }
        />

        <Route
          exact
          path="/admin/users/:userId"
          element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          }
        />
        <Route
          exact
          path="/admin/edit/:userId"
          element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          }
        />

        <Route
          exact
          path="/admin/profile"
          element={
            <AdminRoute>
              <Profile />
            </AdminRoute>
          }
        />

        <Route
          exact
          path="/admin/incidents"
          element={
            <AdminRoute>
              <ListIncident />
            </AdminRoute>
          }
        />

        <Route
          exact
          path="/admin/incidents/edit/:incidentId"
          element={
            <AdminRoute>
              <EditIncident />
            </AdminRoute>
          }
        />

        <Route
          exact
          path="/admin/incidents/new"
          element={
            <AdminRoute>
              <NewIncident />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default MainRouter;
