import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom';
import authmanager from '../lib/authmanager';
import graphandClient from '../lib/graphand';

const Navbar = ({ history }: RouteComponentProps) => {
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

  return (
    <div className="w-full border-b border-gray-300 bg-white">
      <div className="py-6 max-w-screen-xl mx-auto flex flex-row-reverse items-center justify-between">
        {user ? (
          <>
            <div className="flex flex-row">
              <strong>{user.fullname}</strong>
              <button type="button" onClick={logout} className="block cursor-pointer px-4 font-medium hover:text-blue-500">
                Déconnexion
              </button>
            </div>
            <Link to="/" className="block cursor-pointer px-4 font-medium hover:text-blue-500">
              <strong>Ecklore</strong>
            </Link>
          </>
        ) : (
          <div className="flex flex-row">
            <Link to="/login" className="block cursor-pointer px-4 font-medium hover:text-blue-500">
              Connexion
            </Link>
            <Link to="/register" className="block cursor-pointer px-4 font-medium hover:text-blue-500">
              Inscription
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(Navbar);
