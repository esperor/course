import axios from 'axios';
import UserInfo from '../models/userInfo';
import api from '../api';
import { redirect } from '@tanstack/react-router';
import EAccessLevel from '../models/accessLevel';

export const replaceRouteParams = (
  endpoint: string,
  params: { [key: string]: string | number },
) => {
  let url = endpoint;
  for (const key in params) {
    url = url.replace(`{${key}}`, params[key].toString());
  }
  return url;
};

export const authenticate = async ({ location }: { location: unknown }) => {
  const data: UserInfo = await axios
    .get(api.identity.userInfo)
    .then((response) => response.data);

  if (!data || !data.isSignedIn)
    throw redirect({
      to: '/login',
      search: {
        returnUrl: (location as Location).href,
      },
    });
};

export const authenticateAdmin = async ({
  location,
}: {
  location: unknown;
}) => {
  authenticate({ location });

  const data: UserInfo = await axios
    .get(api.identity.userInfo)
    .then((response) => response.data);

  if (!data?.accessLevel || data.accessLevel < EAccessLevel.Administrator)
    throw redirect({
      to: '/',
    });
};
