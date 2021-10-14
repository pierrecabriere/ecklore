import React, { FunctionComponent } from 'react';
import { GraphandFieldText } from 'graphand-js';
import { GraphandForm } from 'graphand-react';
import authmanager from '../lib/authmanager';

const Login = () => {
  const handleLogin = async (values: any) => {
    await authmanager.login(values);
  };

  const renderForm: FunctionComponent<any> = ({ fields, formRef, handleSubmit, isLoading }) => (
    <form ref={formRef} onSubmit={handleSubmit} className={isLoading ? 'opacity-50' : ''}>
      <div className="card bg-white rounded-lg shadow divide-y divide-gray-200" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col p-6">
          <div className="card-body py-4 w-full">
            {fields.render('email')}
            {fields.render('password', { inputType: 'password' })}
          </div>
          <div className="card-footer text-muted w-full flex justify-end">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
              text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type={isLoading ? 'button' : 'submit'}
            >
              Connexion
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="py-8 sm:px-8 bg-gray-100 min-h-screen flex items-center">
      <div className="max-w-screen-md w-full mx-auto space-y-4 sm:space-y-8">
        <GraphandForm
          fields={{
            email: new GraphandFieldText({
              name: 'Adresse email',
            }),
            password: new GraphandFieldText({
              name: 'Mot de passe',
            }),
          }}
          fieldsOptions={{
            email: {
              type: 'email',
            },
            password: {
              type: 'password',
            },
          }}
          onSubmit={handleLogin}
        >
          {renderForm}
        </GraphandForm>
      </div>
    </div>
  );
};

export default Login;
