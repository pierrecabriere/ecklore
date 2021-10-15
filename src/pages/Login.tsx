import React, { FunctionComponent } from 'react';
import { GraphandForm } from 'graphand-react';
import { Link } from 'react-router-dom';
import authmanager from '../lib/authmanager';
import Account from '../models/Account';

const Login = () => {
  const handleLogin = async (values: any) => {
    await authmanager.login(values);
  };

  const renderForm: FunctionComponent<any> = ({ fields, formRef, handleSubmit, isLoading }) => (
    <form ref={formRef} onSubmit={handleSubmit} className={isLoading ? 'opacity-50' : ''}>
      <div className="card bg-white rounded-lg shadow divide-y divide-gray-200" onSubmit={handleSubmit}>
        <div className="border-b border-gray-200 px-6 py-10">
          <img src="giraffe-ink.png" alt="Giraffe Ink." className="w-56 mb-4 mx-auto" />
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Bienvenue sur ecklore.test</h1>
          <p className="mt-4 text-base text-gray-500">
            Bienvenue sur ecklore.test. Si vous avez déjà un compte, vous pouvez vous connecter à la plateforme d&apos;enchères grâce au formulaire
            ci-dessous.
            <br />
            Si vous n&apos;avez pas encore de compte, vous pouvez dès maintenant{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              créer un compte
            </Link>
            .
          </p>
        </div>
        <div className="w-full flex flex-col p-6">
          <div className="card-body py-4 w-full">
            {fields.render('email', { type: 'email' })}
            {fields.render('password', { type: 'password' })}
          </div>
          <div className="card-footer text-muted w-full flex justify-end">
            <button
              type="submit"
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
          font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="py-8 sm:px-8 bg-gray-100 min-h-screen flex items-center">
      <div className="max-w-screen-md w-full mx-auto space-y-4 sm:space-y-8">
        <GraphandForm model={Account} onSubmit={handleLogin}>
          {renderForm}
        </GraphandForm>
      </div>
    </div>
  );
};

export default Login;
