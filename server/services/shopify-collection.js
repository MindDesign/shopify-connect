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
  entity.collection_type = (entity.hasOwnProperty('rules') && Array.isArray(entity.rules)) ? 'smart' : 'custom';

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
   * Get count for both custom and smart collection type added together
   * 
   * @returns 
   */
  async shopifyCollectionCount() {
    const store_url = `https://${STORE_NAME}.myshopify.com`;
    const custom_api_endpoint = `/admin/api/${API_VERION}/custom_collections/count.json`;
    const smart_api_endpoint = `/admin/api/${API_VERION}/smart_collections/count.json`;
    const custom_res = await fetch(store_url + custom_api_endpoint, {
      headers: {
        'X-Shopify-Access-Token': SECRET_KEY
      }
    });
    const smart_res = await fetch(store_url + smart_api_endpoint, {
      headers: {
        'X-Shopify-Access-Token': SECRET_KEY
      }
    });

    let total_count = 0;

    if (custom_res.status === 200 && smart_res.status === 200) {
      const custom_data = await custom_res.json();
      const smart_data = await smart_res.json();

      total_count = total_count + custom_data.count;
      total_count = total_count + smart_data.count;

      return total_count;
    }

    return {
      'error': true
    };
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
    const custom_api_endpoint = `/admin/api/${API_VERION}/custom_collections.json?limit=250`;
    const smart_api_endpoint = `/admin/api/${API_VERION}/smart_collections.json?limit=250`;
    const custom_res = await fetch(store_url + custom_api_endpoint, {
      headers: {
        'X-Shopify-Access-Token': SECRET_KEY
      }
    });
    const smart_res = await fetch(store_url + smart_api_endpoint, {
      headers: {
        'X-Shopify-Access-Token': SECRET_KEY
      }
    });


    if (custom_res.status === 200 && smart_res.status === 200) {
      const custom_data = await custom_res.json();
      const smart_data = await smart_res.json();
      const all_collections = await custom_data.custom_collections.concat(smart_data.smart_collections);
      const created_collections = [];
      const updated_collections = [];

      await Promise.all(all_collections.map(async (entity) => {
        const collection = await prepareCollection(entity);
        const num_collections = await checkIfCollectionExist(collection.shopify_id);
        
        if (num_collections == 0) {
          const created_collection = await createCollection(entity);
          created_collections.push(created_collection.title)
        } else if (num_collections === 1) {
          updated_collections.push(collection.title);
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
