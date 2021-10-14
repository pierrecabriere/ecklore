import RxjsAuth from 'rxjs-auth';
import graphandClient from './graphand';
import Account from '../models/Account';

let sub: any;

const authmanager = RxjsAuth.create('ecklore', {
  fetchUser: async () => {
    try {
      const user = await graphandClient.getModel('Account').getCurrent();
      if (!sub && user) {
        sub = user.subscribe((_user: Account) => authmanager.userSubject.next(_user));
      }

      return user;
    } catch (e) {
      graphandClient.logout();
      authmanager.logout();
      console.error(e);
      return null;
    }
  },
  fetchToken: async (credentials: { email: string; password: string; data: object }) => {
    try {
      const payload = { ...credentials };

      if (authmanager.user) {
        payload.data = authmanager.user.raw;
      }

      return await graphandClient.login(payload);
    } catch (e) {
      graphandClient.logout();
      authmanager.logout();
      console.error(e);
      throw e;
    }
  },
});

export default authmanager;
