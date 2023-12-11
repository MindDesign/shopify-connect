'use strict';

const shopifyWebhook = require('./shopify-webhook');
const shopifyProduct = require('./shopify-product');
const shopifyCollection = require('./shopify-collection');

module.exports = {
  type: 'admin',
  routes: [...shopifyWebhook, ...shopifyProduct, ...shopifyCollection],
};
