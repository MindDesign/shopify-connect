'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::shopify-connect.shopify-product-variant-color', {
  async findMany() {
    return await strapi.entityService.findMany('plugin::shopify-connect.shopify-product-variant-color')
  },
});
