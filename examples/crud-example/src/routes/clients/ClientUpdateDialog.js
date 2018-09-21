import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField } from '@8base/boost';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import * as R from 'ramda';

import { AsyncContent } from 'shared/components';

const CLIENT_QUERY = gql`
  query Client($id: ID!) {
    client(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

const CLIENT_UPDATE_MUTATION = gql`
  mutation ClientUpdate($data: ClientUpdateInput!) {
    clientUpdate(data: $data) {
      id
      firstName
      lastName
      email
    }
  }
`;

const ClientUpdateDialog = ({ closeModal }) => (
  <Mutation mutation={ CLIENT_UPDATE_MUTATION } refetchQueries={ ['ClientsList'] }>
    {
      (clientUpdate) => (
        <Dialog.Plate id="CLIENT_UPDATE_DIALOG" size="sm">
          {
            ({ args }) => (
              <Query query={ CLIENT_QUERY } variables={{ id: args.id }}>
                {
                  ({ data, loading }) => (
                    <AsyncContent loading={ loading } stretch>
                      <Form
                        tableSchemaName="Clients"
                        initialValues={ R.omit(['__typename'], data.client) }
                        onSubmit={ async (data) => { await clientUpdate({ variables: { data }}); closeModal('CLIENT_UPDATE_DIALOG'); } }
                      >
                        {
                          ({ handleSubmit, invalid, submitting }) => (
                            <form onSubmit={ handleSubmit }>
                              <Dialog.Header title="New Client" onClose={ () => closeModal('CLIENT_UPDATE_DIALOG') } />
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
                                <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('CLIENT_UPDATE_DIALOG') }>Cancel</Button>
                                <Button color="red" type="submit" text="Update Client" disabled={ invalid } loading={ submitting } />
                              </Dialog.Footer>
                            </form>
                          )
                        }
                      </Form>
                    </AsyncContent>
                  )
                }
              </Query>
            )
          }
        </Dialog.Plate>
      )
    }
  </Mutation>
);

export { ClientUpdateDialog };
