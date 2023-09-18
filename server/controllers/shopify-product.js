'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::shopify-connect.shopify-product', {

    async update(ctx) {
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-product')
        .update(ctx)
    },
  
    async findOne(ctx) {
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-product')
        .findOne(ctx.params.handle);
    },
  
    async findMany(ctx) {
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-product')
        .findMany(ctx.request.query);
    },
  
    async count(ctx) {
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-product')
        .count();
    },
  
    async del(ctx) {
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-product')
        .del(ctx.params.id);
    },
  
    async shopifyProductCount(ctx) {
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-product')
        .shopifyProductCount();
    },
  
    async shopifySync(ctx) {
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-product')
        .shopifySync();
    }
    
  });
