'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::shopify-connect.shopify-collection', {

  async update(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-collection')
      .update(ctx)
  },

  async findOne(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-collection')
      .findOne(ctx.params.handle);
  },

  async findMany(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-collection')
      .findMany(ctx.request.query);
  },

  async count(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-collection')
      .count();
  },

  async del(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-collection')
      .del(ctx.params.id);
  },

  async shopifyCollectionCount(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-collection')
      .shopifyCollectionCount();
  },

  async shopifySync(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-collection')
      .shopifySync();
  }

});
