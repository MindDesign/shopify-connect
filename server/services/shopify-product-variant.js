'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::shopify-connect.shopify-product-variant', {

  async update({ ctx }) {

  },

  async count() {
    return await strapi.query('plugin::shopify-connect.product-variant').count()
  },

  async findMany({ page, pageSize }) {
    return await strapi.entityService.findMany('plugin::shopify-connect.product-variant', {
      start: page,
      limit: pageSize,
      populate: ['image'],
    })
  },

  async del(id) {
    return await strapi.entityService.delete('plugin::shopify-connect.product-variant', id)
  },
  
});
