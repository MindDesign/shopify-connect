'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::shopify-connect.shopify-product-image', {

  async update({ ctx }) {

  },

  async count() {
    return await strapi.query('plugin::shopify-connect.shopify-product-image').count()
  },

  async findMany({ page, pageSize }) {
    return await strapi.entityService.findMany('plugin::shopify-connect.shopify-product-image', {
      start: page,
      limit: pageSize,
      populate: ['variants'],
    })
  },

  async del(id) {
    return await strapi.entityService.delete('plugin::shopify-connect.shopify-product-image', id)
  },

});
