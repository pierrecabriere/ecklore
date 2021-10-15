import React from 'react';
import AuctionList from '../components/AuctionList';

const Dashboard = () => (
  <div className="px-4 py-6 max-w-screen-xl mx-auto">
    <div className="border-b border-gray-200 pt-10 pb-10">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Enchères en cours</h1>
      <p className="mt-4 text-base text-gray-500">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum egestas tortor risus, in volutpat orci ornare sed.
      </p>
    </div>
    <AuctionList query={{ query: { endDate: { $gte: new Date() } }, sort: 'endDate' }} />
    <div className="border-b border-gray-200 pt-10 pb-10">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Enchères terminées</h1>
      <p className="mt-4 text-base text-gray-500">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum egestas tortor risus, in volutpat orci ornare sed.
      </p>
    </div>
    <AuctionList query={{ query: { endDate: { $lt: new Date() } }, sort: '-endDate' }} hideAddTile />
  </div>
);

export default Dashboard;
