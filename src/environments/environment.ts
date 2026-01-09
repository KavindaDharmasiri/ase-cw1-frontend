export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      validate: '/auth/validate'
    },
    products: {
      base: '/products',
      categories: '/products/categories',
      search: '/products/search',
      upload: '/files/upload'
    },
    categories: {
      base: '/categories'
    },
    orders: {
      base: '/orders',
      customer: '/orders/customer',
      rdc: '/orders/rdc',
      status: '/orders/status'
    },
    inventory: {
      base: '/inventory',
      stock: '/inventory/stock',
      transfers: '/inventory/transfers'
    },
    deliveries: {
      base: '/deliveries',
      tracking: '/deliveries/tracking'
    },
    invoices: {
      base: '/invoices'
    },
    reports: {
      base: '/reports'
    },
    suppliers: {
      base: '/suppliers'
    },
    procurement: {
      base: '/procurement'
    },
    warehouse: {
      base: '/warehouse'
    },
    vehicles: {
      base: '/vehicles'
    },
    drivers: {
      base: '/drivers'
    },
    goodsReceipt: {
      base: '/goods-receipt'
    },
    driverSettlements: {
      base: '/driver-settlements'
    },
    customers: {
      base: '/customers',
      rdcs: '/customers/rdcs'
    }
  }
};
