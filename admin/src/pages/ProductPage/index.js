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
import CustomPagination from '../../components/CustomPagination';

// Icons
import ArrowLeft from '@strapi/icons/ArrowLeft';
import Trash from '@strapi/icons/Trash';
import Pencil from '@strapi/icons/Pencil';
import Cloud from '@strapi/icons/Cloud';

// Stuff
import { getFetchClient } from '@strapi/helper-plugin';
import { Link } from '@strapi/design-system/v2';
import {
  BaseHeaderLayout,
  Box,
  Flex,
  Layout,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
  Button,
  Avatar,
  AvatarGroup,
  VisuallyHidden,
  IconButton
} from '@strapi/design-system';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const { formatMessage } = useIntl();
  const { get, del } = getFetchClient();
  const ROW_COUNT = 7;
  const COL_COUNT = 10;

  const getProductsCount = async () => {
    const data = await get(`/${pluginId}/product/count`);
    setCount(data.data);
  }

  const getProducts = async () => {
    const data = await get(`/${pluginId}/product?page=${currentPage}&pageSize=${Number(pageSize)}`);
    setProducts(data.data);
  }

  const syncAllProducts = async () => {
    const data = await get(`/${pluginId}/product/shopify-sync`);
    //console.log(data);
  }

  const deleteProduct = async (id) => {
    const res = await del(`/${pluginId}/product/delete/${id}`);

    if (res.status === 200) {
      getProducts();
    }
  }

  const onConfirm = async () => {
    //console.log("onConfirm");
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
      <AvatarGroup>
        {entry?.variants?.filter(
          (obj, index) => 
            entry?.variants?.findIndex((item) => item.option1 === obj.option1) === index
        ).map(element => { return <Avatar src={`${element.image?.src}`} alt="" preview />})}
      </AvatarGroup>
    </Td>
    <Td>
      <Typography textColor="neutral800">{entry.title}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800">{entry.path?.path}</Typography>
    </Td>
    <Td>
      <Flex>
        <IconButton onClick={() => console.log('edit')} label="Edit" noBorder icon={<Pencil />} />
        <IconButton onClick={() => deleteProduct(entry.id)} label="Delete" noBorder icon={<Trash />} />
      </Flex>
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
          secondaryAction={<Button variant="secondary" onClick={syncAllProducts} startIcon={<Cloud />}>Sync all products</Button>}
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
                  <Typography variant="sigma">Image</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Title</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Handle</Typography>
                </Th>
                <Th>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {productList}
            </Tbody>
          </Table>

          <CustomPagination numProducts={count} updateCurrentPage={setCurrentPage} updatePageSize={setPageSize} />
        </Box>

        <ConfirmSyncAllProducts show={false} toggleConfirm={toggleConfirm} onConfirm={onConfirm} />
      </>
    </Layout>
  );
};

export default Products;
