import React, { FunctionComponent } from 'react';
import { GraphandFieldText, GraphandValidationError } from 'graphand-js';
import { GraphandForm } from 'graphand-react';
import { Link } from 'react-router-dom';
import Account from '../models/Account';
import authmanager from '../lib/authmanager';

const Register = () => {
  const handleRegister = async (values: { firstname: string; lastname: string; email: string; password: string; confirmPassword: string }) => {
    const { firstname, lastname, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      throw new GraphandValidationError('Les mots de passe ne correspondent pas', 'confirmPassword');
    }

    await Account.register({ firstname, lastname, email, password, role: '616719e3a001af0f43212ed3' });
    await authmanager.login({ email, password });
  };

  const renderForm: FunctionComponent<any> = ({ fields, formRef, handleSubmit, isLoading }) => (
    <form ref={formRef} onSubmit={handleSubmit} className={isLoading ? 'opacity-50' : ''}>
      <div className="card bg-white rounded-lg shadow divide-y divide-gray-200" onSubmit={handleSubmit}>
        <div className="border-b border-gray-200 px-6 py-10">
          <img src="giraffe-ink.png" alt="Giraffe Ink." className="w-56 mb-4 mx-auto" />
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Créez votre compte ecklore.test</h1>
          <p className="mt-4 text-base text-gray-500">
            Bienvenue sur ecklore.test. Si vous êtes ici, c&apos;est que vous n&apos;avez pas encore de compte.
            <br />
            Merci de compléter le formulaire ci-dessous pour créer votre compte dès maintenant et commencer à utiliser la plateforme d&apos;enchères.
            <br />
            Si vous avez déjà un compte,{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              c&apos;est par ici !
            </Link>
          </p>
        </div>
        <div className="w-full flex flex-col p-6">
          <div className="card-body py-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              {fields.render('firstname')}
              {fields.render('lastname')}
            </div>
            {fields.render('email', { type: 'email' })}
            {fields.render('password', { type: 'password' })}
            {fields.render('confirmPassword', { type: 'password' })}
          </div>
          <div className="card-footer text-muted w-full flex justify-end">
            <button
              type="submit"
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
          font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              S&apos;inscrire
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
          model={Account}
          fields={(fields: object) =>
            Object.assign(fields, {
              confirmPassword: new GraphandFieldText({
                name: 'Confirmation du mot de passe',
              }),
            })
          }
          onSubmit={handleRegister}
        >
          {renderForm}
        </GraphandForm>
      </div>
    </div>
  );
};

export default Register;
