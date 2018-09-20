import React, { Component } from 'react';
import { compose } from 'recompose';
import { css } from 'emotion';
import { Form, Field } from '@8base/forms';
import { withLogIn } from '@8base/auth';
import { Grid, Button, InputField, Heading } from '@8base/boost';
import { withRouter } from 'react-router-dom';

const formClassName = css`
  width: 320px;
`;

class LogInContainer extends Component {
  onSubmit = async (data) => {
    const { history, logIn } = this.props;

    await logIn(data);

    history.push('/dashboard');
  };

  renderFormContent = ({ handleSubmit, submitting, invalid }) => {
    // TODO: Add validation
    return (
      <form className={ formClassName } onSubmit={ handleSubmit }>
        <Grid.Layout gap="xl">
          <Grid.Box alignItems="center">
            <Heading type="h3">Log In</Heading>
          </Grid.Box>
          <Grid.Box>
            <Field name="email" type="text" placeholder="Email Address" component={ InputField } />
          </Grid.Box>
          <Grid.Box>
            <Field name="password" type="password" placeholder="Password" component={ InputField } />
          </Grid.Box>
          <Grid.Box justifyContent="center">
            <Button size="lg" color="red" type="submit" text="Log In" disabled={ invalid } loading={ submitting } />
          </Grid.Box>
        </Grid.Layout>
      </form>
    );
  };

  render() {
    const collectedProps = {
      onSubmit: this.onSubmit,
      render: this.renderFormContent,
    };

    return <Form { ...collectedProps } />;
  }
}

LogInContainer = compose(
  withLogIn,
  withRouter,
)(LogInContainer);

export { LogInContainer };
