import Graphand from 'graphand-js';
import { addSeconds } from 'date-fns';
import Account from '../models/Account';
import Auction from '../models/Auction';
import Bid from '../models/Bid';
import Buy from '../models/Buy';

const accessToken = `\
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\
eyJpZCI6IjYxNjhiYjRkOWFiOGZkM2E4MGMyMzlkMCIsInR5cGUiOiJ0b2tlbiIsImlhdCI6MTYzNDI1MzY0NX0.\
d0SR_aUIQrJGreeYVw6EeHhFPCekY8zJLX6j-Cbv7Ds\
`;

const graphandClient = new Graphand({
  project: '616719d19ab8fd240dbb95df',
  models: [Account, Auction, Bid, Buy],
  accessToken,
});

jest.setTimeout(10000);

const _getUsers = async () => {
  const accounts = await Account.getList({
    query: { email: { $in: ['user-a@gmail.com', 'user-b@gmail.com', 'user-c@gmail.com', 'user-d@gmail.com', 'user-e@gmail.com'] } },
  });

  return accounts;
};
const _createBidForAccount = async ({ account, auction, price }: any) => {
  const token = await account.generateToken();

  const userClient = graphandClient.clone({ accessToken: token });
  return userClient.getModel('Data:bid').create({ auction, price });
};
const _clean = async ({ auction, bids }: any) => {
  await Bid.delete({ ids: bids.map((bid: any) => bid._id) });
  await auction.delete();
};
const _createUsers = async () => {
  const accounts = await Account.create([
    { firstname: 'User', lastname: 'A', email: 'user-a@gmail.com', password: 'test123', role: '616719e3a001af0f43212ed3' },
    { firstname: 'User', lastname: 'B', email: 'user-b@gmail.com', password: 'test123', role: '616719e3a001af0f43212ed3' },
    { firstname: 'User', lastname: 'C', email: 'user-c@gmail.com', password: 'test123', role: '616719e3a001af0f43212ed3' },
    { firstname: 'User', lastname: 'D', email: 'user-d@gmail.com', password: 'test123', role: '616719e3a001af0f43212ed3' },
    { firstname: 'User', lastname: 'E', email: 'user-e@gmail.com', password: 'test123', role: '616719e3a001af0f43212ed3' },
  ]);

  return accounts;
};
const _createAuction = async (price: number) => Auction.create({ title: 'Test', price, endDate: addSeconds(new Date(), 10) });

beforeAll(async () => {
  await _createUsers();
});

afterAll(async () => {
  const users = await _getUsers();
  const ids = users.map((u: any) => u._id);

  await Account.delete({ ids });
});

test('Winning price should be as expected', async () => {
  // eslint-disable-next-line no-unused-vars
  const [userA, userB, userC, userD, userE] = await _getUsers();
  const auction = await _createAuction(100);

  const bids = await Promise.all([
    // User A
    _createBidForAccount({ account: userA, auction, price: 110 }),
    _createBidForAccount({ account: userA, auction, price: 130 }),

    // User B

    // User C
    _createBidForAccount({ account: userC, auction, price: 125 }),

    // User D
    _createBidForAccount({ account: userD, auction, price: 105 }),
    _createBidForAccount({ account: userD, auction, price: 115 }),
    _createBidForAccount({ account: userD, auction, price: 90 }),

    // User E
    _createBidForAccount({ account: userE, auction, price: 132 }),
    _createBidForAccount({ account: userE, auction, price: 135 }),
    _createBidForAccount({ account: userE, auction, price: 140 }),
  ]);

  // the winner should be the user E (last bid) with a winning price of 130
  const winningPrice = await bids[8].getWinningPrice(userE);
  expect(winningPrice).toEqual(130);

  await _clean({ auction, bids });
});

test('Winning price should be the auction price', async () => {
  // eslint-disable-next-line no-unused-vars
  const [userA] = await _getUsers();
  const auction = await _createAuction(100);

  const bids = await Promise.all([
    // User A
    _createBidForAccount({ account: userA, auction, price: 50 }),
    _createBidForAccount({ account: userA, auction, price: 60 }),
  ]);

  const winningPrice = await bids[1].getWinningPrice(userA);
  expect(winningPrice).toEqual(100);

  await _clean({ auction, bids });
});

test('Wrong user should not be able to win the auction', async () => {
  // eslint-disable-next-line no-unused-vars
  const [userA, userB] = await _getUsers();
  const auction = await _createAuction(100);

  const bids = await Promise.all([
    // User A
    _createBidForAccount({ account: userA, auction, price: 50 }),
    _createBidForAccount({ account: userA, auction, price: 60 }),

    // User B
    _createBidForAccount({ account: userB, auction, price: 45 }),
    _createBidForAccount({ account: userB, auction, price: 55 }),
  ]);

  const winningPrice = await bids[1].getWinningPrice(userB);
  expect(winningPrice).toEqual(false);

  await _clean({ auction, bids });
});

test('Wrong bid (wrong price) should not be able to win the auction', async () => {
  // eslint-disable-next-line no-unused-vars
  const [userA, userB] = await _getUsers();
  const auction = await _createAuction(100);

  const bids = await Promise.all([
    // User A
    _createBidForAccount({ account: userA, auction, price: 50 }),
    _createBidForAccount({ account: userA, auction, price: 60 }),

    // User B
    _createBidForAccount({ account: userB, auction, price: 45 }),
    _createBidForAccount({ account: userB, auction, price: 55 }),
  ]);

  const winningPrice = await bids[3].getWinningPrice(userA);
  expect(winningPrice).toEqual(false);

  await _clean({ auction, bids });
});
