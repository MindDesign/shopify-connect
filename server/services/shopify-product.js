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
 * Check if product exist already
 * 
 * @param {*} shopify_id 
 * @returns 
 */
async function checkIfProductExist(shopify_id) {
  const products = await strapi.entityService.findMany('plugin::shopify-connect.shopify-product', {
    filters: {
      shopify_id: {
        $eq: shopify_id
      }
    }
  });

  return await products.length;
}

async function checkMissingOrRemovedVariants(product_shopify_id, shopify_variants) {
  const products = await strapi.entityService.findMany('plugin::shopify-connect.shopify-product',  {
    filters: {
      shopify_id: {
        $eg: product_shopify_id
      }
    }
  });

  if (products.length === 1) {
    const existing_variant_ids = products[0].variants.map((variant) => {
      return variant.shopify_id;
    });
  }

  const shopify_variant_ids = shopify_variants.map((variant) => {
    return variant.shopify_id;
  });

  shopify_variant_ids.forEach((id) => {
    // check if id is not in existing variant ids array (missing)
    // check if existing variant ids not exist in shopify_variant_ids (removed)
    //
  })
}

/**
 * Prepare and split product, options, images and variants
 * 
 * Rename product and variant object keys that has the same name
 * in Strapi and Shopify so that we keep Shopify data intact when 
 * updating or creating products and variants
 * 
 * @param {any} entity 
 * @returns {product, variants, options, images}
 */
async function prepareProduct(entity) {
  // Destructure relations from entity (variants, options and images) 
  // since Strapi only accepts relation ids. We will add the ids later
  let { variants, options, images } = entity;

  // Delete relations from entity
  delete entity["variants"];
  delete entity["options"];
  delete entity["images"];
  delete entity["image"];

  // Convert Shopify data to Strapi data to preserve Shopify data
  entity.shopify_id = entity.id;
  entity.slug = entity.handle;
  entity.shopify_tags = entity.tags;
  entity.shopify_created_at = entity.created_at;
  entity.shopify_updated_at = entity.updated_at;
  entity.shopify_published_at = entity.published_at;
  entity.publishedAt = entity.published_at;

  delete entity["id"];
  //delete entity["handle"]; <- We do not delete the original handle, that can be used still.
  //delete entity["tags"]; <- Lets keep them for now
  delete entity["created_at"];
  delete entity["updated_at"];
  delete entity["published_at"];

  // Convert object keys to preserve Shopify data
  if (variants.length > 0) {
    variants.forEach((variant) => {
      variant.shopify_id = variant.id;
      variant.shopify_product_id = variant.product_id;
      variant.shopify_created_at = variant.created_at;
      variant.shopify_updated_at = variant.updated_at;
      variant.publishedAt = new Date();

      delete variant["id"];
      delete variant["product_id"];
      delete variant["created_at"];
      delete variant["updated_at"];
    })
  }

  if (options.length > 0) {
    options.forEach((option) => {
      option.shopify_id = option.id;

      delete option["id"];
    })
  }

  if (images.length > 0) {
    images.forEach(image => {
      image.shopify_id = image.id;
      image.shopify_product_id = image.product_id;
      image.shopify_created_at = image.created_at;
      image.shopify_updated_at = image.updated_at;
      
      delete image["id"];
      delete image["product_id"];
      delete image["created_at"];
      delete image["updated_at"];
    });
  }

  return {
    product: entity,
    variants: variants,
    options: options,
    images: images
  };
}

/**
 * Create multiple variants
 * 
 * @param {any} variants 
 * @returns Array 
 *  returns array of variant ids created
 */
async function createVariants(variants) {
  let strapi_shopify_ids_array = [];
  
  await Promise.all(variants.map(async (variant) => {
    let createdVariant = await strapi.entityService.create('plugin::shopify-connect.shopify-product-variant', {
      data: variant
    });

    strapi_shopify_ids_array.push({ strapi_id: createdVariant.id, shopify_id: createdVariant.shopify_id});
  }));

  return strapi_shopify_ids_array;
}
  
/**
 * Create multiple options
 * 
 * @param {any} options 
 * @returns Array
 *  returns array of option ids created 
 */
async function createOptions(options) {
  return await strapi.db.query('plugin::shopify-connect.shopify-product-option').createMany({
    data: options
  });
}

/**
 * Create multiple images
 * 
 * @param {any} images 
 * @param {any} variant_shopify_ids
 * @returns Array
 *  returns array of image ids created
 */
