import React, { Component } from 'react';
import { compose } from 'recompose';
import { Grid, Button, InputField } from '@8base/boost';
import { Form, Field } from '@8base/forms';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Dialog, withDialog } from 'shared/dialog';

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

class ClientCreateDialogContainer extends Component {
  createOnSubmit = (clientCreate) => async (data) => {
    try {
      await clientCreate({ variables: { data }});
    } catch (e) {
      // TODO: Handle errors
    }

    this.props.closeDialog('CLIENT_CREATE_DIALOG');
  };

  renderFormContent = ({ handleSubmit, submitting, invalid }) => {
    const { closeDialog } = this.props;

    return (
      <form onSubmit={ handleSubmit }>
        <Dialog.Header title="New Client" onClose={ () => closeDialog('CLIENT_CREATE_DIALOG') } />
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
          <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeDialog('CLIENT_CREATE_DIALOG') }>Cancel</Button>
          <Button color="red" type="submit" text="Create Client" disabled={ invalid } loading={ submitting } />
        </Dialog.Footer>
      </form>
    );
  };

  renderForm = (clientCreate) => {
    const collectedProps = {
      onSubmit: this.createOnSubmit(clientCreate),
      render: this.renderFormContent,
      tableSchemaName: 'Clients',
    };

    return <Form { ...collectedProps } />;
  }

  render() {
    return (
      <Dialog.Plate id="CLIENT_CREATE_DIALOG" size="sm">
        <Mutation mutation={ CLIENT_CREATE_MUTATION } refetchQueries={ ['ClientsList'] }>{ this.renderForm }</Mutation>
      </Dialog.Plate>
    );
  }
}

ClientCreateDialogContainer = compose(
  withRouter,
  withDialog,
)(ClientCreateDialogContainer);

export { ClientCreateDialogContainer };
