'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::shopify-connect.shopify-product-variant-color', {
  async findMany(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-product-variant-color')
      .findMany();
  },
});
