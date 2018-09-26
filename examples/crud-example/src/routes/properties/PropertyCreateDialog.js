import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField, FileInputField, CheckboxField } from '@8base/boost';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const PROPERTY_CREATE_MUTATION = gql`
  mutation PropertyCreate($data: PropertyCreateInput!) {
    propertyCreate(data: $data) {
      id
    }
  }
`;

const PropertyCreateDialog = ({ closeModal }) => (
  <Mutation mutation={ PROPERTY_CREATE_MUTATION } refetchQueries={ ['PropertiesList'] }>
    {
      (clientCreate) => (
        <Dialog.Plate id="PROPERTY_CREATE_DIALOG" size="sm">
          <Form type="CREATE" tableSchemaName="Properties" onSubmit={ async (data) => { await clientCreate({ variables: { data }}); closeModal('PROPERTY_CREATE_DIALOG'); } }>
            {
              ({ handleSubmit, invalid, submitting, pristine }) => (
                <form onSubmit={ handleSubmit }>
                  <Dialog.Header title="New Property" onClose={ () => closeModal('PROPERTY_CREATE_DIALOG') } />
                  <Dialog.Body>
                    <Grid.Layout gap="sm" stretch>
                      <Grid.Box>
                        <Field name="title" label="Title" type="text" component={ InputField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="description" label="Description" type="text" component={ InputField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="bedrooms" label="Bedrooms" type="text" component={ InputField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="sqFootage" label="Sq Footage" type="text" component={ InputField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="bathrooms" label="Bathrooms" type="text" component={ InputField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="pictures" label="Pictures" component={ FileInputField } multiple />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="garage" label="Garage" component={ CheckboxField } />
                      </Grid.Box>
                      <Grid.Box>
                        <Field name="pool" label="Pool" component={ CheckboxField } />
                      </Grid.Box>
                    </Grid.Layout>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeModal('PROPERTY_CREATE_DIALOG') }>Cancel</Button>
                    <Button color="red" type="submit" text="Create Property" disabled={ pristine || invalid } loading={ submitting } />
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

export { PropertyCreateDialog };
