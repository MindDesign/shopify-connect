'use strict';

/*
 * router
 */

module.exports = [
  {
    method: 'POST',
    path: '/webhook',
    handler: 'shopify-webhook.handle',
    config: {
      auth: false,
    },
  }
];
