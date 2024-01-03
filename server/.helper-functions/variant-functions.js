module.exports = ({ strapi }) => ({
  
  /**
   * Check if variant exist already
   * 
   * @param {*} shopify_id 
   * @returns 
   */
  async checkIfVariantExist(shopify_id) {
    const product_variants = await strapi.entityService.findMany('plugin::shopify-connect.shopify-product-variant', {
      filters: {
        shopify_id: {
          $eq: shopify_id
        }
      }
    });

    return await product_variants.length;
  },

    

  /**
   * Get variant Strapi ids
   * 
   * @param {array} shopify_ids 
   */
  async getStrapiVariantIdsFromShopifyVariantIds(shopify_ids) {
    //console.log("\n\nShopify ids: ", shopify_ids, "\n\n");
    const variants = await strapi.entityService.findMany('plugin::shopify-connect.shopify-product-variant', {
      fields: ['id'],
      filters: {
        shopify_id: {
          $in: shopify_ids,
        },
      },
    });
    //console.log("\n\nFound variants: ", JSON.stringify(variants, null, 4), "\n\n");
    return await variants.map(({ id }) => id)
  }

});