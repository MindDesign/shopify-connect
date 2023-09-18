/*
 *
 * HomePage
 *
 */

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import getTrad from '../../utils/getTrad';
import Sidebar from '../../components/Sidebar';
import Cog from '@strapi/icons/Cog';
//import { NoProductsIcon } from '../../components/NoProductsIcon';

import { 
  BaseHeaderLayout,
  Layout, 
  Typography,
  GridLayout,
  EmptyStateLayout,
  Card,
  CardHeader,
  CardAsset,
  CardBody,
  CardContent,
  CardTitle,
  CardSubtitle,
  CardBadge,
  Box,
  Button
} from '@strapi/design-system';

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const { formatMessage } = useIntl();
  let products = [];

  return (
    <Layout sideNav={<Sidebar />}>
      <>
        <BaseHeaderLayout 
          title={formatMessage({
            id: getTrad('Homepage.BaseHeaderLayout.title'),
            defaultMessage: 'Shopify Sync',
          })} as="h1" 
          subtitle={formatMessage({
            id: getTrad('Homepage.BaseHeaderLayout.subtitle'),
            defaultMessage: 'Sync your products from and to Shopify'
          })}
        />

        <>
          <Box style={{ paddingLeft: 56, paddingRight: 56 }}>
            <Box padding={6} background="neutral0">
              <Typography variant="beta" style={{ display: 'block', paddingBottom: 10 }}>
                {formatMessage({
                  id: getTrad('Homepage.LatestSync.title'),
                  defaultMessage: 'Latest products synced'
                })}
              </Typography>
              {
                products.length === 0 ? (
                  <EmptyStateLayout /*icon={<NoProductsIcon />}*/ 
                    content={formatMessage({
                      id: getTrad('Shared.ProductsEmptyState.text'),
                      defaultMessage: 'No products synced yet, click button to sync products'
                    })} 
                    action={<Button onClick={() => setShowModal(true)} variant="secondary" startIcon={<Cog />}>
                      {formatMessage({
                        id: getTrad('Shared.ProductsEmptyState.button'),
                        defaultMessage: 'Sync products from Shopify'
                      })} 
                    </Button>} 
                  />) : ( "" )
              }
              <GridLayout>
              
              </GridLayout>
            </Box>
          </Box>
        </>
      </>
    </Layout>
  );
};

export default HomePage;
