/*
 *
 * Webhooks
 *
 */

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import Sidebar from '../../components/Sidebar';

// Icons
import Check from '@strapi/icons/Check';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import Play from '@strapi/icons/Play';
import Trash from '@strapi/icons/Trash';

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
  NextLink,
  PageLink,
  Pagination,
  PreviousLink
} from '@strapi/design-system';

const Webhooks = () => {
  const [webhooks, setWebhooks] = useState([]);
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

  const getWebhooksCount = async () => {
    const data = await get(`/${pluginId}/webhook/count`);
    setCount(data.data);
  }

  const getWebhooks = async () => {
    const data = await get(`/${pluginId}/webhook?page=${start}&pageSize=${pageSize}`);
    setWebhooks(data.data);
  }

  const deleteWebhook = async (id) => {
    const res = await del(`/${pluginId}/webhook/delete/${id}`);

    if (res.status === 200) {
      getWebhooks();
    }
  }

  const processWebhook = async (id) => {
    const res = await post(`/${pluginId}/webhook/process/${id}`);
    if (res.status === 200 || res.status === 204) {
      getWebhooks();
    }
  }

  useEffect(() => {
    getWebhooksCount();
    getWebhooks();
  }, [currentPage]);

  const webhookList = webhooks.map(entry => <Tr key={entry.id}>
    <Td>
      <Typography textColor="neutral800">{entry.id}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800" onClick={() => setShowModal(true)} ellipsis>{entry.webhook_id}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800">{entry.topic}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800">{`
        ${new Date(entry.triggered_at).toLocaleDateString()} ${new Date(entry.triggered_at).toLocaleTimeString()}
      `}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800">{entry.is_test ? 'yes' : 'no'}</Typography>
    </Td>
    <Td>
      <Typography textColor="neutral800">{entry.is_processed ? 'yes' : 'no'}</Typography>
    </Td>
    <Td>
      <Flex>
        {
          entry.is_test
            ? <IconButton onClick={() => { }} label="Don't run tests" noBorder icon={<Check />} />
            : ''
        }
        {
          !entry.is_test
            ? entry.is_processed
              ? <IconButton onClick={() => console.log('void')} label="Already processed" noBorder icon={<Check />} />
              : <IconButton onClick={() => processWebhook(entry.id)} label="Process" noBorder icon={<Play />} />
            : ''
        }
        <IconButton onClick={() => deleteWebhook(entry.id)} label="Delete" noBorder icon={<Trash />} />
      </Flex>
    </Td>
  </Tr>)

  return (
    <Layout sideNav={<Sidebar />}>
      <>
        <BaseHeaderLayout
          navigationAction={<Link startIcon={<ArrowLeft />} to={`/plugins/${pluginId}`}>
            {formatMessage({
              id: getTrad('Webhooks.BaseHeaderLayout.navigation'),
              defaultMessage: 'Go back'
            })}
          </Link>}
          title={formatMessage({
            id: getTrad('Webhooks.BaseHeaderLayout.title'),
            defaultMessage: 'Webhooks'
          })}
          subtitle={formatMessage({
            id: getTrad('Webhooks.BaseHeaderLayout.subTitle'),
            defaultMessage: `${count} webhooks found`
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
                  <Typography variant="sigma">Shopify webhook ID</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Topic</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Triggered at</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Test</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Processed</Typography>
                </Th>
                <Th>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {webhookList}
            </Tbody>
          </Table>

          <Pagination activePage={currentPage} pageCount={pageSize}>
            {
              currentPage <= 1
                ? <PreviousLink to={`/plugins/${pluginId}/webhooks?page=${currentPage}&pageSize=${pageSize}`}>At the first page</PreviousLink>
                : <PreviousLink to={`/plugins/${pluginId}/webhooks?page=${Number(currentPage) - 1}&pageSize=${pageSize}`}>Go to previous page</PreviousLink>
            }

            {
              count > 5
                ? (<>
                  <Flex>
                    <PageLink number={1} to={`/plugins/${pluginId}/webhooks?page=${1}&pageSize=${pageSize}`}>Go to page 1</PageLink>
                    <Dots />
                    <PageLink number={numPages} to={`/plugins/${pluginId}/webhooks?page=${1}&pageSize=${pageSize}`}>Go to page `${numPages}`</PageLink>
                  </Flex>
                </>)
                : [...Array(numPages)].map((x, i) => <PageLink number={i + 1} to={`/plugins/${pluginId}/webhooks?page=${i + 1}&pageSize=${pageSize}`}>Go to page ${i + 1}</PageLink>)
            }

            <NextLink to={`/plugins/${pluginId}/webhooks?page=${Number(numPages)}&pageSize=${pageSize}`}>Go to next page</NextLink>
          </Pagination>

        </Box>

        {showModal && <WebhookJsonPayloadViewerModal setShowModal={setShowModal} />}
      </>
    </Layout>
  );
};

export default Webhooks;
