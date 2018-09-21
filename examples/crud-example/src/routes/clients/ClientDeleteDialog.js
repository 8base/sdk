import React from 'react';
import { Form } from '@8base/forms';
import { Dialog, Button } from '@8base/boost';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete($data: ClientDeleteInput!) {
    clientDelete(data: $data) {
      success
    }
  }
`;

const ClientDeleteDialog = ({ closeModal }) => (
  <Mutation mutation={ CLIENT_DELETE_MUTATION } refetchQueries={ ['ClientsList'] }>
    {
      (clientDelete) => (
        <Dialog.Plate id="CLIENT_DELETE_DIALOG" size="sm">
          {
            ({ args }) => (
              <Form onSubmit={ async () => { await clientDelete({ variables: { data: { id: args.id }}}); closeModal('CLIENT_DELETE_DIALOG'); } }>
                {
                  ({ handleSubmit, invalid, submitting }) => (
                    <form onSubmit={ handleSubmit }>
                      <Dialog.Header title="Delete Client" onClose={ () => closeModal('CLIENT_DELETE_DIALOG') } />
                      <Dialog.Body>
                        Are you really want to delete client?
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('CLIENT_DELETE_DIALOG') }>Cancel</Button>
                        <Button color="red" type="submit" text="Delete Client" disabled={ invalid } loading={ submitting } />
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

export { ClientDeleteDialog };
