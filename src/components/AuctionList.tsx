import React, { FunctionComponent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AuctionListItem from './AuctionListItem';
import Auction from '../models/Auction';
import AddAuctionModal from './modals/AddAuctionModal';

const AuctionList: FunctionComponent<any> = ({ hideAddTile, query }) => {
  const [isAddAuctionOpen, setIsAddAuctionOpen] = useState(false);

  return (
    <>
      <section aria-labelledby="product-heading" className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3">
        <h2 id="product-heading" className="sr-only">
          Liste des enchères
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:gap-6 sm:gap-10 lg:gap-8">
          {!hideAddTile ? (
            <div
              tabIndex={0}
              role="button"
              onClick={() => setIsAddAuctionOpen(true)}
              className="relative bg-white border-4 border-dashed border-gray-200 text-gray-300 rounded-lg cursor-pointer
        flex flex-col overflow-hidden flex items-center justify-center hover:text-blue-500 hover:border-blue-500 py-12"
            >
              <div className="font-medium p-2">Créer une enchère</div>
              <FontAwesomeIcon icon={faPlus} size="3x" />
            </div>
          ) : null}

          {Auction.getList({ query, sort: 'endDate' }).suspense(
            (auctions: Auction[]) => auctions.map((auction: Auction) => <AuctionListItem key={auction._id} item={auction} />),
            {
              fallback: <div>Chargement des enchères ...</div>,
            },
          )}
        </div>
      </section>

      <AddAuctionModal isOpen={isAddAuctionOpen} onClose={() => setIsAddAuctionOpen(false)} />
    </>
  );
};

export default AuctionList;
