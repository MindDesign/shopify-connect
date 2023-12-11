'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;

/**
 * We need some .env variables
 */
const SECRET_KEY = process.env.SHOPIFY_API_SECRET;
const STORE_NAME = process.env.SHOPIFY_STORE_NAME;
const API_VERION = process.env.SHOPIFY_API_VERSION;


/**
 * Check if collection exist already
 * 
 * @param {*} shopify_id 
 * @returns 
 */
async function checkIfCollectionExist(shopify_id) {
  const collections = await strapi.entityService.findMany('plugin::shopify-connect.shopify-collection', {
    filters: {
      shopify_id: {
        $eq: shopify_id
      }
    }
  });

  return await collections.length;
}

/**
 * Prepare collection
 * 
 * Rename collection object keys that has the same name
 * in Strapi and Shopify so that we keep Shopify data intact when 
 * updating or creating collections
 * 
 * @param {any} entity 
 * @returns {collection}
 */
async function prepareCollection(entity) {
  // Convert Shopify data to Strapi data to preserve Shopify data
  entity.shopify_id = entity.id;
  entity.slug = entity.handle;
  entity.shopify_updated_at = entity.updated_at;
  entity.shopify_published_at = entity.published_at;
  entity.publishedAt = entity.published_at;

  delete entity["id"];
  delete entity["updated_at"];
  delete entity["published_at"];

  return entity
}

/**
 * Create collection
 * 
 * @param {any} collection 
 * @returns Promise<T>any
 */
async function createCollection(collection) {
  const created_collection = await strapi.entityService.create('plugin::shopify-connect.shopify-collection', {
    data: collection
  });

  return created_collection;
}

/**
 * 
 * Product service
 *
 */
module.exports = createCoreService('plugin::shopify-connect.shopify-collection', {

  async count() {
    return await strapi.entityService.count('plugin::shopify-connect.shopify-collection');
  },

  async findOne(handle) {
    const res = await strapi.db.query('plugin::shopify-connect.shopify-collection').findOne({
      select: '*',
      where: { handle: handle }
    });
    return res;
  },

  async findMany({ page, pageSize }) {
    return await strapi.entityService.findMany('plugin::shopify-connect.shopify-collection', {
      start: page,
      limit: pageSize
    })
  },

  async del(id) {
    return await strapi.entityService.delete('plugin::shopify-connect.shopify-collection', id)
  },

  /**
   * Get count for specified collection type
   * 
   * @param {*} collection_type 
   * @returns 
   */
  async shopifyCollectionCount() {
    const store_url = `https://${STORE_NAME}.myshopify.com`;
    const api_endpoint = `/admin/api/${API_VERION}/shopify_collection/count.json`;
    const res = await fetch(store_url + api_endpoint, {
      headers: {
        'X-Shopify-Access-Token': SECRET_KEY
      }
    });

    if (res.status === 200) {
      const data = await res.json();
      return data.count;
    }
    return 0;
  },

  /**
   * Sync all collections
   * 
   * @returns object
   * 
   * TODO: do this in batches
   */
  async shopifySync() {
    const store_url = `https://${STORE_NAME}.myshopify.com`;
    const api_endpoint = `/admin/api/${API_VERION}/shopify_collection.json?limit=250`;
    const res = await fetch(store_url + api_endpoint, {
      headers: {
        'X-Shopify-Access-Token': SECRET_KEY
      }
    });
    if (res.status === 200) {
      const data = await res.json();
      const created_collections = [];
      const updated_collections = [];

      await Promise.all(data.collections.map(async (entity) => {
        const collection = await prepareCollection(entity);
        const num_collections = await checkIfCollectionExist(collection.shopify_id);
        if (num_collections == 0) {
          const created_collection = await createCollection(entity);
          created_collections.push(created_collection.title)
        } else if (num_collections === 1) {
          updated_collections.push(collection.title);
          // TODO: UPDATE PRODUCT
          // 1. check variants
          // 1.1 check if there are new variants
          // 1.1.1 create new variants if there are new
          // 1.2 check if there are deleted variants
          // 1.2.1 delete variants if there are deleted variants
          // 1.3 update existing variants
          // 2. check options - same as variants
          // 3. check images - same as variants
        }
      }));

      return {
        created: created_collections,
        updated: updated_collections
      }
    }

    return false;
  }

});
