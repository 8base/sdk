import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField } from '@8base/boost';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

const LISTING_SHARE_MUTATION = gql`
  mutation ListingShare($data: ListingShareInput!) {
    listingShare(data: $data) {
      success
    }
  }
`;

const ListingShareDialog = ({ closeModal }) => (
  <Mutation mutation={ LISTING_SHARE_MUTATION }>
    {
      (listingShare) => (
        <Dialog.Plate id="LISTING_SHARE_DIALOG" size="sm">
          <Form
            onSubmit={ async (data) => { await listingShare({ variables: { data }}); closeModal('LISTING_SHARE_DIALOG'); } }
          >
            {
              ({ handleSubmit, invalid, submitting, pristine }) => (
                <form onSubmit={ handleSubmit }>
                  <Dialog.Header title="Share Listing" onClose={ () => closeModal('LISTING_SHARE_DIALOG') } />
                  <Dialog.Body>
                    <Grid.Layout gap="sm" stretch>
                      <Grid.Box>
                        <Field name="email" label="Email" type="text" placeholder="Enter an email" component={ InputField } />
                      </Grid.Box>
                    </Grid.Layout>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('LISTING_SHARE_DIALOG') }>Cancel</Button>
                    <Button color="red" type="submit" text="Share Listing" disabled={ pristine || invalid } loading={ submitting } />
                  </Dialog.Footer>
                </form>
              )
            }
          </Form>
        </Dialog.Plate>
      )
    }
  </Mutation>
);

export { ListingShareDialog };
