import React, { Fragment, FunctionComponent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Auction from '../../models/Auction';
import Bid from '../../models/Bid';
import authmanager from '../../lib/authmanager';
import Buy from '../../models/Buy';

const BuyModal: FunctionComponent<any> = ({ isOpen, onClose, auction, bid }: { auction: Auction; bid: Bid; isOpen: boolean; onClose: Function }) => {
  if (bid.createdBy?._id !== authmanager.user._id || auction.endDate > new Date()) {
    throw new Error("Vous essayer d'acheter un objet dont vous n'avez pas remporté l'enchère");
  }

  const handleBuy = async (price: number) => {
    let validated;

    try {
      const buy = await Buy.create({ bid, price });
      validated = buy.validated;
    } catch (e) {
      validated = false;
    }

    if (validated) {
      alert('Achat effectué avec succès, merci !');
    } else {
      alert('Une erreur est survenue, merci de réessayer plus tard');
    }
  };

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
                Acheter &quot;{auction.title}&quot;
              </Dialog.Title>

              {Bid.getList({ query: { auction, createdBy: { $ne: bid.createdBy } }, pageSize: 1, sort: '-price' }).suspense((bids: Bid[]) => {
                // final price is the second winner highest price or the auction's reserve price in case
                // no winner is designated
                const finalPrice = bids[0] ? bids[0].price : auction.price;

                return (
                  <>
                    <div className="mt-2">
                      <p className="text-sm">
                        Vous avez remporté l&apos;enchère <strong>{auction.title}</strong> initialement au prix de réserve de{' '}
                        <strong>{auction.price} €</strong>.<br />
                        Votre dernière offre au prix de {bid.price} € vous a permis de remporter cette vente au prix final de{' '}
                        <strong>{finalPrice} €</strong>.<br />
                      </p>
                    </div>

                    <div className="flex items-center flex-row-reverse mt-4">
                      <button
                        type="button"
                        className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
          font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={() => handleBuy(finalPrice)}
                      >
                        Acheter
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
                  </>
                );
              })}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BuyModal;
