'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;

async function setWebhookProcessed(id) {
  return await strapi.entityService.update('plugin::shopify-connect.shopify-webhook', id, {
    data: {
      is_processed: true
    }
  })
}

module.exports = createCoreService('plugin::shopify-connect.shopify-webhook', {

  async count() {
    return await strapi.entityService.count('plugin::shopify-connect.shopify-webhook');
  },

  async findMany({ page, pageSize }) {
    return await strapi.entityService.findMany('plugin::shopify-connect.shopify-webhook', {
      start: page,
      limit: pageSize
    })
  },

  async processAll() {
    const webhooks = await strapi.entityService.findMany('plugin::shopify-connect.shopify-webhook', {
      filters: {
        is_processed: {
          $eq: false
        }
      }
    })

    //console.log(webhooks);
  },

  /**
   * Process webhook with given ID
   * 
   * @param {Number} id 
   * @returns 
   */
  async process(id) {
    const webhook = await strapi.entityService.findOne('plugin::shopify-connect.shopify-webhook', id);
    const entity = JSON.parse(webhook.payload);

    switch (webhook.topic) {
      // We need to check if product exists when
      // updating anyway, so why not handle both
      // topics in one go
      case 'products/update':
      case 'products/create':
        
        const res = await strapi
          .plugin('shopify-connect')
          .service('shopify-product')
          .processWebhook(entity);
        if (
          typeof res === 'object' &&
          !Array.isArray(res) &&
          res !== null
        ) {
          const webhookRes = await setWebhookProcessed(id);
          return res;
        }
    }
  },

  async del(id) {
    return await strapi.entityService.delete('plugin::shopify-connect.shopify-webhook', id)
  }
});
