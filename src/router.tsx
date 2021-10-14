import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { loggedGuard, notLoggedGuard } from './utils/guards';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import authmanager from './lib/authmanager';
import graphandClient from './lib/graphand';
import Navbar from './components/Navbar';

const Router = () => {
  useEffect(() => {
    const token = authmanager.getToken();
    if (token) {
      graphandClient.accessToken = token;
      authmanager.sync();
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route component={notLoggedGuard(Login)} exact path="/login" />
        <Route component={loggedGuard(Dashboard)} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
