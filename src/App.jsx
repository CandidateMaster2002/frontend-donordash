// src/App.jsx
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import HeaderLoggedIn from './components/HeaderLoggedIn';
import { getRedirectPath } from './utils/services';
import { useLoading } from './hooks/LoadingContext';
import Loader from './components/Loader';
import { setupInterceptors } from './utils/myAxios'; // make sure this import path is correct

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const { isLoading, showLoader, hideLoader } = useLoading();

  // ✅ Setup axios interceptors once
  useEffect(() => {
    setupInterceptors({ showLoader, hideLoader });
  }, []);

  if (!user && location.pathname !== '/login-page' && location.pathname !== '/donor-signup') {
    return <Navigate to="/login-page" />;
  }

  if (user && location.pathname === '/') {
    return <Navigate to={getRedirectPath(user.userType)} />;
  }

  return (
    <div className="w-screen min-h-screen">
      {isLoading && <Loader />}
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <HeaderLoggedIn />
      </div>
      <div style={{ marginTop: '64px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
