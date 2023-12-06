/*
 *
 * Confirm Sync All Products Component
 *
 */

import React, { useEffect, useState } from 'react';
import pluginId from '../../pluginId';
import { Dialog, DialogBody, DialogFooter, Button, Flex, Typography } from '@strapi/design-system';
import { ExclamationMarkCircle, Cloud } from '@strapi/icons';

export default function ConfirmSyncAllProducts({ show, toggleConfirm, onConfirm }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show])

  return <>
    <Dialog onClose={toggleConfirm} title="Confirmation" isOpen={isVisible}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">Are you sure you want to syncronize all products?</Typography>
          </Flex>
        </Flex>
      </DialogBody>
      <DialogFooter startAction={<Button onClick={toggleConfirm} variant="tertiary">
        Cancel
      </Button>} endAction={<Button onClick={onConfirm} variant="danger-light" startIcon={<Cloud />}>
        Confirm
      </Button>} />
    </Dialog>
  </>;
};
