/*
 *
 * collections
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

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [shopifyCount, setShopifyCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const { formatMessage } = useIntl();
  const { get, del } = getFetchClient();
  const ROW_COUNT = 7;
  const COL_COUNT = 10;

  const getCollectionsCount = async () => {
    const data = await get(`/${pluginId}/collection/count`);
    setCount(data.data);
  }

  const getShopifyCollectionsCount = async () => {
    const data = await get(`/${pluginId}/collection/shopify-count`);
    setShopifyCount(data.data);
  }

  const getCollections = async () => {
    const data = await get(`/${pluginId}/collection?page=${currentPage * pageSize}&pageSize=${Number(pageSize)}`);
    setCollections(data.data);
  }

  const syncAllCollections = async () => {
    const data = await get(`/${pluginId}/collection/sync`);
    console.log(data);
  }

  const deleteCollection = async (id) => {
    const res = await del(`/${pluginId}/collection/delete/${id}`);

    if (res.status === 200) {
      getCollections();
    }
  }

  const onConfirm = async () => {
    //console.log("onConfirm");
  }

  const toggleConfirm = async () => {
    setShowModal(!showModal);
  }

  useEffect(() => {
    getCollectionsCount();
    getShopifyCollectionsCount();
    getCollections();
  }, []);

  const collectionList = collections.map(entry => <Tr key={entry.id}>
    <Td>
      <Typography textColor="neutral800">{entry.id}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800">{entry.title}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800">{entry.handle}</Typography>
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
          secondaryAction={<Button variant="secondary" onClick={syncAllCollections} startIcon={<Cloud />}>Sync all collections</Button>}
          title={formatMessage({
            id: getTrad('Products.BaseHeaderLayout.title'),
            defaultMessage: 'Collections'
          })}
          subtitle={formatMessage({
            id: getTrad('Products.BaseHeaderLayout.subTitle'),
            defaultMessage: `${count} / ${shopifyCount} collections found`
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
                <Th>
                  <Typography variant="sigma">Handle</Typography>
                </Th>
                <Th>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {collectionList}
            </Tbody>
          </Table>

          <CustomPagination numProducts={count} updateCurrentPage={setCurrentPage} updatePageSize={setPageSize} />
        </Box>

        <ConfirmSyncAllProducts show={false} toggleConfirm={toggleConfirm} onConfirm={onConfirm} />
      </>
    </Layout>
  );
};

export default Collections;
