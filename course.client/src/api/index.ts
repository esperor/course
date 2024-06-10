const api = {
  identity: {
    userInfo: '/api/identity/user-info',
    login: '/api/identity/login',
    logout: '/api/identity/logout',
    register: 'api/identity/register',
    updateUser: 'api/identity/update-user',
  },
  deliverer: {
    rest: 'api/deliverer',
  },
  order: {
    rest: 'api/order',
    cancel: 'api/order/{id}/cancel',
    user: 'api/order/user',
  },
  inventory: {
    delete: 'api/inventory-record/{id}',
    post: 'api/inventory-record/product/{productId}',
  },
  product: {
    rest: 'api/product',
  },
  vendor: {
    rest: 'api/vendor',
  },
  user: {
    rest: 'api/user', // only get, get/{id}, delete
  }
};

export default api;
