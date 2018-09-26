import React from 'react';
import { Form } from '@8base/forms';
import { Dialog, Button } from '@8base/boost';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const PROPERTY_DELETE_MUTATION = gql`
  mutation PropertyDelete($data: PropertyDeleteInput!) {
    propertyDelete(data: $data) {
      success
    }
  }
`;

const PropertyDeleteDialog = ({ closeModal }) => (
  <Mutation mutation={ PROPERTY_DELETE_MUTATION } refetchQueries={ ['PropertiesList'] }>
    {
      (propertyDelete) => (
        <Dialog.Plate id="PROPERTY_DELETE_DIALOG" size="sm">
          {
            ({ args }) => (
              <Form onSubmit={ async () => { await propertyDelete({ variables: { data: { id: args.id }}}); closeModal('PROPERTY_DELETE_DIALOG'); } }>
                {
                  ({ handleSubmit, invalid, submitting }) => (
                    <form onSubmit={ handleSubmit }>
                      <Dialog.Header title="Delete Property" onClose={ () => closeModal('PROPERTY_DELETE_DIALOG') } />
                      <Dialog.Body>
                        Are you really want to delete property?
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('PROPERTY_DELETE_DIALOG') }>Cancel</Button>
                        <Button color="red" type="submit" text="Delete Property" disabled={ invalid } loading={ submitting } />
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

export { PropertyDeleteDialog };
