import Graphand from 'graphand-js';

const accessToken = `\
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\
eyJpZCI6IjYxNjhiYjRkOWFiOGZkM2E4MGMyMzlkMCIsInR5cGUiOiJ0b2tlbiIsImlhdCI6MTYzNDI1MzY0NX0.\
d0SR_aUIQrJGreeYVw6EeHhFPCekY8zJLX6j-Cbv7Ds\
`;

const graphandClient = new Graphand({
  project: '616719d19ab8fd240dbb95df',
  accessToken,
});

const Bid = graphandClient.getModel('Data:bid');

const getReqAccount = async (headers: any) => {
  const reqToken = headers.authorization.replace(/^Bearer /, '');
  const userClient = graphandClient.clone({
    accessToken: reqToken,
  });

  return userClient.getModel('Account').getCurrent();
};

graphandClient.getModel('Data:buy').on(
  'before_create',
  async ({ req, headers }: { req: any; headers: any }) => {
    const buyingBid = await Bid.get(req.bid);
    if (!buyingBid) {
      return;
    }

    const auction = await buyingBid.auction;
    if (!auction) {
      return;
    }

    const reqAccount = await getReqAccount(headers);
    if (reqAccount?._id !== buyingBid.createdBy?._id) {
      return;
    }

    const winningBid = await Bid.get({ query: { auction, createdBy: { $ne: reqAccount } }, pageSize: 1, sort: '-price' });
    const winningPrice = winningBid?.price || auction.price;

    if (winningPrice !== req.price) {
      return;
    }

    await auction.update({ set: { bought: true } });

    console.log(`Achat validé avec succès pour le compte ${reqAccount.fullname} sur l'enchère ${auction.title} au prix de ${winningPrice} € !`);
    req.validated = true;
  },
  { await: true },
);
