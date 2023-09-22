/*
 *
 * Shopify Sync Sidebar Component
 *
 */

import React from 'react';
import pluginId from '../../pluginId';
import {
  SubNav,
  SubNavHeader,
  SubNavSection,
  SubNavSections,
  SubNavLink,
} from '@strapi/design-system';
import Cog from '@strapi/icons/Cog';
//import { ShopifyIcon } from '../../components/ShopifyIcon';

export default function Sidebar() {
  const links = [{
    id: 1,
    label: 'Products',
    icon: <Cog />,
    to: `/plugins/${pluginId}/products?page=1&pageSize=10`
  }, {
    id: 2,
    label: 'Product variants',
    icon: <Cog />,
    to: `/plugins/${pluginId}/product-variants?page=1&pageSize=10`
  }, {
    id: 3,
    label: 'Product images',
    icon: <Cog />,
    to: `/plugins/${pluginId}/product-images?page=1&pageSize=10`
  }, {
    id: 4,
    label: 'Webhooks',
    icon: <Cog />,
    to: `/plugins/${pluginId}/webhooks?page=1&pageSize=10`
  }];

  return <>
    <SubNav ariaLabel="Shopify Connect sub nav">
      <SubNavHeader label="Shopify Connect" />
      <SubNavSections>
        <SubNavSection label="Administration">
          {links.map(link => <SubNavLink to={link.to} active={link.active} key={link.id} icon={link.icon}>
            {link.label}
          </SubNavLink>)}
        </SubNavSection>
      </SubNavSections>
    </SubNav>
  </>
};
