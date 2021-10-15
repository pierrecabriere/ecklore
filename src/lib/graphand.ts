import React from 'react';
import Graphand, { GraphandFieldText, GraphandFieldNumber, GraphandFieldRelation } from 'graphand-js';
import { GraphandPluginReact } from 'graphand-react';
import Account from '../models/Account';
import InputText from '../fields/inputs/Text';
import Auction from '../models/Auction';
import Bid from '../models/Bid';
import InputNumber from '../fields/inputs/Number';
import InputImage from '../fields/inputs/Image';
import Buy from '../models/Buy';

const accessToken = `\
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\
eyJpZCI6IjYxNjc2N2JlOWFiOGZkMTk3YWJiZjBlZiIsInR5cGUiOiJ0b2tlbiIsImlhdCI6MTYzNDE2NjcxOH0.\
Flex3JaSPnDpbHjRsGGniBCHqkXFEl6HMaxOr_5Xiq4\
`;

const graphandClient = new Graphand({
  project: '616719d19ab8fd240dbb95df',
  realtime: true,
  autoSync: true,
  accessToken,
  models: [Account, Auction, Bid, Buy],
  plugins: [GraphandPluginReact],
});

GraphandFieldText.InputComponent = InputText;
GraphandFieldNumber.InputComponent = InputNumber;
GraphandFieldRelation.InputComponent = (props: { field: any }) => {
  const { field } = props;

  if (field?.ref === 'Media' && !field.multiple) {
    return React.createElement(InputImage, props);
  }

  return null;
};

export default graphandClient;
