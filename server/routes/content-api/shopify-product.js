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
      policies: ['plugin::shopify-connect.checkConfigRoles']
    }
  }, {
    method: 'GET',
    path: '/product',
    handler: 'shopify-product.findMany',
    config: {
      policies: ['plugin::shopify-connect.checkConfigRoles']
    },
  }
];
