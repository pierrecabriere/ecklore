import React, { Attributes, useState } from 'react';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import Auction from '../models/Auction';
import Bid from '../models/Bid';
import AddBidModal from './modals/AddBidModal';
import Account from '../models/Account';
import authmanager from '../lib/authmanager';
import BuyModal from './modals/BuyModal';

const AuctionListItem = ({ item }: Attributes & { item: Auction }) => {
  const [isAddBidOpen, setIsAddBidOpen] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const isExpired = item.endDate <= new Date();

  return (
    <>
      <div
        className={`group relative bg-white border-2 rounded-lg flex flex-col overflow-hidden ${isExpired ? 'border-blue-500' : 'border-gray-200'}`}
      >
        <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-64">
          {item.image?._id ? (
            <img src={item.image.getUrl({ w: 500 })} alt={item.title} className="w-full h-full object-center object-cover sm:w-full sm:h-full" />
          ) : (
            <img src="giraffe-ink.png" alt={item.title} className="w-full h-full object-center object-cover sm:w-full sm:h-full" />
          )}
        </div>
        <div className="flex-1 p-4 space-y-2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900">
            {isExpired ? '[Terminé] - ' : ''}
            {item.title}
          </h3>
          {isExpired ? (
            <p className="text-sm font-medium text-gray-500">
              Vente terminée il y a {formatDistance(item.endDate, new Date(), { locale: fr, includeSeconds: true })}
            </p>
          ) : (
            <p className="text-sm font-medium text-gray-500">
              Fin : {formatDistance(new Date(), item.endDate, { locale: fr, includeSeconds: true })}
            </p>
          )}
          <p className="text-sm text-gray-500 line-clamp-3">{item.description}</p>

          {Bid.getList({ query: { auction: item }, pageSize: 1, sort: '-price' }).suspense((bids: any) => (
            <div>
              <p className="text-sm italic text-gray-500">Prix de référence : {item.price} €</p>
              {bids.length ? (
                <>
                  <p className="text-base font-medium text-gray-900">
                    {bids[0].price} €{' '}
                    <span className="text-sm text-gray-500">
                      ({bids.count} enchère{bids.count > 1 ? 's' : ''})
                    </span>
                  </p>
                  {bids[0].createdBy.suspense((account: Account) =>
                    account ? (
                      <p className="text-sm italic text-gray-500">
                        Vainqueur {!isExpired ? 'temporaire' : null} : {account.fullname}
                      </p>
                    ) : null,
                  )}
                </>
              ) : (
                <p className="text-base font-medium text-gray-900">Aucune enchère</p>
              )}
              <div className="space-x-2">
                {isExpired && bids[0]?.createdBy === authmanager.user && !item.bought ? (
                  <>
                    <button type="button" className="text-sm font-medium text-blue-500 hover:text-blue-700" onClick={() => setIsBuyOpen(true)}>
                      Acheter
                    </button>

                    <BuyModal auction={item} bid={bids[0]} isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
                  </>
                ) : !isExpired ? (
                  <button type="button" className="text-sm font-medium hover:text-blue-500 text-left" onClick={() => setIsAddBidOpen(true)}>
                    Enchérir {bids[0]?.createdBy === authmanager.user ? <span className="text-xs">(vous êtes déjà le vainqueur actuel)</span> : null}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddBidModal auction={item} isOpen={isAddBidOpen} onClose={() => setIsAddBidOpen(false)} />
    </>
  );
};

export default AuctionListItem;
