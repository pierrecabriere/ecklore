import React, { Fragment, FunctionComponent } from 'react';
import { GraphandForm } from 'graphand-react';
import { GraphandFieldNumber } from 'graphand-js';
import { Dialog, Transition } from '@headlessui/react';
import { addSeconds } from 'date-fns';
import Auction from '../../models/Auction';
import graphandClient from '../../lib/graphand';

const AddAuctionModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: Function }) => {
  const handleCreateAuction = async (values: any) => {
    const Media = graphandClient.getModel('Media');
    let image;

    if (values.image instanceof File) {
      image = await Media.create({ file: values.image });
    }

    const endDate = addSeconds(new Date(), values.pendingSeconds);

    const auction = await Auction.create({ ...values, image, endDate });
    onClose(auction);
  };

  const renderForm: FunctionComponent<any> = ({ fields, formRef, handleSubmit, isLoading }) => (
    <form ref={formRef} onSubmit={handleSubmit} className={isLoading ? 'opacity-50' : ''}>
      <div className="mt-2">
        <p className="text-sm text-gray-500">Besoin de vendre un objet ? Vous pouvez créer une enchère !</p>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>

      <div>
        {fields.render(
          'image',
          {
            className: 'col-span-6 sm:col-span-4',
            placeholder: `giraffe-ink.png`,
          },
          false,
        )}
        {fields.render('title')}
        {fields.render('description', { type: 'textarea' })}
        {fields.render('price')}
        {fields.render('pendingSeconds')}
      </div>

      <div className="flex items-center flex-row-reverse mt-4">
        <button
          type="submit"
          className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
          font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Valider
        </button>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
          font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => onClose()}
        >
          Annuler
        </button>
      </div>
    </form>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => onClose()}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-50" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left
              align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Créer une enchère
              </Dialog.Title>

              <GraphandForm
                model={Auction}
                onSubmit={handleCreateAuction}
                fields={(fields: any) =>
                  Object.assign(fields, {
                    pendingSeconds: new GraphandFieldNumber({ name: 'Secondes restantes' }),
                  })
                }
              >
                {renderForm}
              </GraphandForm>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddAuctionModal;
