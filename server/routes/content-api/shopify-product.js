'use strict';

/**
 * router
 */

module.exports = [
  {
    method: 'GET',
    path: '/product/:handle',
    handler: 'shopify-product.findOne',
    config: {
      policies: [],
      auth: false
    }
  }, {
    method: 'GET',
    path: '/product',
    handler: 'shopify-product.findMany',
    config: {
      policies: [],
      auth: false
    },
  }
];
