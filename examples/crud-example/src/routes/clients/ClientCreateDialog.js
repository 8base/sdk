import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField } from '@8base/boost';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CLIENT_CREATE_MUTATION = gql`
  mutation ClientCreate($data: ClientCreateInput!) {
    clientCreate(data: $data) {
      id
      createdAt
      updatedAt
      firstName
      lastName
      email
    }
  }
`;

const ClientCreateDialog = ({ closeModal }) => (
  <Mutation mutation={ CLIENT_CREATE_MUTATION } refetchQueries={ ['ClientsList'] }>
    {
      (clientCreate) => (
        <Dialog.Plate id="CLIENT_CREATE_DIALOG" size="sm">
          <Form tableSchemaName="Clients" onSubmit={ async (data) => { await clientCreate({ variables: { data }}); closeModal('CLIENT_CREATE_DIALOG'); } }>
            {
              ({ handleSubmit, invalid, submitting }) => (
                <form onSubmit={ handleSubmit }>
                  <Dialog.Header title="New Client" onClose={ () => closeModal('CLIENT_CREATE_DIALOG') } />
                  <Dialog.Body>
                    <Grid.Layout gap="xl" stretch>
                      <Grid.Box>
                        <Field name="firstName" type="text" placeholder="First Name" component={ InputField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="lastName" type="text" placeholder="Last Name" component={ InputField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="email" type="text" placeholder="Email Address" component={ InputField } />
                      </Grid.Box>
                    </Grid.Layout>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('CLIENT_CREATE_DIALOG') }>Cancel</Button>
                    <Button color="red" type="submit" text="Create Client" disabled={ invalid } loading={ submitting } />
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

export { ClientCreateDialog };
