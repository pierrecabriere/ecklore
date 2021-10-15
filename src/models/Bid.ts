import { GraphandModelData } from 'graphand-js';
import Account from './Account';

class Bid extends GraphandModelData {
  static apiIdentifier = 'bid';

  // returns the winning price if the account is the winner or false if not
  async getWinningPrice(account: Account) {
    // @ts-ignore
    const auction = await this.auction;
    if (!auction) {
      return false;
    }

    // @ts-ignore
    if (account._id !== this.createdBy?._id) {
      return false;
    }

    // @ts-ignore
    const winningBid = await Bid.get({ query: { auction, createdBy: { $ne: account } }, pageSize: 1, sort: '-price' });
    const winningPrice = winningBid?.price > auction.price ? winningBid.price : auction.price;

    return winningPrice;
  }
}

export default Bid;
