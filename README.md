# Strapi plugin shopify-connect

## This is very much a work in progress!

*As of today, only `product/update` and `product/create` webhooks are implemented:*

In `Shopify / Settings / Notifications / Webhooks`, add a new webhook for either of the above, and point it to `<strapi domain>/shopify-connect/webhook`. 

### Next features to be implemented:

- Process webhooks
  - Save new products to Strapi, or update products in Strapi that are sent by Shopify webhooks
    - ~~ saving new products, except bug in variant image connection.~~
    - update existing products
- Sync all products from Shopify
  - Fetch all products via Shopify REST api and add to Strapi. Images will not be downloaded, but image urls will be saved.
    - create new products
    - update existing products
- Sync individual products to Shopify
- Sync all products to Shopify

## Setup

### middleware

In `config/middleware.js` add:

```
module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      patchKoa: true,
      multipart: true,
      includeUnparsed: true // Add this to handle webhooks
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### pluigns

In `config/plugins.js` add:

```
module.exports = {
  // ...
  'shopify-connect': {
    enabled: true,
    resolve: './src/plugins/shopify-connect'
  },
  // ...
}
```

### environment

in `.env` add:

```
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_WEBHOOK_SECRET=
```

These will be found in Shopify.