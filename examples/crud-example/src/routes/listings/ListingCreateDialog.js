import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField, SelectField, DateInputField } from '@8base/boost';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import { FileInputField } from 'shared/components';

const LISTING_CREATE_MUTATION = gql`
  mutation ListingCreate($data: ListingCreateInput!) {
    listingCreate(data: $data) {
      id
    }
  }
`;

const BROKERS_LIST_QUERY = gql`
  query BrokersList {
    brokersList {
      items {
        id
        user {
          email
          firstName
          lastName
        }
      }
    }
  }
`;

const CUSTOMERS_LIST_QUERY = gql`
  query CustomersList {
    customersList {
      items {
        id
        user {
          email
          firstName
          lastName
        }
      }
    }
  }
`;

const PROPERTIES_LIST_QUERY = gql`
  query PropertiesList {
    propertiesList {
      items {
        id
        createdAt
        updatedAt
        pictures {
          items {
            downloadUrl
          }
        }
        bedrooms
        title
        description
        sqFootage
        bathrooms
        garage
        pool
      }
    }
  }
`;


const getPropertyOptions = (properties = []) => properties.map((property) => ({ value: property.id, label: property.title }));
const getUserOptions = (users = []) => users.map((item) => ({ value: item.id, label: `${item.user.firstName} ${item.user.lastName}` }));

const ListingCreateDialog = ({ closeModal }) => (
  <Mutation mutation={ LISTING_CREATE_MUTATION } refetchQueries={ ['ListingsList'] }>
    {
      (listingCreate) => (
        <Dialog.Plate id="LISTING_CREATE_DIALOG" size="sm">
          <Form
            type="CREATE"
            tableSchemaName="Listings"
            onSubmit={ async (data) => { await listingCreate({ variables: { data }}); closeModal('LISTING_CREATE_DIALOG'); } }
          >
            {
              ({ handleSubmit, invalid, submitting, pristine }) => (
                <form onSubmit={ handleSubmit }>
                  <Dialog.Header title="New Listing" onClose={ () => closeModal('LISTING_CREATE_DIALOG') } />
                  <Dialog.Body>
                    <Grid.Layout gap="sm" stretch>
                      <Grid.Box>
                        <Query query={ PROPERTIES_LIST_QUERY }>
                          {
                            ({ data, loading }) => (
                              <Field
                                name="property"
                                label="Property"
                                placeholder="Select a property"
                                component={ SelectField }
                                loading={ loading }
                                options={ loading ? [] : getPropertyOptions(data.propertiesList.items) }
                                stretch
                              />
                            )
                          }
                        </Query>
                      </Grid.Box>
                      <Grid.Box>
                        <Query query={ BROKERS_LIST_QUERY }>
                          {
                            ({ data, loading }) => (
                              <Field
                                name="broker"
                                label="Broker"
                                placeholder="Select a broker"
                                component={ SelectField }
                                loading={ loading }
                                options={ loading ? [] : getUserOptions(data.brokersList.items) }
                                stretch
                              />
                            )
                          }
                        </Query>
                      </Grid.Box>
                      <Query query={ CUSTOMERS_LIST_QUERY }>
                        {
                          ({ data, loading }) => (
                            <React.Fragment>
                              <Grid.Box>
                                <Field
                                  name="buyer"
                                  label="Buyer"
                                  placeholder="Select a buyer"
                                  component={ SelectField }
                                  loading={ loading }
                                  options={ loading ? [] : getUserOptions(data.customersList.items) }
                                  stretch
                                />
                              </Grid.Box>
                              <Grid.Box>
                                <Field
                                  name="seller"
                                  label="Seller"
                                  placeholder="Select a seller"
                                  component={ SelectField }
                                  loading={ loading }
                                  options={ loading ? [] : getUserOptions(data.customersList.items) }
                                  stretch
                                />
                              </Grid.Box>
                            </React.Fragment>
                          )
                        }
                      </Query>
                      <Grid.Box>
                        <Field
                          name="status"
                          label="Status"
                          placeholder="Select a status"
                          component={ SelectField }
                          options={ [
                            { label: 'Lead', value: 'Lead' },
                            { label: 'Closing', value: 'Closing' },
                            { label: 'Active', value: 'Active' },
                            { label: 'Closed', value: 'Closed' },
                            { label: 'Cancelled', value: 'Cancelled' },
                          ] }
                          stretch
                        />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="price" label="Price" type="text" placeholder="Price" component={ InputField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="documents" label="Documents" component={ FileInputField } maxFiles={ 3 } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="closingDate" label="Closing Date" component={ DateInputField } stretch />
                      </Grid.Box>
                    </Grid.Layout>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('LISTING_CREATE_DIALOG') }>Cancel</Button>
                    <Button color="red" type="submit" text="Create Listing" disabled={ pristine || invalid } loading={ submitting } />
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

export { ListingCreateDialog };
