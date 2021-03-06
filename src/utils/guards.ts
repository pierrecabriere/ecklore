import React, { ComponentClass, FunctionComponent, useState, useEffect, Attributes } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import authmanager from '../lib/authmanager';

export const loggedGuard = (GuardedComponent: ComponentClass | FunctionComponent) => {
  const guard = ({ bypassGuard, ...props }: { bypassGuard: boolean } & Attributes) => {
    let loggedSub: any;
    const [logged, setLogged]: any = useState(authmanager.logged);

    useEffect(() => {
      loggedSub = authmanager.loggedSubject.subscribe(setLogged);

      return () => {
        loggedSub.unsubscribe();
      };
    }, []);

    if (bypassGuard || logged) {
      return React.createElement(GuardedComponent, props);
    }

    const LoginPageComponent = require('../pages/Login').default;
    return React.createElement(LoginPageComponent, props);
  };

  return guard;
};

export const notLoggedGuard = (GuardedComponent: ComponentClass | FunctionComponent) => {
  const guard = ({ bypassGuard, history, ...props }: RouteComponentProps & { bypassGuard: boolean } & Attributes) => {
    let loggedSub: any;
    const [logged, setLogged]: any = useState(authmanager.logged);

    useEffect(() => {
      loggedSub = authmanager.loggedSubject.subscribe(setLogged);

      return () => {
        loggedSub.unsubscribe();
      };
    }, []);

    if (bypassGuard) {
      return React.createElement(GuardedComponent, props);
    }

    if (logged) {
      history.push('/');
    }

    return React.createElement(GuardedComponent, props);
  };

  return withRouter(guard);
};
