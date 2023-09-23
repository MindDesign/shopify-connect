'use strict';

/**
 * router
 */

module.exports = [
  {
    method: 'GET',
    path: '/color',
    handler: 'shopify-product-variant-color.findMany',
    config: {
      policies: []
    }
  }
];
