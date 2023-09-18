'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { errors } = require('@strapi/utils');
const { ForbiddenError } = errors;
const crypto = require("crypto");

module.exports = createCoreController('plugin::shopify-connect.shopify-webhook', {

  async handle(ctx) {
    // Secret webhook key from the Shopify webhook admin
    const secretKey = process.env.SHOPIFY_WEBHOOK_SECRET;

    // Get the hmac from the header 
    // We use this to validate that Shopify is the sender
    const hmac = ctx.request.get('x-shopify-hmac-sha256');

    // We need the raw body for later
    const rawBody = ctx.request.body[Symbol.for("unparsedBody")];
    
    // What is this webhook all about?
    const topic = ctx.request.get('x-shopify-topic');

    // Is this a test?
    const test = ctx.request.get('x-shopify-test') === 'true' ? true : false;

    // When was this webhook triggered
    const triggeredAt = ctx.request.get('x-shopify-triggered-at');

    // Webhook ID from Shopify
    const webhookId = ctx.request.get('x-shopify-webhook-id');

    // Create hash so we can control that Shopify is the sender
    // Check https://shopify.dev/docs/apps/webhooks/configuration/https for
    // how to handle Shopify webhooks
    const hash = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody, 'utf8')
      .digest('base64');

    // Check if the hash and hmac matchess. Only a match validates Shopify as the sender
    if (hash === hmac) {
      ctx.body = { message: 'HelloWorld' };

      // https://docs.strapi.io/dev-docs/api/query-engine/single-operations
      const entry = await strapi.db.query('plugin::shopify-connect.shopify-webhook').create({
        data: {
          webhook_id: webhookId,
          topic: topic,
          payload: rawBody,
          triggered_at: triggeredAt,
          is_test: test,
          is_processed: false
        }
      });
    } else {
      throw new ForbiddenError('Ah ah ah, you didn\'t say the magic word');
    }
  },

  async findMany(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-webhook')
      .findMany(ctx.request.query);
  },

  async count(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-webhook')
      .count();
  },

  async del(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-webhook')
      .del(ctx.params.id);
  },
  
  async processAll(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-webhook')
      .processAll();
  },

  async process(ctx) {
    ctx.body = await strapi
      .plugin('shopify-connect')
      .service('shopify-webhook')
      .process(ctx.params.id);
  },


  async getSettings(ctx) {
    try {
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-webhook')
        .getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async setSettings(ctx) {
    const { body } = ctx.request;
    try {
      await strapi
        .plugin('shopify-connect')
        .service('shopify-webhook')
        .setSettings(body);
      ctx.body = await strapi
        .plugin('shopify-connect')
        .service('shopify-webhook')
        .getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
