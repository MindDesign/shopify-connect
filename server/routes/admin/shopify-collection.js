'use strict';

/**
 * router
 */

module.exports = [
  {
    method: 'GET',
    path: '/collection',
    handler: 'shopify-collection.findMany',
    config: {
      policies: [],
    },
  }, {
    method: 'POST',
    path: '/collection/:id',
    handler: 'shopify-collection.update',
    config: {
      policies: [],
    }
  }, {
    method: 'GET',
    path: '/collection/count',
    handler: 'shopify-collection.count',
    config: {
      policies: [],
    }
  }, {
    method: 'DELETE',
    path: '/collection/:id',
    handler: 'shopify-collection.del',
    config: {
      policies: [],
    }
  }, {
    method: 'GET',
    path: '/collection/shopify-collection-count',
    handler: 'shopify-collection.shopifyCollectionCount',
    config: {
      policies: []
    }
  }, {
    method: 'GET',
    path: '/collection/shopify-sync',
    handler: 'shopify-collection.shopifySync',
    config: {
      policies: []
    }
  }
];
