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
  seller: {
    rest: 'api/seller',
  },
  order: {
    rest: 'api/order',
    cancel: 'api/order/{id}/cancel',
    user: 'api/order/user',
    assignDeliverer: 'api/order/{id}/assign-deliverer',
    setStatus: 'api/order/{id}/set-status',
  },
  inventory: {
    delete: 'api/inventory-record/{id}',
    post: 'api/inventory-record/product/{productId}',
    get: 'api/inventory-record',
  },
  product: {
    rest: 'api/product',
  },
  store: {
    rest: 'api/store',
  },
  user: {
    /**
     * Only get, get/{id}, delete
     */
    rest: 'api/user',
  }
};

export default api;
