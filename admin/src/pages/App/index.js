/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AnErrorOccurred } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import WebhookPage from '../WebhookPage';
import ProductPage from '../ProductPage';
import CollectionPage from '../CollectionPage';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route path={`/plugins/${pluginId}/webhooks`} component={WebhookPage} exact />
        <Route path={`/plugins/${pluginId}/products`} component={ProductPage} exact />
        <Route path={`/plugins/${pluginId}/collections`} component={CollectionPage} exact />
        <Route component={AnErrorOccurred} />
      </Switch>
    </div>
  );
};

export default App;
