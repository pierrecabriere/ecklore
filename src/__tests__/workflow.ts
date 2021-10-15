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

// helper to get users list for each test
const _getUsers = async () => {
  const accounts = await Account.getList({
    query: { email: { $in: ['user-a@gmail.com', 'user-b@gmail.com', 'user-c@gmail.com', 'user-d@gmail.com', 'user-e@gmail.com'] } },
  });

  return accounts;
};

// helper to create a bid on an auction from an account
const _createBidForAccount = async ({ account, auction, price }: { account: Account; auction: Auction; price: number }) => {
  const token = await account.generateToken();

  const userClient = graphandClient.clone({ accessToken: token });
  return userClient.getModel('Data:bid').create({ auction, price });
};

// helper to clean auction and bids for each test
const _clean = async ({ auction, bids }: { auction: Auction; bids: Bid[] }) => {
  await Bid.delete({ ids: bids.map((bid: Bid) => bid._id) });
  await auction.delete();
};

// helper to create users list, used in beforeAll hook
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

// helper to create an auction, used in each test
const _createAuction = async (price: number) => Auction.create({ title: 'Test', price, endDate: addSeconds(new Date(), 10) });

beforeAll(async () => {
  await _createUsers();
});

afterAll(async () => {
  const users = await _getUsers();
  const ids = users.map((u: Account) => u._id);

  await Account.delete({ ids });
});

// Main test described in the given example (see README.md)
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

// If no non-winning buyer found, the winning price should be the reserve price
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

// If the winning price from a buyer is under the reserve price, reserve price should be returned
test('Winning price should be the auction price', async () => {
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

  const winningPrice = await bids[1].getWinningPrice(userA);
  expect(winningPrice).toEqual(100);

  await _clean({ auction, bids });
});

// Only the winning buyer should be able to win the auction
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

// The winning buyer should be able to win the auction only with the winning price
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
