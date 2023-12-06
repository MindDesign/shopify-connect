/*
 *
 * products
 *
 */

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import Sidebar from '../../components/Sidebar';
import ConfirmSyncAllProducts from '../../components/ConfirmSyncAllProducts';

// Icons
import Check from '@strapi/icons/Check';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import Play from '@strapi/icons/Play';
import Trash from '@strapi/icons/Trash';
import Plus from '@strapi/icons/Plus';
import Cloud from '@strapi/icons/Cloud';

// Stuff
import { getFetchClient } from '@strapi/helper-plugin';
import { Link } from '@strapi/design-system/v2';
import {
  BaseHeaderLayout,
  Box,
  Layout,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
  VisuallyHidden,
  Flex,
  IconButton,
  Dots,
  Button,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink
} from '@strapi/design-system';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { formatMessage } = useIntl();
  const { post, get, del } = getFetchClient();
  const ROW_COUNT = 7;
  const COL_COUNT = 10;
  const urlParams = new URLSearchParams(window.location.search);
  const pageSize = urlParams.get('pageSize') != undefined ? urlParams.get('pageSize') : 10;
  const currentPage = urlParams.get('page') != undefined ? urlParams.get('page') : 1;
  const numPages = Math.round(count / pageSize);
  const start = (currentPage * pageSize) - pageSize;

  const getProductsCount = async () => {
    const data = await get(`/${pluginId}/product/count`);
    setCount(data.data);
  }

  const getProducts = async () => {
    const data = await get(`/${pluginId}/product?page=${start}&pageSize=${pageSize}`);
    setProducts(data.data);
  }

  const syncAllProducts = async () => {
    const data = await get(`/${pluginId}/product/shopify-sync`);
    console.log(data);
  }

  const deleteProduct = async (id) => {
    const res = await del(`/${pluginId}/product/delete/${id}`);

    if (res.status === 200) {
      getProducts();
    }
  }

  const onConfirm = async () => {
    console.log("onConfirm");
  }

  const toggleConfirm = async () => {
    setShowModal(!showModal);
  }

  useEffect(() => {
    getProductsCount();
    getProducts();
  }, [currentPage]);

  const productList = products.map(entry => <Tr key={entry.id}>
    <Td>
      <Typography textColor="neutral800">{entry.id}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800">{entry.title}</Typography>
    </Td>
  </Tr>)

  return (
    <Layout sideNav={<Sidebar />}>
      <>
        <BaseHeaderLayout
          navigationAction={<Link startIcon={<ArrowLeft />} to={`/plugins/${pluginId}`}>
            {formatMessage({
              id: getTrad('Products.BaseHeaderLayout.navigation'),
              defaultMessage: 'Go back'
            })}
          </Link>}
          //primaryAction={<Button startIcon={<Plus />}>Add an entry</Button>}
          secondaryAction={<Button onClick={syncAllProducts} startIcon={<Cloud />}>Sync all products</Button>}
          title={formatMessage({
            id: getTrad('Products.BaseHeaderLayout.title'),
            defaultMessage: 'Products'
          })}
          subtitle={formatMessage({
            id: getTrad('Products.BaseHeaderLayout.subTitle'),
            defaultMessage: `${count} products found`
          })} as="h2"
        />

        <Box padding={8} background="neutral100">
          <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">ID</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Title</Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {productList}
            </Tbody>
          </Table>

          <Pagination activePage={currentPage} pageCount={pageSize}>
            {
              currentPage <= 1
                ? <PreviousLink to={`/plugins/${pluginId}/products?page=${currentPage}&pageSize=${pageSize}`}>At the first page</PreviousLink>
                : <PreviousLink to={`/plugins/${pluginId}/products?page=${Number(currentPage) - 1}&pageSize=${pageSize}`}>Go to previous page</PreviousLink>
            }

            {
              count > 5
                ? (<>
                  <Flex>
                    <PageLink number={1} to={`/plugins/${pluginId}/products?page=${1}&pageSize=${pageSize}`}>Go to page 1</PageLink>
                    <Dots />
                    <PageLink number={numPages} to={`/plugins/${pluginId}/products?page=${1}&pageSize=${pageSize}`}>Go to page `${numPages}`</PageLink>
                  </Flex>
                </>)
                : [...Array(numPages)].map((x, i) => <PageLink number={i + 1} to={`/plugins/${pluginId}/products?page=${i + 1}&pageSize=${pageSize}`}>Go to page ${i + 1}</PageLink>)
            }

            <NextLink to={`/plugins/${pluginId}/products?page=${Number(numPages)}&pageSize=${pageSize}`}>Go to next page</NextLink>
          </Pagination>

        </Box>

        <ConfirmSyncAllProducts show={false} toggleConfirm={toggleConfirm} onConfirm={onConfirm} />
      </>
    </Layout>
  );
};

export default Products;
