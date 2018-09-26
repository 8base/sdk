import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, SelectField } from '@8base/boost';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

const CUSTOMER_CREATE_MUTATION = gql`
  mutation CustomerCreate($data: CustomerCreateInput!) {
    customerCreate(data: $data) {
      id
    }
  }
`;

const USERS_LIST_QUERY = gql`
  query UsersList {
    usersList {
      id
      firstName
      lastName
    }
  }
`;

const CustomerCreateDialog = ({ closeModal }) => (
  <Mutation mutation={ CUSTOMER_CREATE_MUTATION } refetchQueries={ ['CustomersList'] }>
    {
      (clientCreate) => (
        <Dialog.Plate id="CUSTOMER_CREATE_DIALOG" size="sm">
          <Form type="CREATE" tableSchemaName="Customers" onSubmit={ async (data) => { await clientCreate({ variables: { data }}); closeModal('CUSTOMER_CREATE_DIALOG'); } }>
            {
              ({ handleSubmit, invalid, submitting, pristine }) => (
                <form onSubmit={ handleSubmit }>
                  <Dialog.Header title="New Customer" onClose={ () => closeModal('CUSTOMER_CREATE_DIALOG') } />
                  <Dialog.Body>
                    <Grid.Layout gap="sm" stretch>
                      <Grid.Box>
                        <Query query={ USERS_LIST_QUERY }>
                          {
                            ({ data, loading }) => (
                              <Field
                                name="user"
                                label="User"
                                placeholder="Select a user"
                                component={ SelectField }
                                loading={ loading }
                                options={ loading ? [] : (data.usersList || []).map((user) => ({ value: user.id, label: `${user.firstName} ${user.lastName}` })) }
                                stretch
                              />
                            )
                          }
                        </Query>
                      </Grid.Box>
                    </Grid.Layout>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('CUSTOMER_CREATE_DIALOG') }>Cancel</Button>
                    <Button color="red" type="submit" text="Create Customer" disabled={ pristine || invalid } loading={ submitting } />
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

export { CustomerCreateDialog };
