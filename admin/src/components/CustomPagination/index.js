/*
 *
 * custom pagination
 *
 */

import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

// Stuff
import { Dots, NextLink, PageLink, Pagination, PreviousLink } from '@strapi/design-system/v2';
import { NavLink } from 'react-router-dom';

export default function CustomPagination({ numProducts, updateCurrentPage, updatePageSize }) {
  let urlParams = new URLSearchParams(window.location.search);
  let currentPage = Number(urlParams.get('page'));
  let pageSize = Number(urlParams.get('pageSize'));
  let numPages = Math.round(numProducts / pageSize);
  let prevPage = currentPage >= 1 ? currentPage - 1 : 1;
  let nextPage = currentPage <= numPages ? currentPage + 1 : numPages;

  console.log(prevPage, nextPage, numPages, pageSize);

  useEffect(() => {
    updateCurrentPage(currentPage);
    updatePageSize(pageSize);
  }, [urlParams])

  return <>
    <Pagination activePage={currentPage} pageCount={numPages}>
      <PreviousLink as={NavLink} to={`/plugins/${pluginId}/products?page=${prevPage}&pageSize=${pageSize}`}>At the first page</PreviousLink>
      <NextLink as={NavLink} to={`/plugins/${pluginId}/products?page=${nextPage}&pageSize=${pageSize}`}>At the first page</NextLink>
    </Pagination>
  </>
};
