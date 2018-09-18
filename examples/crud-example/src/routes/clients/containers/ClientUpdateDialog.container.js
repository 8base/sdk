import React, { Component } from 'react';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { Form, Field } from '@8base/forms';
import { Mutation, Query } from 'react-apollo';
import { Dialog, Grid, Button, InputField, Loader, withModal } from '@8base/boost';
import { withRouter } from 'react-router-dom';

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

class ClientUpdateDialogContainer extends Component {
  createOnSubmit = (clientUpdate) => async (data) => {
    try {
      await clientUpdate({ variables: { data }});
    } catch (e) {
      // TODO: Handle errors
    }

    this.props.closeModal('CLIENT_UPDATE_DIALOG');
  };

  renderFormContent = ({ handleSubmit, submitting, invalid }) => {
    const { closeModal } = this.props;

    return (
      <form onSubmit={ handleSubmit }>
        <Dialog.Header title="Update Client" onClose={ () => closeModal('CLIENT_UPDATE_DIALOG') } />
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
    );
  };

  renderForm = (id) => (clientUpdate) => {
    const collectedProps = {
      onSubmit: this.createOnSubmit(clientUpdate),
      render: this.renderFormContent,
      tableSchemaName: 'Clients',
    };

    return (
      <Query query={ CLIENT_QUERY } variables={{ id }}>
        {
          ({ data, loading }) => {
            if (loading) return <Loader stretch />;

            return <Form { ...collectedProps } initialValues={ R.omit(['__typename'], data.client) } />;
          }
        }
      </Query>
    );
  }

  render() {
    return (
      <Dialog.Plate id="CLIENT_UPDATE_DIALOG" size="sm">
        {
          ({ args }) => {
            if (!args || !args.id) {
              return null;
            }

            return <Mutation mutation={ CLIENT_UPDATE_MUTATION } refetchQueries={ ['ClientsList'] }>{ this.renderForm(args.id) }</Mutation>;
          }
        }
      </Dialog.Plate>
    );
  }
}

ClientUpdateDialogContainer = compose(
  withRouter,
  withModal,
)(ClientUpdateDialogContainer);

export { ClientUpdateDialogContainer };
