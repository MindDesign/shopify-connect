'use strict';

const shopifyWebhook = require('./shopify-webhook');
const shopifyProduct = require('./shopify-product');
const shopifyProductVariantColor = require('./shopify-product-variant-color');

module.exports = {
  type: 'content-api',
  routes: [...shopifyWebhook, ...shopifyProduct, ...shopifyProductVariantColor],
};
