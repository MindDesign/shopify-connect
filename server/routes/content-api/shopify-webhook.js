'use strict';

/*
 * router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/webhook',
      handler: 'shopify-webhook.handle',
      config: {
        auth: false,
      },
    }
  ],
};
