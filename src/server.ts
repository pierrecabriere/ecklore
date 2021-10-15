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

const [Bid, Auction] = graphandClient.getModels(['Data:bid', 'Data:auction']);

const _getReqAccount = async (headers: any) => {
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

    const reqAccount = await _getReqAccount(headers);
    const winningPrice = await buyingBid.getWinningPrice(reqAccount);

    if (!winningPrice || winningPrice !== req.price) {
      return;
    }

    await Auction.update({ ids: [buyingBid.auction._id], set: { bought: true } });

    console.log(
      `Achat validé avec succès pour le compte ${reqAccount.fullname} sur l'enchère ${buyingBid.auction._id} au prix de ${winningPrice} € !`,
    );
    req.validated = true;
  },
  { await: true },
);
