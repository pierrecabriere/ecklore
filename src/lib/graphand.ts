import Graphand, { GraphandFieldText } from 'graphand-js';
import { GraphandPluginReact } from 'graphand-react';
import Account from '../models/Account';
import InputText from '../fields/inputs/Text';

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
  models: [Account],
  plugins: [GraphandPluginReact],
});

GraphandFieldText.InputComponent = InputText;

export default graphandClient;
