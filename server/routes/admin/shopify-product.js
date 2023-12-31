'use strict';

/**
 * router
 */

module.exports = [
  {
    method: 'GET',
    path: '/product',
    handler: 'shopify-product.findMany',
    config: {
      policies: [],
    },
  }, {
    method: 'POST',
    path: '/product/:id',
    handler: 'shopify-product.update',
    config: {
      policies: [],
    }
  }, {
    method: 'GET',
    path: '/product/count',
    handler: 'shopify-product.count',
    config: {
      policies: [],
    }
  }, {
    method: 'DELETE',
    path: '/product/:id',
    handler: 'shopify-product.del',
    config: {
      policies: [],
    }
  }, {
    method: 'GET',
    path: '/product/shopify-product-count',
    handler: 'shopify-product.shopifyProductCount',
    config: {
      policies: []
    }
  }, {
    method: 'GET',
    path: '/product/shopify-sync',
    handler: 'shopify-product.shopifySync',
    config: {
      policies: []
    }
  }
];
