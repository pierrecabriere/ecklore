import React, { useState, useEffect, FunctionComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import authmanager from '../lib/authmanager';
import graphandClient from '../lib/graphand';

const Navbar: FunctionComponent<any> = ({ history }) => {
  const [user, setUser] = useState(authmanager.user);

  useEffect(() => {
    const userSub = authmanager.userSubject.subscribe(setUser);

    return () => userSub.unsubscribe();
  }, []);

  const logout = () => {
    authmanager.logout();
    graphandClient.logout();
    history.push('/');
  };

  return authmanager.user ? (
    <div>
      {user.fullname}{' '}
      <button type="button" onClick={logout}>
        Déconnexion
      </button>
    </div>
  ) : (
    <Link to="/login">
      <button type="button">Connexion</button>
    </Link>
  );
};

export default withRouter(Navbar);
