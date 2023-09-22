'use strict';

const shopifyWebhook = require('./shopify-webhook');
const shopifyProduct = require('./shopify-product');

module.exports = {
  routes: [...shopifyWebhook, ...shopifyProduct],
};
