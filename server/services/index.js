'use strict';

const shopifyWebhook = require('./shopify-webhook');
const shopifyProduct = require('./shopify-product');
const shopifyProductVariant = require('./shopify-product-variant');
const shopifyProductVariantColor = require('./shopify-product-variant-color');

module.exports = {
  'shopify-webhook': shopifyWebhook,
  'shopify-product': shopifyProduct,
  'shopify-product-variant': shopifyProductVariant,
  'shopify-product-variant-color': shopifyProductVariantColor,
};
