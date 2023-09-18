'use strict';

const shopifyWebhook = require('./shopify-webhook');
const shopifyProduct = require('./shopify-product');
const shopifyProductVariant = require('./shopify-product-variant');

module.exports = {
  'shopify-webhook': shopifyWebhook,
  'shopify-product': shopifyProduct,
  'shopify-product-variant': shopifyProductVariant,
};
