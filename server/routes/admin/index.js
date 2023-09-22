'use strict';

const shopifyWebhook = require('./shopify-webhook');
const shopifyProduct = require('./shopify-product');

module.exports = {
  type: 'admin',
  routes: [...shopifyWebhook, ...shopifyProduct],
};
