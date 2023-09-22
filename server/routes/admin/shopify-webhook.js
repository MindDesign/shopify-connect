'use strict';

/*
 * router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/webhook/process/all',
      handler: 'shopify-webhook.processAll',
      config: {
        policies: [],
      }
    }, {
      method: 'POST',
      path: '/webhook/process/:id',
      handler: 'shopify-webhook.process',
      config: {
        policies: [],
      }
    }, {
      method: 'GET',
      path: '/webhook',
      handler: 'shopify-webhook.findMany',
      config: {
        policies: [],
      },
    }, {
      method: 'GET',
      path: '/webhook/count',
      handler: 'shopify-webhook.count',
      config: {
        policies: [],
      }
    }, {
      method: 'DELETE',
      path: '/webhook/delete/:id',
      handler: 'shopify-webhook.del',
      config: {
        policies: [],
      }
    }, {
      method: 'GET',
      path: '/webhook/settings',
      handler: 'shopify-webhook.getSettings',
      config: {
        policies: [],
      },
    }, {
      method: 'POST',
      path: '/webhook/settings',
      handler: 'shopify-webhook.setSettings',
      config: {
        policies: [],
      },
    },
  ],
};
