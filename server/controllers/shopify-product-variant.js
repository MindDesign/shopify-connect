'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::shopify-connect.shopify-product-variant', {

  async update(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-product-variant')
      .update(ctx)
  },

  async findMany(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-product-variant')
      .findMany(ctx.request.query);
  },

  async count(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-product-variant')
      .count();
  },

  async del(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-product-variant')
      .del(ctx.params.id);
  }

});
