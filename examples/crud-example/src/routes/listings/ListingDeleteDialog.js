import React from 'react';
import { Form } from '@8base/forms';
import { Dialog, Button } from '@8base/boost';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const LISTING_DELETE_MUTATION = gql`
  mutation ListingDelete($data: ListingDeleteInput!) {
    listingDelete(data: $data) {
      success
    }
  }
`;

const ListingDeleteDialog = ({ closeModal }) => (
  <Mutation mutation={ LISTING_DELETE_MUTATION } refetchQueries={ ['ListingsList'] }>
    {
      (listingDelete) => (
        <Dialog.Plate id="LISTING_DELETE_DIALOG" size="sm">
          {
            ({ args }) => (
              <Form onSubmit={ async () => { await listingDelete({ variables: { data: { id: args.id }}}); closeModal('LISTING_DELETE_DIALOG'); } }>
                {
                  ({ handleSubmit, invalid, submitting }) => (
                    <form onSubmit={ handleSubmit }>
                      <Dialog.Header title="Delete Listing" onClose={ () => closeModal('LISTING_DELETE_DIALOG') } />
                      <Dialog.Body>
                        Are you really want to delete listing?
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('LISTING_DELETE_DIALOG') }>Cancel</Button>
                        <Button color="red" type="submit" text="Delete Listing" disabled={ invalid } loading={ submitting } />
                      </Dialog.Footer>
                    </form>
                  )
                }
              </Form>
            )
          }
        </Dialog.Plate>
      )
    }
  </Mutation>
);

export { ListingDeleteDialog };