async function createImages(images, variant_shopify_ids) {
  let created_images = [];

  await Promise.all(images.map(async (image) => {
    let combined_image;

    if (image.variant_ids.length > 0) {
      let variant_ids = [];
      image.variant_ids.forEach(id => {
        variant_shopify_ids.forEach((variant_shopify_id) => {
          if (variant_shopify_id.shopify_id == id) {
            variant_ids.push(variant_shopify_id.strapi_id);
          }
        });
      })
      delete image["variant_ids"];
      combined_image = {
        ...image,
        'variants': { connect: variant_ids }
      };
    } else {
      delete image["variant_ids"];
      combined_image = image;
    }

    const created_image = await strapi.entityService.create('plugin::shopify-connect.shopify-product-image', {
      data: combined_image
    });

    created_images.push(created_image.id);
  }));

  return created_images;
}

/**
 * Create product
 * 
 * @param {any} product 
 * @param array[] variant ids
 * @param array[] option ids 
 * @param array[] image ids 
 * @returns Promise<T>any
 */
async function createProduct(product, variants, options, images) {
  // createVariants returns array of strapi ids and corresponding shopify ids
  const variant_shopify_ids = await createVariants(variants);

  // Get only strapi variant ids from variant_shopify_ids
  const variant_ids = variant_shopify_ids.map(ids => ids.strapi_id);

  // createOptions returns array of strapi ids
  const option_ids = await createOptions(options);

  // createImages returns array of strapi ids
  const image_ids = await createImages(images, variant_shopify_ids);

  // add relation ids to product object
  const product_with_relations = {
    ...product,
    'variants': { connect: variant_ids },
    'options': { connect: option_ids.ids },
    'images': { connect: image_ids }
  };

  const created_product = await strapi.entityService.create('plugin::shopify-connect.shopify-product', {
    data: product_with_relations,
    populate: ['variants', 'options', 'images.variants', 'variants.image'],
  });

  return created_product;
}

/**
 * 
 * Product service
 *
 */
module.exports = createCoreService('plugin::shopify-connect.shopify-product', {

  async update({ ctx }) {

  },

  async count() {
    return await strapi.entityService.count('plugin::shopify-connect.shopify-product');
  },

  async findOne(handle) {
    const res = await strapi.db.query('plugin::shopify-connect.shopify-product').findOne({
      select: '*',
      where: { handle: handle },
      populate: ['variants', 'options', 'images', 'category', 'category.parent', 'category.categories']
    });
    return res;
  },

  async findMany({ page, pageSize }) {
    return await strapi.entityService.findMany('plugin::shopify-connect.shopify-product', {
      start: page,
      limit: pageSize,
      populate: ['variants', 'variants.image', 'options', 'images'],
    })
  },

  async del(id) {
    return await strapi.entityService.delete('plugin::shopify-connect.shopify-product', id)
  },

  async processWebhook(entity) {
    const { product, variants, options, images } = await prepareProduct(entity);
    const num_products = await checkIfProductExist(product.shopify_id);

    if (num_products == 0) {
      return await createProduct(product, variants, options, images);
    } else if (num_products === 1) {
      // TODO: implement
      return;
    } else {
      return false;
    }
  },

  async shopifyProductCount() {
    const store_url = `https://${STORE_NAME}.myshopify.com`;
    const api_endpoint = `/admin/api/${API_VERION}/products/count.json`;
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
   * Sync all products
   * 
   * @returns object
   * 
   * TODO: do this in batches
   */
  async shopifySync() {
    const store_url = `https://${STORE_NAME}.myshopify.com`;
    const api_endpoint = `/admin/api/${API_VERION}/products.json?limit=250`;
    const res = await fetch(store_url + api_endpoint, {
      headers: {
        'X-Shopify-Access-Token': SECRET_KEY
      }
    });
    if (res.status === 200) {
      const data = await res.json();
      const created_products = [];
      const updated_products = [];

      await Promise.all(data.products.map(async (entity) => {
        const { product, variants, options, images } = await prepareProduct(entity);
        const num_products = await checkIfProductExist(product.shopify_id);
        if (num_products == 0) {
          const created_product = await createProduct(product, variants, options, images);
          created_products.push(created_product.title)
        } else if (num_products === 1) {
          const { remove_variants, add_variants } = checkMissingOrRemovedVariants(product.shopify_id, variants);
          updated_products.push(product.title);
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
        created: created_products,
        updated: updated_products
      }
    }

    return false;
  }

});
