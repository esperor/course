const replaceRouteParams = (
  endpoint: string,
  params: { [key: string]: string | number },
) => {
  let url = endpoint;
  for (const key in params) {
    url = url.replace(`{${key}}`, params[key].toString());
  }
  return url;
};
