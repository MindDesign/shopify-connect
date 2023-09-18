'use strict';

const shopify_product = require("./shopify-product/schema");
const shopify_product_variant = require("./shopify-product-variant/schema");
const shopify_product_option = require("./shopify-product-option/schema");
const shopify_product_image = require("./shopify-product-image/schema");
const shopify_product_variant_color = require("./shopify-product-variant-color/schema");
const shopify_webhook = require("./shopify-webhook/schema");

module.exports = {
    'shopify-product': { schema: shopify_product },
    'shopify-product-variant': { schema: shopify_product_variant },
    'shopify-product-option': { schema: shopify_product_option },
    'shopify-product-image': { schema: shopify_product_image },
    'shopify-product-variant-color': { schema: shopify_product_variant_color },
    'shopify-webhook': { schema: shopify_webhook }
};
